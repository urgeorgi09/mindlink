const express = require("express");
const router = express.Router();
const Emotion = require("../models.js").Emotion;

// Тук хващаме userId от хедъра (както го праща фронтендът)
function getUserId(req) {
    return req.headers["x-user-id"];
}

// GET /emotions – всички постове на потребителя
router.get("/", async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(400).json({ error: "Missing userId" });

        const emotions = await Emotion.find({ userId }).sort({ createdAt: -1 });
        res.json(emotions);
    } catch (error) {
        console.error("Error fetching emotions:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// POST /emotions – записва нов пост
router.post("/", async (req, res) => {
    try {
        const userId = getUserId(req);
        const { mood, note, energy } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "Missing userId" });
        }

        if (!mood) {
            return res.status(400).json({ error: "Mood is required" });
        }

        const newEmotion = new Emotion({
            userId,
            mood: Number(mood),
            note: note || "",
            energy: Number(energy) || 0,
        });

        const savedEmotion = await newEmotion.save();
        res.json(savedEmotion);

    } catch (error) {
        console.error("Error creating emotion:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
