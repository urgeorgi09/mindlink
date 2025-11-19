import mongoose from 'mongoose';

// ==================== EMOTION MODEL ====================
const EmotionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mood: { type: Number, required: true, min: 1, max: 5 },
  energy: { type: Number, required: true, min: 1, max: 5 },
  note: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now }
});

// ==================== CHAT MESSAGE MODEL ====================
const ChatMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  isAi: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

// ==================== THERAPIST MODEL ====================
const TherapistSchema = new mongoose.Schema({
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

// ==================== USER MODEL ====================
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// ==================== EXPORTS ====================
export const Emotion = mongoose.model('Emotion', EmotionSchema);
export const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
export const Therapist = mongoose.model('Therapist', TherapistSchema);
export const User = mongoose.model('User', UserSchema);