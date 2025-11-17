// models/models.js - ИЗЧИСТЕНА ВЕРСИЯ

import mongoose from 'mongoose';

// ⚠️ МАХАМЕ EmotionPost и оставяме САМО Emotion
// Защото EmotionShare използва mood/energy/note

const EmotionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mood: { type: Number, required: true, min: 1, max: 5 },
  energy: { type: Number, required: true, min: 1, max: 5 },
  note: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now }
});

const chatMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  isAi: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  specialty: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  expertise: [String],
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  availability: String,
  image: String
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ ЕКСПОРТИРАМЕ САМО Emotion (не EmotionPost)
export const Emotion = mongoose.model("Emotion", EmotionSchema);
export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export const Therapist = mongoose.model('Therapist', therapistSchema);