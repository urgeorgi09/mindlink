import express from "express";
import mongoose from "mongoose";
import { createJournalEntry, getJournalEntries } from "../controllers/journalController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createJournalEntry);
router.get("/", authMiddleware, getJournalEntries);

// ============= SCHEMAS =============

// Journal Entry Schema
const journalEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  prompt: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  isPrivate: { type: Boolean, default: true },
  wordCount: Number,
  createdAt: { type: Date, default: Date.now }
});

// Badge Schema
const badgeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  badgeId: String,
  unlockedAt: { type: Date, default: Date.now }
});

// User Stats
const userStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  loginStreak: { type: Number, default: 0 },
  lastLoginDate: Date,
  journalEntries: { type: Number, default: 0 },
  aiConversations: { type: Number, default: 0 },
  breathingExercises: { type: Number, default: 0 },
  meditationMinutes: { type: Number, default: 0 },
  moodEntries: { type: Number, default: 0 },
  goalsCreated: { type: Number, default: 0 },
  communityInteractions: { type: Number, default: 0 }
});

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);
const Badge = mongoose.model("Badge", badgeSchema);
const UserStats = mongoose.model("UserStats", userStatsSchema);

// ============= ROUTES =============

// Get all journal entries
router.get("/", async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new entry
router.post("/", async (req, res) => {
  try {
    const { prompt, content, tags, isPrivate } = req.body;

    const wordCount = content.trim().split(/\s+/).length;

    const entry = new JournalEntry({
      userId: req.user.id,
      prompt,
      content,
      tags,
      isPrivate,
      wordCount
    });

    await entry.save();

    await updateUserStats(req.user.id, { journalEntries: 1 });
    await checkAndUnlockBadges(req.user.id);

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Prompts
router.get("/prompts", (req, res) => {
  res.json([
    {
      category: "reflection",
      prompts: [
        "Каква е една малка победа от миналата седмица?",
        "Какво те направи щастлив/а днес?"
      ]
    },
    {
      category: "gratitude",
      prompts: [
        "За какво си благодарен/а днес?",
        "Кой направи деня ти по-добър?"
      ]
    }
  ]);
});

// Badges
router.get("/badges", async (req, res) => {
  try {
    const unlocked = await Badge.find({ userId: req.user.id });
    const stats = await UserStats.findOne({ userId: req.user.id });

    const allBadges = [
      {
        id: "journal_10",
        name: "Начинаещ Писател",
        unlocked: unlocked.some(b => b.badgeId === "journal_10"),
        progress: Math.min((stats?.journalEntries || 0) / 10 * 100, 100)
      },
      {
        id: "streak_7",
        name: "7-дневен Воин",
        unlocked: unlocked.some(b => b.badgeId === "streak_7"),
        progress: Math.min((stats?.loginStreak || 0) / 7 * 100, 100)
      }
    ];

    res.json(allBadges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============= HELPERS =============

async function updateUserStats(userId, updates) {
  let stats = await UserStats.findOne({ userId });

  if (!stats) {
    stats = new UserStats({ userId });
  }

  const today = new Date().setHours(0, 0, 0, 0);
  const last = stats.lastLoginDate
    ? new Date(stats.lastLoginDate).setHours(0, 0, 0, 0)
    : null;

  if (last) {
    const diff = (today - last) / (1000 * 60 * 60 * 24);
    stats.loginStreak = diff === 1 ? stats.loginStreak + 1 : 1;
  } else {
    stats.loginStreak = 1;
  }

  stats.lastLoginDate = new Date();

  for (const key in updates) {
    stats[key] = (stats[key] || 0) + updates[key];
  }

  await stats.save();
  return stats;
}

async function checkAndUnlockBadges(userId) {
  const stats = await UserStats.findOne({ userId });
  if (!stats) return;

  const conditions = [
    { id: "journal_10", ok: stats.journalEntries >= 10 },
    { id: "streak_7", ok: stats.loginStreak >= 7 }
  ];

  for (const badge of conditions) {
    if (badge.ok) {
      const exists = await Badge.findOne({ userId, badgeId: badge.id });
      if (!exists) {
        await new Badge({ userId, badgeId: badge.id }).save();
      }
    }
  }
}

export default router;
