import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const onlineUsers = new Map();
const ONLINE_THRESHOLD_MS = 30 * 1000; // 30 секунди

router.use(authenticateToken);

// Heartbeat - извиква се от фронтенда на всеки 20 сек.
router.post('/heartbeat', (req, res) => {
    onlineUsers.set(req.user.id, Date.now());
    res.status(204).send();
});

// Вземане на статус за списък от потребители (Batch)
router.post('/status/batch', (req, res) => {
    const { userIds } = req.body;
    if (!Array.isArray(userIds)) return res.status(400).send();

    const now = Date.now();
    const statuses = {};

    userIds.forEach(id => {
        const lastSeen = onlineUsers.get(id);
        const isOnline = lastSeen && (now - lastSeen < ONLINE_THRESHOLD_MS);
        statuses[id] = {
            online: !!isOnline,
            lastSeen: isOnline ? null : (lastSeen ? new Date(lastSeen).toISOString() : null)
        };
    });

    res.json({ statuses });
});

// Автоматично чистене на паметта
setInterval(() => {
    const cutoff = Date.now() - (5 * 60 * 1000); // 5 минути неактивност
    for (const [uid, time] of onlineUsers.entries()) {
        if (time < cutoff) onlineUsers.delete(uid);
    }
}, 60000);

export default router;