import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

/** Reuse one connection across warm serverless invocations (see MongoDB + Vercel guides). */
const g = globalThis;

if (!g.__mongooseConn) {
  g.__mongooseConn = { conn: null, promise: null };
}

const cache = g.__mongooseConn;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || typeof uri !== "string") {
    throw new Error("MONGODB_URI is not set");
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}
