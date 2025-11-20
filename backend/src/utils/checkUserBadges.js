import Badge from '../models/Badge.js';
import UserStats from '../models/UserStats.js';

/**
 * Returns array of newly unlocked badge objects (saved)
 */
export const checkUserBadges = async (userId) => {
  const stats = await UserStats.findOne({ userId });
  if (!stats) return [];

  // Define conditions. Adjust ids / thresholds as you like.
  const conditions = [
    { badgeId: 'chatbot_10', check: () => (stats.chatbotMessages || 0) >= 10 },
    { badgeId: 'journal_5', check: () => (stats.journalEntries || 0) >= 5 },
    { badgeId: 'streak_7', check: () => (stats.loginStreak || 0) >= 7 },
    { badgeId: 'breathing_20', check: () => (stats.breathingExercises || 0) >= 20 },
    { badgeId: 'ai_chat_10', check: () => (stats.aiConversations || 0) >= 10 },
  ];

  const newlyUnlocked = [];

  for (const cond of conditions) {
    const badgeDoc = await Badge.findOne({ badgeId: cond.badgeId });
    // If badge definition missing in DB, skip
    if (!badgeDoc) continue;

    // If already unlocked for this user, skip
    if ((badgeDoc.unlockedBy || []).includes(userId)) continue;

    // If condition passes, unlock
    if (cond.check()) {
      badgeDoc.unlockedBy.push(userId);
      await badgeDoc.save();
      newlyUnlocked.push({
        badgeId: badgeDoc.badgeId,
        name: badgeDoc.name,
        description: badgeDoc.description,
        category: badgeDoc.category,
        color: badgeDoc.color
      });
    }
  }

  return newlyUnlocked;
};
