import express from 'express';
import { getChatMessages, createChatMessage } from '../controllers/chatController.js';
import { getAiResponse } from '../controllers/aiController.js';

const router = express.Router();

// --- AI endpoint трябва да е най-горе ---
router.post('/ai', getAiResponse);

// Chat
router.get('/:userId', getChatMessages);
router.post('/', createChatMessage);

export default router;
