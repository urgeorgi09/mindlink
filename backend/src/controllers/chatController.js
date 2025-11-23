// controllers/chatController.js
import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js';

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
      .sort({ createdAt: 1 }) // Най-старите първи (за хронология)
      .limit(parseInt(limit))
      .lean();

    console.log(`✅ Found ${messages.length} messages`);

    // Форматира съобщенията
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      userId: msg.userId,
      message: msg.message,
      isAi: msg.isAi,
      sentiment: msg.sentiment,
      timestamp: msg.createdAt
    }));

    res.json({
      success: true,
      messages: formattedMessages
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
    const { userId, message, isAi = false, sentiment = 'neutral' } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId и message са задължителни' 
      });
    }

    console.log('📤 Creating chat message:', { 
      userId, 
      isAi, 
      messageLength: message.length 
    });

    // Създава съобщение с правилните полета от модела
    const msg = await ChatMessage.create({
      userId,
      message: message,
      isAi: isAi,
      sentiment: sentiment
    });

    console.log('✅ Message created:', msg._id);

    // Обновява stats само за user съобщения
    if (!isAi) {
      try {
        await User.findByIdAndUpdate(
          userId,
          { 
            $inc: { 'stats.totalChatMessages': 1 },
            $set: { lastActive: new Date() }
          },
          { upsert: true }
        );
      } catch (userErr) {
        // Игнорирай грешки при обновяване на user stats
        console.log('⚠️ User stats update skipped:', userErr.message);
      }
    }

    res.status(201).json({
      success: true,
      msg: {
        _id: msg._id,
        userId: msg.userId,
        message: msg.message,
        isAi: msg.isAi,
        sentiment: msg.sentiment,
        timestamp: msg.createdAt
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

/**
 * DELETE /api/chat/:userId
 * Изтрива всички съобщения на потребител
 */
export const deleteChatMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId е задължителен' 
      });
    }

    const result = await ChatMessage.deleteMany({ userId });

    console.log(`🗑️ Deleted ${result.deletedCount} messages for user:`, userId);

    res.json({
      success: true,
      deletedCount: result.deletedCount
    });

  } catch (err) {
    console.error('❌ Chat delete error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Грешка при изтриване на съобщенията',
      details: err.message 
    });
  }
};

/**
 * GET /api/chat/:userId/stats
 * Връща статистика за чата
 */
export const getChatStats = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId е задължителен' 
      });
    }

    const stats = await ChatMessage.getStats(userId);

    res.json({
      success: true,
      stats
    });

  } catch (err) {
    console.error('❌ Chat stats error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Грешка при зареждане на статистиката',
      details: err.message 
    });
  }
};

export default { 
  getChatMessages, 
  createChatMessage, 
  deleteChatMessages,
  getChatStats 
};