// server.js — ПОПРАВЕНА ВЕРСИЯ

import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { Emotion, ChatMessage, Therapist } from "./models/models.js";
import User from "./models/User.js";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ---------------------
// CORS
// ---------------------
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "X-User-Id"]
}));

// ---------------------
// Парсване на JSON
// ---------------------
app.use(express.json());

// ---------------------
// Simple logger
// ---------------------
app.use((req, res, next) => {
  const userId = req.header("X-User-Id") || req.ip;
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} | User: ${userId}`);
  next();
});

// ---------------------
// AI Chat (OpenRouter)
// ---------------------
app.post("/api/chat/ai", async (req, res) => {
  const userId = req.header("X-User-Id") || req.ip;
  const { message } = req.body || {};

  if (!message) return res.status(400).json({ error: "Missing message" });

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Ти си MindLink — AI терапевт, който говори само на български. Бъди кратък, човешки и емпатичен.",
          },
          { role: "user", content: message },
        ],
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        }
      }
    );

    let aiReply =
      response.data?.choices?.[0]?.message?.content ||
      response.data?.generated_text ||
      "🤖 Няма отговор.";

    aiReply = aiReply.replace(/<s>|<\/s>/g, "").trim();

    res.json({ reply: aiReply });
  } catch (err) {
    res.status(500).json({ error: "AI error", details: err.message });
  }
});

// ---------------------
// Save chat message
// ---------------------
app.post("/api/chat", async (req, res) => {
  try {
    const userId = req.header("X-User-Id") || req.ip;
    const msg = new ChatMessage({ ...req.body, userId });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------
// Load chat history
// ---------------------
app.get("/api/chat/:userId", async (req, res) => {
  try {
    const messages = await ChatMessage
      .find({ userId: req.params.userId })
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------
// ✅ EMOTIONS - ПОПРАВЕНО
// ---------------------
app.get("/api/emotions/:userId", async (req, res) => {
  try {
    const emotions = await Emotion
      .find({ userId: req.params.userId })
      .sort({ timestamp: -1 });

    res.json(emotions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/emotions", async (req, res) => {
  try {
    const userId = req.header("X-User-Id") || req.ip;
    
    // ✅ Приемаме mood, energy, note от фронтенда
    const { mood, energy, note } = req.body;

    if (!mood || !energy) {
      return res.status(400).json({ error: "mood and energy are required" });
    }

    const emotion = new Emotion({
      userId,
      mood: Number(mood),
      energy: Number(energy),
      note: note || ""
    });

    await emotion.save();
    
    console.log("✅ Saved emotion:", emotion);
    
    res.status(201).json(emotion);
  } catch (err) {
    console.error("❌ Error saving emotion:", err);
    res.status(400).json({ error: err.message });
  }
});

// ---------------------
// Therapists Catalog
// ---------------------
app.get("/api/therapists", async (req, res) => {
  try {
    const { city, specialty, search } = req.query;

    let query = {};

    if (city && city !== "Всички градове") query.city = city;
    if (specialty && specialty !== "Всички специалности") query.specialty = specialty;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { expertise: { $regex: search, $options: "i" } }
      ];
    }

    const therapists = await Therapist.find(query);
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------
// Auth routes
// ---------------------
app.use("/api/auth", authRoutes);

// ---------------------
// CONNECT DB & START SERVER
// ---------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;