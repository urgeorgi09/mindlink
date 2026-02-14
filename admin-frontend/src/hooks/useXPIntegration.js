import { useGamification } from "../context/GamificationContext";

// Hook for integrating XP rewards into existing components
export const useXPIntegration = () => {
  const { addXP, completeMission } = useGamification();

  const rewardJournalEntry = () => {
    addXP(50, "journal_entry");
    completeMission("journal");
  };

  const rewardMoodTracking = () => {
    addXP(30, "mood_tracking");
    completeMission("mood");
  };

  const rewardChatInteraction = (messageCount = 1) => {
    // Award XP for meaningful chat interactions (5+ messages)
    if (messageCount >= 5) {
      addXP(60, "chat_interaction");
      completeMission("chat");
    } else {
      addXP(10, "chat_message"); // Small XP for each message
    }
  };

  const rewardBreathingExercise = () => {
    addXP(40, "breathing_exercise");
    completeMission("breathing");
  };

  const rewardMeditation = (duration = 10) => {
    // Award XP based on meditation duration
    const xp = Math.min(duration * 8, 80); // Max 80 XP for 10+ minutes
    addXP(xp, "meditation");
    if (duration >= 10) {
      completeMission("meditation");
    }
  };

  const rewardCustomAction = (xp, source) => {
    addXP(xp, source);
  };

  return {
    rewardJournalEntry,
    rewardMoodTracking,
    rewardChatInteraction,
    rewardBreathingExercise,
    rewardMeditation,
    rewardCustomAction,
  };
};
