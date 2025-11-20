import ChatMessage from '../models/ChatMessage.js';
import UserStats from '../models/UserStats.js';
import { checkUserBadges } from '../utils/checkUserBadges.js';

export const createChatMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, isAi = false } = req.body;

    const msg = await ChatMessage.create({
      userId,
      message,
      isAi
    });

    // only count user messages (not AI replies)
    if (!isAi) {
      await UserStats.findOneAndUpdate(
        { userId },
        { $inc: { chatbotMessages: 1 } },
        { new: true, upsert: true }
      );
    }

    // check badges
    const newBadges = await checkUserBadges(userId);

    res.status(201).json({ success: true, msg, newBadges });
  } catch (err) {
    console.error('Chat create error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
export default { getChatMessages, createChatMessage };
