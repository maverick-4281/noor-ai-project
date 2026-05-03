# 🌟 Noor AI Studio

> **A cinematic AI image generation platform** — Describe a scene, choose a style, and let advanced neural networks render breathtaking 8K artwork in seconds.

![Noor AI Studio](https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200&auto=format&fit=crop)

---

## ✨ Features

- 🎨 **AI Image Generation** — Powered by Cloudflare Workers AI (Stable Diffusion XL Lightning)
- 🛡️ **Smart Guardrail** — Llama 3 8B Instruct validates prompts to ensure only image-generation requests are processed
- 💬 **Persistent Chat History** — Every conversation is saved per-user in MongoDB
- 🖼️ **Personal Gallery** — All generated images are stored and privately accessible per user
- 🔐 **User Authentication** — Email-based login with per-user data isolation
- 🌙 **Dark / Light Mode** — Toggle between cinematic dark and light themes
- 📱 **Responsive Design** — Fully responsive across desktop and mobile
- 🚀 **Deployed on Vercel** — Frontend and backend both on Vercel (monorepo structure)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Vite | Build tool & dev server |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Lucide React | Icon library |
| Tailwind CSS | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Cloudflare Workers AI | Image generation (SDXL Lightning) |
| Cloudflare Workers AI | Prompt guardrail (Llama 3 8B) |
| CORS | Cross-origin request handling |
| dotenv | Environment variable management |

### Deployment
| Service | Role |
|---|---|
| Vercel | Frontend hosting (static) |
| Vercel Serverless | Backend API hosting |
| MongoDB Atlas | Cloud database |

---

## 📁 Project Structure

```
noor-ai-project/
│
├── client/                         # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── AuthModal.jsx       # Login / Sign-up modal
│       │   ├── ChatInput.jsx       # Prompt input with style & size pickers
│       │   ├── ImageCard.jsx       # Gallery image card
│       │   ├── Navbar.jsx          # Top navigation bar
│       │   └── Sidebar.jsx         # Chat history sidebar
│       ├── context/
│       │   ├── AuthContext.jsx     # User auth state (localStorage)
│       │   └── DataContext.jsx     # Chats & gallery state + API calls
│       ├── pages/
│       │   ├── LandingPage.jsx     # Public landing/hero page
│       │   ├── Dashboard.jsx       # Main chat + image generation UI
│       │   └── GalleryPage.jsx     # User's private image gallery
│       ├── App.jsx                 # Routes + protected route logic
│       └── main.jsx                # Entry point
│
└── server/                         # Express backend
    ├── controllers/
    │   ├── aiController.js         # Image generation logic (Cloudflare AI)
    │   ├── chatController.js       # CRUD for chat sessions
    │   └── galleryController.js    # Gallery fetch & delete
    ├── models/
    │   ├── Chat.js                 # Mongoose Chat schema (userId-scoped)
    │   └── Image.js                # Mongoose Image schema (userId-scoped)
    ├── routes/
    │   └── apiRoutes.js            # Express route definitions
    ├── server.js                   # Express app entry point
    ├── vercel.json                 # Vercel serverless config
    └── .env                        # Environment variables (not committed)
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- Cloudflare account with Workers AI enabled

### 1. Clone the repository

```bash
git clone https://github.com/codesarthaksingh/noor-ai-project.git
cd noor-ai-project
```

### 2. Set up the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/noor-ai
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
PORT=3000
```

Start the backend:

```bash
npm start
```

The API will be running at `http://localhost:3000`.

### 3. Set up the Frontend

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (Atlas or local) |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Workers AI permission |
| `PORT` | Port for local server (default: `3000`) |

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (local or deployed) |

---

## 🌐 API Endpoints

All endpoints require the `x-user-id` header (set to the logged-in user's email) for per-user data isolation.

### Image Generation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/generate` | Generate an image from a prompt |

**Request Body:**
```json
{
  "prompt": "sunset over mountains",
  "style": "Cinematic",
  "size": "Landscape"
}
```

### Chat

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/chats` | Get all chats for the current user |
| `GET` | `/api/chats/:id` | Get a single chat with messages |
| `POST` | `/api/chats` | Create a new chat |
| `PUT` | `/api/chats/:id` | Update chat messages |

### Gallery

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/gallery` | Get all images for the current user |
| `DELETE` | `/api/gallery/:id` | Delete an image from the gallery |

---

## 🤖 How AI Generation Works

```
User Prompt
     │
     ▼
┌─────────────────────────────┐
│  Llama 3 8B Instruct        │  ← Guardrail: Is this an image request?
│  (Cloudflare Workers AI)    │
└─────────────┬───────────────┘
              │
         VALID / INVALID
              │
     VALID ───┼─── INVALID → Return error message
              │
              ▼
┌─────────────────────────────┐
│  Stable Diffusion XL        │  ← Image generation
│  Lightning (Cloudflare AI)  │
└─────────────┬───────────────┘
              │
              ▼
      Base64 image saved
      to MongoDB (per user)
              │
              ▼
      Returned to frontend
      + Added to gallery
```

---

## 🔒 Per-User Data Isolation

All data in the database is scoped to individual users:

- Every `Chat` document has a `userId` field (the user's email)
- Every `Image` document has a `userId` field
- All API queries filter by `userId` from the `x-user-id` request header
- Users can only read, write, and delete their own data

---

## ☁️ Deployment (Vercel)

### Backend

The server is deployed as a Vercel Serverless Function using `vercel.json`:

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

Set the following environment variables in the Vercel dashboard for the server project:
- `MONGODB_URI`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

### Frontend

The client is deployed as a standard Vite static site. Set:
- `VITE_API_URL` → your deployed backend URL (e.g. `https://noor-ai-project-server.vercel.app`)

---

## 📸 Screenshots

| Landing Page | Studio (Dashboard) | Gallery |
|---|---|---|
| Cinematic hero with login | Chat + image generation UI | Personal image collection |

---

## 🧑‍💻 Author

**Sarthak Singh**
- GitHub: [@codesarthaksingh](https://github.com/codesarthaksingh)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using React, Express, MongoDB & Cloudflare AI
</p>
