import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Journal Entry Schema
const journalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  isPrivate: { type: Boolean, default: true },
  wordCount: Number,
  createdAt: { type: Date, default: Date.now }
});

// Badge/Achievement Schema
const badgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badgeId: String,
  unlockedAt: { type: Date, default: Date.now }
});

// User Stats Schema for tracking progress
const userStatsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
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

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);
const Badge = mongoose.model('Badge', badgeSchema);
const UserStats = mongoose.model('UserStats', userStatsSchema);

// Middleware to verify authentication
const authMiddleware = (req, res, next) => {
  // Add your JWT verification here
  // For now, assuming userId is in req.user
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// ============= JOURNAL ROUTES =============

// Get all journal entries for user
router.get('/journal', authMiddleware, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new journal entry
router.post('/journal', authMiddleware, async (req, res) => {
  try {
    const { prompt, content, tags, isPrivate } = req.body;
    
    const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    
    const entry = new JournalEntry({
      userId: req.user.id,
      prompt,
      content,
      tags,
      isPrivate,
      wordCount
    });
    
    await entry.save();
    
    // Update user stats
    await updateUserStats(req.user.id, { journalEntries: 1 });
    
    // Check for badges
    await checkAndUnlockBadges(req.user.id);
    
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get AI prompt suggestions
router.get('/journal/prompts', authMiddleware, async (req, res) => {
  const prompts = [
    {
      category: 'reflection',
      prompts: [
        'Каква е една малка победа от миналата седмица, за която си горд/а?',
        'Какво те направи щастлив/а днес?',
        'Кой беше най-важният разговор днес и защо?'
      ]
    },
    {
      category: 'gratitude',
      prompts: [
        'За какво си благодарен/а днес?',
        'Кой човек направи деня ти по-добър и как?',
        'Какво малко нещо те зарадва днес?'
      ]
    },
    {
      category: 'growth',
      prompts: [
        'Каква е една промяна, която искаш да направиш?',
        'Какво предизвикателство преодоля напоследък?',
        'В коя област искаш да растеш повече?'
      ]
    }
  ];
  
  res.json(prompts);
});

// ============= BADGES ROUTES =============

// Get user's badges
router.get('/badges', authMiddleware, async (req, res) => {
  try {
    const unlockedBadges = await Badge.find({ userId: req.user.id });
    const stats = await UserStats.findOne({ userId: req.user.id });
    
    const allBadges = [
      {
        id: 'first_login',
        name: 'Първа Стъпка',
        description: 'Направи първия си вход',
        icon: '👋',
        category: 'start',
        unlocked: true,
        progress: 100
      },
      {
        id: 'streak_7',
        name: '7-Дневен Воин',
        description: 'Използвай приложението 7 дни подред',
        icon: '🔥',
        category: 'streak',
        unlocked: unlockedBadges.some(b => b.badgeId === 'streak_7'),
        progress: Math.min((stats?.loginStreak || 0) / 7 * 100, 100)
      },
      {
        id: 'journal_10',
        name: 'Начинаещ Писател',
        description: 'Напиши 10 дневникови записа',
        icon: '✍️',
        category: 'journal',
        unlocked: unlockedBadges.some(b => b.badgeId === 'journal_10'),
        progress: Math.min((stats?.journalEntries || 0) / 10 * 100, 100)
      },
      {
        id: 'ai_chat_10',
        name: 'AI Приятел',
        description: 'Разговаряй с AI помощник 10 пъти',
        icon: '🤖',
        category: 'chat',
        unlocked: unlockedBadges.some(b => b.badgeId === 'ai_chat_10'),
        progress: Math.min((stats?.aiConversations || 0) / 10 * 100, 100)
      },
      {
        id: 'breathing_50',
        name: 'Дихателен Майстор',
        description: 'Завърши 50 дихателни упражнения',
        icon: '🌬️',
        category: 'breathing',
        unlocked: unlockedBadges.some(b => b.badgeId === 'breathing_50'),
        progress: Math.min((stats?.breathingExercises || 0) / 50 * 100, 100)
      }
    ];
    
    res.json(allBadges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= USER STATS ROUTES =============

// Get user stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    let stats = await UserStats.findOne({ userId: req.user.id });
    
    if (!stats) {
      stats = new UserStats({ userId: req.user.id });
      await stats.save();
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user stats (called after activities)
router.post('/stats/update', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;
    await updateUserStats(req.user.id, updates);
    
    const stats = await UserStats.findOne({ userId: req.user.id });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track breathing exercise completion
router.post('/breathing/complete', authMiddleware, async (req, res) => {
  try {
    const { technique, cycles, duration } = req.body;
    
    await updateUserStats(req.user.id, { breathingExercises: 1 });
    await checkAndUnlockBadges(req.user.id);
    
    res.json({ success: true, message: 'Exercise tracked!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= HELPER FUNCTIONS =============

async function updateUserStats(userId, updates) {
  let stats = await UserStats.findOne({ userId });
  
  if (!stats) {
    stats = new UserStats({ userId });
  }
  
  // Update login streak
  const today = new Date().setHours(0, 0, 0, 0);
  const lastLogin = stats.lastLoginDate ? new Date(stats.lastLoginDate).setHours(0, 0, 0, 0) : null;
  
  if (lastLogin) {
    const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) {
      stats.loginStreak += 1;
    } else if (daysDiff > 1) {
      stats.loginStreak = 1;
    }
  } else {
    stats.loginStreak = 1;
  }
  
  stats.lastLoginDate = new Date();
  
  // Apply other updates
  for (const [key, value] of Object.entries(updates)) {
    if (typeof value === 'number') {
      stats[key] = (stats[key] || 0) + value;
    } else {
      stats[key] = value;
    }
  }
  
  await stats.save();
  return stats;
}

async function checkAndUnlockBadges(userId) {
  const stats = await UserStats.findOne({ userId });
  if (!stats) return;
  
  const badgeCriteria = [
    { id: 'streak_7', condition: stats.loginStreak >= 7 },
    { id: 'streak_30', condition: stats.loginStreak >= 30 },
    { id: 'journal_10', condition: stats.journalEntries >= 10 },
    { id: 'journal_100', condition: stats.journalEntries >= 100 },
    { id: 'ai_chat_10', condition: stats.aiConversations >= 10 },
    { id: 'breathing_50', condition: stats.breathingExercises >= 50 }
  ];
  
  for (const badge of badgeCriteria) {
    if (badge.condition) {
      const exists = await Badge.findOne({ userId, badgeId: badge.id });
      if (!exists) {
        await new Badge({ userId, badgeId: badge.id }).save();
        // You could emit a socket event here for real-time notification
      }
    }
  }
}

export default router;