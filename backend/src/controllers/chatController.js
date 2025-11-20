import ChatMessage from '../models/ChatMessage.js';
import UserStats from '../models/UserStats.js';
import { checkUserBadges } from '../utils/checkUserBadges.js';

// GET /chat/messages
export const getChatMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await ChatMessage.find({ userId }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error('Chat fetch error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /chat/messages
export const createChatMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, isAi = false } = req.body;

    const msg = await ChatMessage.create({
      userId,
      message,
      isAi
    });

    if (!isAi) {
      await UserStats.findOneAndUpdate(
        { userId },
        { $inc: { chatbotMessages: 1 } },
        { new: true, upsert: true }
      );
    }

    const newBadges = await checkUserBadges(userId);

    res.status(201).json({ success: true, msg, newBadges });
  } catch (err) {
    console.error('Chat create error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export default { getChatMessages, createChatMessage };
