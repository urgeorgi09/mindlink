import express from 'express';
import { getEmotions, createEmotion } from '../controllers/emotionController.js';

const router = express.Router();

/**
 * GET /api/emotions/:userId
 * Зарежда емоциите на потребителя
 */
router.get('/:userId', getEmotions);

/**
 * POST /api/emotions
 * Създава нова емоция
 */
router.post('/', createEmotion);

export default router;