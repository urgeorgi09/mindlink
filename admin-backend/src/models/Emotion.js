// backend/src/models/Emotion.js
import mongoose from "mongoose";

const EmotionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  mood: { type: Number, required: true, min: 1, max: 5 },
  energy: { type: Number, required: true, min: 1, max: 5 },
  note: { type: String, default: "" },
  noteEnc: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

export default mongoose.models.Emotion || mongoose.model("Emotion", EmotionSchema);