import Journal from "../models/Journal.js";
import UserStats from "../models/UserStats.js";
import { checkUserBadges } from "../utils/checkUserBadges.js";

export const createJournalEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prompt, content, tags = [], isPrivate = true, wordCount = 0 } = req.body;

    const entry = await Journal.create({
      userId,
      prompt,
      content,
      tags,
      isPrivate,
      wordCount
    });

    // update stats
    await UserStats.findOneAndUpdate(
      { userId },
      { $inc: { journalEntries: 1 } },
      { new: true, upsert: true }
    );

    const newBadges = await checkUserBadges(userId);

    res.status(201).json({ success: true, entry, newBadges });
  } catch (err) {
    console.error("Journal save error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getJournalEntries = async (req, res) => {
  try {
    const userId = req.user.id;

    const entries = await Journal.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, entries });
  } catch (err) {
    console.error("Get journal error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
