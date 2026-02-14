const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware.js');
const { ChatMessage } = require('../models'); // Импортираме модела
const { encrypt, decrypt } = require('../utils/crypto'); // Твоят крипто модул
const { Op } = require('sequelize');

const router = express.Router();
router.use(requireAuth);

// Взимане на съобщения
router.get('/messages/:otherUserId', async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { otherUserId } = req.params;

    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { userId: currentUserId, recipientId: otherUserId },
          { userId: otherUserId, recipientId: currentUserId }
        ]
      },
      order: [['timestamp', 'ASC']]
    });

    // Дешифриране на съобщенията преди изпращане към фронтенда
    const decryptedMessages = messages.map(msg => ({
      id: msg.id,
      sender_id: msg.userId,
      recipient_id: msg.recipientId,
      text: decrypt(msg.textEnc), // Дешифрираме тук
      timestamp: msg.timestamp
    }));

    res.json({ success: true, messages: decryptedMessages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Изпращане на съобщение
router.post('/send', async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recipientId, text } = req.body;

    if (!text) return res.status(400).json({ error: 'Text is required' });

    // Криптираме съобщението СЕГА
    const encryptedText = encrypt(text);

    const newMessage = await ChatMessage.create({
      userId: senderId,
      recipientId: recipientId,
      textEnc: encryptedText, // Записваме криптирания низ
      timestamp: new Date()
    });

    res.json({ success: true, messageId: newMessage.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;