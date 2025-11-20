import mongoose from "mongoose";

const JournalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  prompt: String,
  content: { type: String, required: true },
  tags: [String],
  isPrivate: { type: Boolean, default: true },
  wordCount: Number,
  createdAt: { type: Date, default: Date.now }
});
import Journal from '../models/Journal.js'; // или твоя Journal модел
import UserStats from '../models/UserStats.js';
import { checkUserBadges } from '../utils/checkUserBadges.js';

export const createJournalEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prompt, content, tags = [], isPrivate = true, wordCount = 0 } = req.body;

    const entry = await Journal.create({
      userId,
      prompt,
      content,
      tags,
      isPrivate,
      wordCount
    });

    // update stats
    const stats = await UserStats.findOneAndUpdate(
      { userId },
      { $inc: { journalEntries: 1 } },
      { new: true, upsert: true }
    );

    // check badges
    const newBadges = await checkUserBadges(userId);

    res.status(201).json({ success: true, entry, newBadges });
  } catch (err) {
    console.error('Journal save error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export default mongoose.model("Journal", JournalSchema);