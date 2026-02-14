import JournalEntry from '../models/JournalEntry.js';
import User from '../models/User.js';
import { encrypt, decrypt } from '../utils/crypto.js';

/**
 * POST /api/journal
 * Създава нов дневников запис
 */
export const createJournalEntry = async (req, res) => {
  try {
    const { 
      userId, 
      prompt, 
      content, 
      tags = [], 
      isPrivate = true, 
      wordCount = 0 
    } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId и content са задължителни' 
      });
    }

    console.log('📤 Creating journal entry:', { 
      userId, 
      contentLength: content.length,
      tags: tags.length,
      wordCount 
    });

    // Криптира съдържанието
    const textEnc = encrypt(content);

    // Криптира prompt ако съществува
    const promptEnc = prompt ? encrypt(prompt) : null;

    // Създава запис
    const entry = await JournalEntry.create({
      userId,
      promptEnc,
      textEnc,
      tags,
      isPrivate,
      wordCount,
      createdAt: new Date()
    });

    console.log('✅ Journal entry created:', entry._id);

    // Обновява user stats
    await User.findByIdAndUpdate(
      userId,
      { 
        $inc: { 'stats.totalJournalEntries': 1 },
        $set: { lastActive: new Date() }
      },
      { upsert: true }
    );

    // Връща декриптирана версия
    res.status(201).json({
      success: true,
      entry: {
        _id: entry._id,
        userId: entry.userId,
        prompt: prompt || '',
        content: content,
        tags: entry.tags,
        isPrivate: entry.isPrivate,
        wordCount: entry.wordCount,
        date: entry.createdAt,
        createdAt: entry.createdAt
      }
    });

  } catch (err) {
    console.error('❌ Journal save error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Грешка при запазване на дневник',
      details: err.message 
    });
  }
};

/**
 * GET /api/journal/:userId
 * Зарежда дневникови записи
 */
export const getJournalEntries = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId е задължителен' 
      });
    }

    console.log('📥 Fetching journal entries for user:', userId);

    const entries = await JournalEntry
      .find({ userId })
      .sort({ createdAt: -1 }) // Най-новите първи
      .limit(parseInt(limit))
      .lean();

    console.log(`✅ Found ${entries.length} journal entries`);

    // Декриптира записите
    const decryptedEntries = entries.map(entry => ({
      _id: entry._id,
      userId: entry.userId,
      prompt: entry.promptEnc ? decrypt(entry.promptEnc) : '',
      content: decrypt(entry.textEnc),
      tags: entry.tags || [],
      isPrivate: entry.isPrivate,
      wordCount: entry.wordCount,
      date: entry.createdAt,
      createdAt: entry.createdAt
    }));

    res.json({
      success: true,
      entries: decryptedEntries
    });

  } catch (err) {
    console.error('❌ Get journal error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Грешка при зареждане на дневник',
      details: err.message 
    });
  }
};

export default { createJournalEntry, getJournalEntries };