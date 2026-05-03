# Noor AI Studio - Project Summary

## What the website is about
**Noor AI Studio** is a cinematic AI image generation platform. It allows users to describe a scene, choose a style and size, and generate high-quality artwork using advanced neural networks in seconds. 

### Key Features:
- **AI Image Generation**: Powered by Cloudflare Workers AI using the Stable Diffusion XL Lightning model.
- **Smart Guardrail**: Uses the Llama 3 8B Instruct model to validate user prompts, ensuring they are asking for images rather than asking general questions or coding help.
- **User Authentication & Data**: Email-based login with persistent, per-user data isolation. Users have a personal gallery of their generated images and a persistent chat history stored in MongoDB.
- **Modern UI**: A responsive, dark/light mode React frontend with an interactive chat-like interface.
- **Tech Stack**:
  - **Frontend**: React 18, Vite, Tailwind CSS, Lucide React.
  - **Backend**: Node.js, Express 5, MongoDB + Mongoose.
  - **Deployment**: Vercel (both frontend and backend).

---

## Important Code Context

Here are the most critical parts of the codebase that handle the core logic (the AI integration and the frontend chat/image generation UI). You can provide this to Claude or GPT for context.

### 1. Backend: AI Controller (`server/controllers/aiController.js`)
This handles the prompt validation (guardrail) and the actual image generation via Cloudflare AI.

```javascript
import axios from 'axios';
import Image from '../models/Image.js';

export const generateImage = async (req, res) => {
  const { prompt, style, size } = req.body;
  const userId = req.headers['x-user-id'];

  if (!prompt) return res.status(400).json({ error: "Please provide a prompt." });
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim();

  try {
    // 1. THE GUARDRAIL: Llama 3 8B Instruct
    const guardrailPrompt = `
You are a classification assistant. The user wants to use an AI image generator. 
Determine if the following user input is asking for an image/art to be generated.
If they are asking a conversational question, coding help, or general knowledge, respond with exactly "INVALID".
If they are describing a scene, an image, artwork, or anything visual to be generated, respond with exactly "VALID".

User Input: "${prompt}"
Classification:`;

    const guardrailResponse = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3-8b-instruct`,
      { messages: [{ role: "user", content: guardrailPrompt }] },
      { headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' } }
    );

    const classification = guardrailResponse.data.result.response.trim();

    if (classification.includes("INVALID") || !classification.includes("VALID")) {
      return res.status(400).json({ 
        error: "I am Noor AI, a cinematic visual studio. That is not my niche. Please ask me to generate an image." 
      });
    }

    // 2. THE IMAGE GENERATOR: Stable Diffusion XL Lightning
    const enhancedPrompt = `${style ? style + ' style, ' : ''}highly detailed, 8k resolution, cinematic lighting, ${prompt}`;
    const sizePromptStr = size ? ` ${size} aspect ratio` : "";

    const imageResponse = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`,
      { prompt: enhancedPrompt + sizePromptStr, num_steps: 4 },
      {
        headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
        responseType: 'arraybuffer' // Get binary data
      }
    );

    // Convert binary data to base64
    const base64Image = Buffer.from(imageResponse.data).toString('base64');
    const dataURI = `data:image/jpeg;base64,${base64Image}`;

    // Save to MongoDB
    const newImage = new Image({ userId, prompt, style, size, imageBase64: dataURI });
    const savedImage = await newImage.save();

    res.json(savedImage);

  } catch (error) {
    console.error("AI Generation Error:", error.response?.data || error.message);
    res.status(500).json({ error: "An error occurred while generating your image. Please try again later." });
  }
};
```

### 2. Frontend: Dashboard Logic (`client/src/pages/Dashboard.jsx` snippet)
This handles the frontend flow of submitting a prompt, showing a loading state, and displaying the generated image in a chat interface.

```javascript
  const generateImage = async (prompt, style, size) => {
    setIsGenerating(true);
    
    // Create new chat if none exists
    let activeChatId = currentChatId;
    if (!activeChatId) {
      const newChat = await createNewChat(prompt);
      activeChatId = newChat._id;
      setCurrentChatId(activeChatId);
    }

    // 1. Add User Prompt
    const userMsg = { id: Date.now().toString(), role: 'user', content: prompt, style, size };
    let updatedMessages = [...currentMessages, userMsg];
    setCurrentMessages(updatedMessages);

    // 2. Add AI Loading
    const loadingMsgId = (Date.now() + 1).toString();
    updatedMessages = [...updatedMessages, { id: loadingMsgId, role: 'ai', isLoading: true }];
    setCurrentMessages(updatedMessages);

    try {
      // 3. Make API Call to generate image
      const response = await axios.post(`${API}/api/generate`, { prompt, style, size }, { headers });
      const savedImage = response.data; // This is the Image document from MongoDB

      fetchGallery(); // Refresh gallery

      // Replace loading with completed AI response
      updatedMessages = updatedMessages.map(m => 
        m.id === loadingMsgId 
          ? { ...m, isLoading: false, imageId: savedImage } 
          : m
      );
      
      setCurrentMessages(updatedMessages);

      // Save updated messages to MongoDB Chat
      await axios.put(`${API}/api/chats/${activeChatId}`, { messages: updatedMessages }, { headers });
      fetchChats(); // Update sidebar

    } catch (error) {
      let errorMessage = error.response?.data?.error || "An error occurred while communicating with the server.";

      updatedMessages = updatedMessages.map(m => 
        m.isLoading ? { ...m, isLoading: false, error: errorMessage } : m
      );
      setCurrentMessages(updatedMessages);
      await axios.put(`${API}/api/chats/${activeChatId}`, { messages: updatedMessages }, { headers });
    } finally {
      setIsGenerating(false);
    }
  };
```

### 3. Backend: Entry Point (`server/server.js`)
Configures the Express server, CORS, MongoDB connection, and payload limits (crucial for base64 images).

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from any origin (needed for Vercel frontend -> Vercel backend)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

// Increase payload limit for Base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noor-ai')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api', apiRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Noor AI Server running on http://localhost:${PORT}`);
  });
}

export default app;
```
