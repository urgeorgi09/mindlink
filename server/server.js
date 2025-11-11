// Hugging Face Mistral-7B-Instruct chat endpoint
import fetch from 'node-fetch';

app.post('/api/hf-chat', async (req, res) => {
  try {
    const { message } = req.body;
    const HF_API_KEY = process.env.HF_API_KEY;
    if (!HF_API_KEY) {
      return res.status(500).json({ error: 'Hugging Face API key not set in .env (HF_API_KEY)' });
    }
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: message }),
    });
    const result = await response.json();
    if (Array.isArray(result) && result[0]?.generated_text) {
      res.json({ reply: result[0].generated_text });
    } else {
      res.status(500).json({ error: 'No reply from Hugging Face API', details: result });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { EmotionPost, ChatMessage, Therapist, User } from './models.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Emotion Posts Routes
app.get('/api/emotions', async (req, res) => {
  try {
    const posts = await EmotionPost.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/emotions', async (req, res) => {
  try {
    const post = new EmotionPost(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Chat Messages Routes
app.get('/api/chat/:userId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.params.userId })
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const message = new ChatMessage(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Therapists Routes
app.get('/api/therapists', async (req, res) => {
  try {
    const { city, specialty, search } = req.query;
    let query = {};
    
    if (city && city !== 'Всички градове') {
      query.city = city;
    }
    if (specialty && specialty !== 'Всички специалности') {
      query.specialty = specialty;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { expertise: { $regex: search, $options: 'i' } }
      ];
    }
    
    const therapists = await Therapist.find(query);
    res.json(therapists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/therapists', async (req, res) => {
  try {
    const therapist = new Therapist(req.body);
    await therapist.save();
    res.status(201).json(therapist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Users Routes
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});