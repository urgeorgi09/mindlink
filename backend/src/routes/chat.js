import express from 'express';
import { getChatMessages, createChatMessage } from '../controllers/chatController.js';
import { getAiResponse } from '../controllers/aiController.js';

const router = express.Router();

/**
 * POST /api/chat/ai
 * AI endpoint - трябва да е ПРЕДИ /:userId route
 */
router.post('/ai', getAiResponse);

/**
 * GET /api/chat/:userId
 * Зарежда чат история
 */
router.get('/:userId', getChatMessages);

/**
 * POST /api/chat
 * Създава чат съобщение
 */
router.post('/', createChatMessage);

export default router;