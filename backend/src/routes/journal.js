import express from 'express';
import { createJournalEntry, getJournalEntries } from '../controllers/journalController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Всички дневникови операции ИЗИСКВАТ аутентикация
router.use(requireAuth);

/**
 * POST /api/journal
 * Създава нов запис с предварителна валидация
 */
router.post(
  '/',
  [
    body('content').notEmpty().withMessage('Съдържанието не може да бъде празно'),
    body('title').optional().isString(),
    body('category').isIn(['personal', 'gratitude', 'goals', 'reflection'])
  ],
  createJournalEntry
);

/**
 * GET /api/journal
 * ЗАБЕЛЕЖКА: Премахваме :userId от URL-а за по-добра сигурност.
 * Контролерът ще вземе ID-то директно от req.user.id (JWT).
 */
router.get('/', getJournalEntries);

export default router;