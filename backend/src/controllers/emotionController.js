// controllers/emotionController.js
import MoodEntry from '../models/Emotion.js';
import User from '../models/User.js';
import { encrypt, decrypt } from '../utils/crypto.js';

/**
 * GET /api/emotions/:userId
 */
export const getEmotions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId е задължителен' 
      });
    }

    console.log('📥 Fetching emotions for user:', userId);

    const emotions = await MoodEntry
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    console.log(`✅ Found ${emotions.length} emotions`);

    const decryptedEmotions = emotions.map(emotion => ({
      _id: emotion._id,
      userId: emotion.userId,
      mood: emotion.mood,
      energy: emotion.energy,
      note: emotion.noteEnc ? decrypt(emotion.noteEnc) : '',
      timestamp: emotion.timestamp || emotion.createdAt,
      date: emotion.timestamp || emotion.createdAt
    }));

    res.json(decryptedEmotions);

  } catch (err) {
    console.error('❌ Error fetching emotions:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Грешка при зареждане на емоциите',
      details: err.message 
    });
  }
};

/**
 * POST /api/emotions
 */
export const createEmotion = async (req, res) => {
  try {
    const userId = req.headers['x-ml-user'];
    const { mood, energy, note } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId липсва (header x-ml-user)' 
      });
    }

    if (!mood || !energy) {
      return res.status(400).json({ 
        success: false, 
        error: 'mood и energy са задължителни' 
      });
    }

    if (mood < 1 || mood > 5 || energy < 1 || energy > 5) {
      return res.status(400).json({ 
        success: false, 
        error: 'mood и energy трябва да са между 1 и 5' 
      });
    }

    console.log('📤 Creating emotion:', { userId, mood, energy, noteLength: note?.length });

    const noteEnc = note ? encrypt(note) : null;

    const emotion = await MoodEntry.create({
      userId,
      mood: Number(mood),
      energy: Number(energy),
      noteEnc,
      timestamp: new Date()
    });

    console.log('✅ Emotion created:', emotion._id);

    try {
      await User.findByIdAndUpdate(
        userId,
        { 
          $inc: { 'stats.totalMoodEntries': 1 },
          $set: { lastActive: new Date() }
        },
        { upsert: true }
      );
    } catch (userErr) {
      console.log('⚠️ User stats update skipped:', userErr.message);
    }

    res.status(201).json({
      success: true,
      data: {
        _id: emotion._id,
        userId: emotion.userId,
        mood: emotion.mood,
        energy: emotion.energy,
        note: note || '',
        timestamp: emotion.timestamp || emotion.createdAt,
        date: emotion.timestamp || emotion.createdAt
      }
    });

  } catch (err) {
    console.error('❌ Error creating emotion:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Грешка при създаване на емоция',
      details: err.message 
    });
  }
};

export default { getEmotions, createEmotion };