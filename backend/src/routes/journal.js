import express from 'express';
import { createJournalEntry, getJournalEntries } from '../controllers/journalController.js';

const router = express.Router();

/**
 * POST /api/journal
 * Създава дневников запис
 */
router.post('/', createJournalEntry);

/**
 * GET /api/journal/:userId
 * Зарежда дневникови записи
 */
router.get('/:userId', getJournalEntries);

export default router;