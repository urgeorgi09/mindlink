import { ChatMessage } from '../models/index.js';

// GET /api/chat/:userId - Зарежда чат историята
export const getChatMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const messages = await ChatMessage
      .find({ userId })
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error('❌ Error fetching messages:', err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/chat - Записва ново съобщение
export const createChatMessage = async (req, res) => {
  try {
    const userId = req.header('X-User-Id') || req.ip;
    
    const msg = new ChatMessage({ 
      ...req.body, 
      userId 
    });
    
    await msg.save();
    
    res.status(201).json(msg);
  } catch (err) {
    console.error('❌ Error creating message:', err);
    res.status(400).json({ error: err.message });
  }
};