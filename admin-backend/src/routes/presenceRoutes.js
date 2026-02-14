// backend/routes/presenceRoutes.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js'; // Импортирай твоя auth middleware

const router = express.Router();

// In-memory store за онлайн статуси
// Структура: { userId: lastSeenTimestamp }
const onlineUsers = new Map();

// Потребителят се смята за "онлайн" ако е пратил heartbeat в последните 30 секунди
const ONLINE_THRESHOLD_MS = 30 * 1000;

// ──────────────────────────────────────────────
// POST /api/presence/heartbeat
// Пращай го от frontend на всеки 20 секунди
// ──────────────────────────────────────────────
router.post('/heartbeat', authenticateToken, (req, res) => {
  const userId = req.user.id;
  onlineUsers.set(userId, Date.now());
  res.json({ ok: true });
});

// ──────────────────────────────────────────────
// POST /api/presence/offline
// Пращай го при logout или beforeunload
// ──────────────────────────────────────────────
router.post('/offline', authenticateToken, (req, res) => {
  const userId = req.user.id;
  onlineUsers.delete(userId);
  res.json({ ok: true });
});

// ──────────────────────────────────────────────
// GET /api/presence/status/:userId
// Проверява дали конкретен потребител е онлайн
// ──────────────────────────────────────────────
router.get('/status/:userId', authenticateToken, (req, res) => {
  const targetId = parseInt(req.params.userId);
  const lastSeen = onlineUsers.get(targetId);

  if (!lastSeen) {
    return res.json({ online: false, lastSeen: null });
  }

  const isOnline = Date.now() - lastSeen < ONLINE_THRESHOLD_MS;

  res.json({
    online: isOnline,
    lastSeen: isOnline ? null : new Date(lastSeen).toISOString(),
  });
});

// ──────────────────────────────────────────────
// POST /api/presence/status/batch
// Проверява статуса на много потребители наведнъж
// Body: { userIds: [1, 2, 3] }
// ──────────────────────────────────────────────
router.post('/status/batch', authenticateToken, (req, res) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds)) {
    return res.status(400).json({ error: 'userIds трябва да е масив' });
  }

  const result = {};
  userIds.forEach((id) => {
    const lastSeen = onlineUsers.get(id);
    if (!lastSeen) {
      result[id] = { online: false, lastSeen: null };
    } else {
      const isOnline = Date.now() - lastSeen < ONLINE_THRESHOLD_MS;
      result[id] = {
        online: isOnline,
        lastSeen: isOnline ? null : new Date(lastSeen).toISOString(),
      };
    }
  });

  res.json({ statuses: result });
});

// ──────────────────────────────────────────────
// Автоматично почистване на стари записи на всеки 5 минути
// ──────────────────────────────────────────────
setInterval(() => {
  const cutoff = Date.now() - 5 * 60 * 1000; // 5 минути
  for (const [userId, lastSeen] of onlineUsers.entries()) {
    if (lastSeen < cutoff) {
      onlineUsers.delete(userId);
    }
  }
}, 5 * 60 * 1000);

export default router;
