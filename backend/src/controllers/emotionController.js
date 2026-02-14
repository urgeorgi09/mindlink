import Emotion from '../models/Emotion.js';
import User from '../models/User.js';
import sequelize from '../config/database.js'; // За транзакциите
import { encrypt, decrypt } from '../utils/crypto.js';

export const getEmotions = async (req, res) => {
  try {
    // ВЗЕМАМЕ ID-ТО ОТ JWT (req.user), а не от params, за сигурност
    const userId = req.user.id; 

    const emotions = await Emotion.findAll({
      where: { userId },
      order: [['timestamp', 'DESC']],
      limit: 100,
      raw: true // Подобно на .lean() в Mongoose
    });

    const decryptedEmotions = emotions.map(emotion => ({
      ...emotion,
      note: emotion.noteEnc ? decrypt(emotion.noteEnc) : '',
      // Премахваме криптираното поле от отговора за чистота
      noteEnc: undefined 
    }));

    res.json({ success: true, data: decryptedEmotions });
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ success: false, error: 'Грешка при извличане' });
  }
};

export const createEmotion = async (req, res) => {
  // Стартираме транзакция - Enterprise стандарт
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id; // Идентификация от JWT Middleware
    const { mood, energy, note } = req.body;

    // Валидация (може да се изнесе в Middleware)
    if (!mood || !energy || mood < 1 || mood > 5 || energy < 1 || energy > 5) {
      return res.status(400).json({ success: false, error: 'Невалидни данни' });
    }

    const noteEnc = note ? encrypt(note) : null;

    // 1. Създаваме емоцията в транзакцията
    const emotion = await Emotion.create({
      userId,
      mood: Number(mood),
      energy: Number(energy),
      noteEnc,
      timestamp: new Date()
    }, { transaction: t });

    // 2. Обновяваме потребителя в същата транзакция
    const user = await User.findByPk(userId, { transaction: t });
    if (user) {
      await user.increment('totalMoodEntries', { by: 1, transaction: t });
      await user.update({ lastActive: new Date() }, { transaction: t });
    }

    // Ако всичко е наред - записваме в базата
    await t.commit();

    res.status(201).json({
      success: true,
      data: {
        id: emotion.id,
        mood: emotion.mood,
        energy: emotion.energy,
        note: note || '',
        timestamp: emotion.timestamp
      }
    });

  } catch (err) {
    // Ако някъде се случи грешка - връщаме всичко назад
    await t.rollback();
    console.error('❌ Transaction failed:', err);
    res.status(500).json({ success: false, error: 'Грешка при запис' });
  }
};