import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  _id: {
    type: String, // ml_user_id (UUID)
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  settings: {
    // UI настройки
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    
    language: {
      type: String,
      enum: ['bg', 'en'],
      default: 'bg'
    },
    
    // Privacy настройки
    shareWithAI: {
      type: Boolean,
      default: false // opt-in за AI споделяне
    },
    
    incognitoMode: {
      type: Boolean,
      default: false
    },
    
    // Data retention
    retentionDays: {
      type: Number,
      default: 365,
      min: 30,
      max: 3650 // до 10 години
    },
    
    autoDeleteAfterDays: {
      type: Number,
      default: null
    },
    
    // Notifications
    remindersEnabled: {
      type: Boolean,
      default: true
    },
    
    // Analytics consent
    analyticsEnabled: {
      type: Boolean,
      default: false
    }
  },
  
  // Backup информация
  backupKey: {
    type: String,
    select: false // не се връща по default
  },
  
  lastBackup: {
    type: Date
  },
  
  // Stats (некриптирани за бързи queries)
  stats: {
    totalMoodEntries: {
      type: Number,
      default: 0
    },
    
    totalChatMessages: {
      type: Number,
      default: 0
    },
    
    totalJournalEntries: {
      type: Number,
      default: 0
    },
    
    totalSessionsCompleted: {
      type: Number,
      default: 0
    },
    
    consecutiveDays: {
      type: Number,
      default: 0
    },
    
    longestStreak: {
      type: Number,
      default: 0
    }
  },
  
  // За GDPR compliance
  gdpr: {
    consentGiven: {
      type: Boolean,
      default: true
    },
    
    consentDate: {
      type: Date,
      default: Date.now
    },
    
    dataExportRequests: [{
      requestedAt: Date,
      completedAt: Date
    }],
    
    deletionScheduled: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Индекси за производителност
UserSchema.index({ lastActive: -1 });
UserSchema.index({ 'gdpr.deletionScheduled': 1 }, { 
  sparse: true,
  expireAfterSeconds: 0 
});

// Виртуални полета
UserSchema.virtual('isActive').get(function() {
  const daysSinceActive = (Date.now() - this.lastActive) / (1000 * 60 * 60 * 24);
  return daysSinceActive < 30;
});

// Methods
UserSchema.methods.updateActivity = function() {
  this.lastActive = new Date();
  return this.save();
};

UserSchema.methods.incrementStat = function(statName) {
  if (this.stats[statName] !== undefined) {
    this.stats[statName] += 1;
  }
  return this.save();
};

// Statics
UserSchema.statics.findActive = function(days = 30) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.find({ lastActive: { $gte: cutoff } });
};

UserSchema.statics.scheduleForDeletion = function(userId, days = 30) {
  const deletionDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return this.findByIdAndUpdate(userId, {
    'gdpr.deletionScheduled': deletionDate
  });
};

const User = mongoose.model('User', UserSchema);

export default User;