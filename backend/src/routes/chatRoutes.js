const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware.js');
const { Op } = require('sequelize');
const sequelize = require('../../config/database');

const router = express.Router();

router.use(requireAuth);

// Get messages between current user and another user
router.get('/messages/:otherUserId', async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { otherUserId } = req.params;

    const [messages] = await sequelize.query(
      `SELECT id, "userId" as sender_id, "recipientId" as recipient_id, text,
              TO_CHAR(timestamp, 'HH24:MI') as time
       FROM "ChatMessages"
       WHERE ("userId" = :currentUserId AND "recipientId" = :otherUserId)
          OR ("userId" = :otherUserId AND "recipientId" = :currentUserId)
       ORDER BY timestamp ASC`,
      {
        replacements: { currentUserId, otherUserId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send message
router.post('/send', async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recipientId, text } = req.body;

    if (!text || !recipientId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    await sequelize.query(
      `INSERT INTO "ChatMessages" (id, "userId", "recipientId", text, timestamp, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), :senderId, :recipientId, :text, NOW(), NOW(), NOW())`,
      {
        replacements: { senderId, recipientId, text },
        type: sequelize.QueryTypes.INSERT
      }
    );

    res.json({ 
      success: true, 
      message: 'Message sent'
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
