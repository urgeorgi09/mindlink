import express from 'express';
import { getEmotions, createEmotion } from '../controllers/emotionController.js';

const router = express.Router();

router.get('/:userId', getEmotions);
router.post('/', createEmotion);

export default router;