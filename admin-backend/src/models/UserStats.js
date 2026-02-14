import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  // Login tracking
  loginStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  longestStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastLoginDate: {
    type: Date
  },
  totalLogins: {
    type: Number,
    default: 0
  },
  
  // Journal stats
  journalEntries: {
    type: Number,
    default: 0,
    min: 0
  },
  totalWords: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // AI Chat stats
  chatbotMessages: {
    type: Number,
    default: 0,
    min: 0
  },
  aiConversations: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Breathing exercises
  breathingExercises: {
    type: Number,
    default: 0,
    min: 0
  },
  breathingMinutes: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Meditation
  meditationMinutes: {
    type: Number,
    default: 0,
    min: 0
  },
  meditationSessions: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Mood tracking
  moodEntries: {
    type: Number,
    default: 0,
    min: 0
  },
  averageMood: {
    type: Number,
    default: 3,
    min: 1,
    max: 5
  },
  
  // Goals
  goalsCreated: {
    type: Number,
    default: 0,
    min: 0
  },
  goalsCompleted: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Community
  communityInteractions: {
    type: Number,
    default: 0,
    min: 0
  },
  helpfulComments: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Crisis resources accessed
  crisisResourcesViewed: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for completion rate
userStatsSchema.virtual('goalCompletionRate').get(function() {
  if (this.goalsCreated === 0) return 0;
  return Math.round((this.goalsCompleted / this.goalsCreated) * 100);
});

// Virtual for average words per entry
userStatsSchema.virtual('avgWordsPerEntry').get(function() {
  if (this.journalEntries === 0) return 0;
  return Math.round(this.totalWords / this.journalEntries);
});

// Method to update login streak
userStatsSchema.methods.updateLoginStreak = function() {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastLogin = this.lastLoginDate ? new Date(this.lastLoginDate).setHours(0, 0, 0, 0) : null;
  
  if (lastLogin) {
    const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day, no change
      return this.loginStreak;
    } else if (daysDiff === 1) {
      // Consecutive day
      this.loginStreak += 1;
      if (this.loginStreak > this.longestStreak) {
        this.longestStreak = this.loginStreak;
      }
    } else {
      // Streak broken
      this.loginStreak = 1;
    }
  } else {
    // First login
    this.loginStreak = 1;
    this.longestStreak = 1;
  }
  
  this.lastLoginDate = new Date();
  this.totalLogins += 1;
  
  return this.loginStreak;
};

// Method to increment stat
userStatsSchema.methods.incrementStat = function(statName, value = 1) {
  if (this[statName] !== undefined) {
    this[statName] += value;
  }
  return this[statName];
};

// Static method to get leaderboard
userStatsSchema.statics.getLeaderboard = async function(metric = 'loginStreak', limit = 10) {
  return this.find()
    .sort({ [metric]: -1 })
    .limit(limit)
    .populate('userId', 'username email')
    .select(`userId ${metric}`);
};

// Pre-save middleware
userStatsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const UserStats = mongoose.model('UserStats', userStatsSchema);

export default UserStats;