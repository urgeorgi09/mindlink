import { Emotion } from '../models/index.js';

// GET /api/emotions/:userId - Зарежда емоциите на потребителя
export const getEmotions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const emotions = await Emotion
      .find({ userId })
      .sort({ timestamp: -1 });

    res.json(emotions);
  } catch (err) {
    console.error('❌ Error fetching emotions:', err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/emotions - Създава нова емоция
export const createEmotion = async (req, res) => {
  try {
    const userId = req.header('X-User-Id') || req.ip;
    const { mood, energy, note } = req.body;

    if (!mood || !energy) {
      return res.status(400).json({ error: 'mood and energy are required' });
    }

    const emotion = new Emotion({
      userId,
      mood: Number(mood),
      energy: Number(energy),
      note: note || ''
    });

    await emotion.save();
    
    console.log('✅ Saved emotion:', emotion);
    
    res.status(201).json(emotion);
  } catch (err) {
    console.error('❌ Error creating emotion:', err);
    res.status(400).json({ error: err.message });
  }
};