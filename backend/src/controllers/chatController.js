import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js';
import { encrypt, decrypt } from '../utils/crypto.js';

/**
 * GET /api/chat/:userId
 * Зарежда чат съобщенията
 */
export const getChatMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId е задължителен' 
      });
    }

    console.log('📥 Fetching chat messages for user:', userId);

    const messages = await ChatMessage
      .find({ userId })
      .sort({ timestamp: 1 })
      .limit(parseInt(limit))
      .lean();

    console.log(`✅ Found ${messages.length} messages`);

    // Декриптира съобщенията
    const decryptedMessages = messages.map(msg => ({
      _id: msg._id,
      userId: msg.userId,
      message: decrypt(msg.contentEnc),
      isAi: msg.role === 'assistant',
      role: msg.role,
      timestamp: msg.timestamp,
      createdAt: msg.timestamp
    }));

    res.json({
      success: true,
      messages: decryptedMessages
    });

  } catch (err) {
    console.error('❌ Chat fetch error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Грешка при зареждане на чат',
      details: err.message 
    });
  }
};

/**
 * POST /api/chat
 * Създава ново чат съобщение
 */
export const createChatMessage = async (req, res) => {
  try {
    // Вземи userId от header (автоматично добавен от axios)
    const userId = req.headers['x-ml-user'];
    const { message, isAi = false } = req.body;

    // Валидация
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId липсва (header x-ml-user)' 
      });
    }

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'message е задължително' 
      });
    }

    console.log('📤 Creating chat message:', { 
      userId, 
      isAi, 
      messageLength: message.length 
    });

    // Криптира съобщението
    const contentEnc = encrypt(message);
    
    // Определи role
    const role = isAi ? 'assistant' : 'user';

    console.log('🔐 Encrypted data:', {
      contentEnc: contentEnc ? 'exists' : 'missing',
      role: role
    });

    // Създава съобщение
    const msg = await ChatMessage.create({
      userId: userId,
      role: role,
      contentEnc: contentEnc,
      timestamp: new Date()
    });

    console.log('✅ Message created:', msg._id);

    // Обновява stats само за user съобщения
    if (!isAi) {
      await User.findByIdAndUpdate(
        userId,
        { 
          $inc: { 'stats.totalChatMessages': 1 },
          $set: { lastActive: new Date() }
        },
        { upsert: true }
      );
    }

    // Връща декриптирана версия
    res.status(201).json({
      success: true,
      msg: {
        _id: msg._id,
        userId: msg.userId,
        message: message,
        isAi: isAi,
        role: msg.role,
        timestamp: msg.timestamp
      }
    });

  } catch (err) {
    console.error('❌ Chat create error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Грешка при създаване на съобщение',
      details: err.message 
    });
  }
};

export default { getChatMessages, createChatMessage };
