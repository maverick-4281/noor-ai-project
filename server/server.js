import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import apiRoutes from "./routes/apiRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS FIX (important)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://noor-ai-project-qdksbrpx3-maverick-4281s-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
    credentials: true,
  })
);

// ✅ Handle preflight requests explicitly (important for Vercel)
app.options("*", cors());

// ✅ Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ MongoDB connection (safe for serverless)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = conn.connections[0].readyState === 1;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err);
  }
};

// Connect before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ✅ Routes
app.use("/api", apiRoutes);

// ✅ Health check route (VERY useful for debugging)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ❌ DO NOT use app.listen on Vercel
// Vercel handles server automatically

export default app;