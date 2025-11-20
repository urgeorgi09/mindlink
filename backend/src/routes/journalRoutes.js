import express from "express";
import { createJournalEntry, getJournalEntries } from "../controllers/journalController.js";

const router = express.Router();

router.post("/", createJournalEntry);
router.get("/", getJournalEntries);

export default router;
