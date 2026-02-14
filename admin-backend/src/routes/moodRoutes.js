import express from "express";
import { getEmotions, createEmotion } from "../controllers/emotionController.js";

const router = express.Router();

// GET /api/emotions/:userId → взима емоции
router.get("/:userId", getEmotions);

// POST /api/emotions → създава нова емоция
router.post("/", createEmotion);

export default router;
