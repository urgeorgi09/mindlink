import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  isAi: {
    type: Boolean,
    default: false
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative', 'crisis'],
    default: 'neutral'
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    mood: Number,
    energy: Number,
    anxiety: Number,
    sessionId: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
chatMessageSchema.index({ userId: 1, createdAt: -1 });
chatMessageSchema.index({ userId: 1, isAi: 1 });

// Virtual for conversation pairs
chatMessageSchema.virtual('isUserMessage').get(function() {
  return !this.isAi;
});

// Method to get recent conversation history
chatMessageSchema.statics.getRecentConversation = async function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('message isAi sentiment createdAt');
};

// Method to get conversation stats
chatMessageSchema.statics.getStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$isAi',
        count: { $sum: 1 },
        avgLength: { $avg: { $strLenCP: '$message' } }
      }
    }
  ]);

  return {
    userMessages: stats.find(s => s._id === false)?.count || 0,
    aiMessages: stats.find(s => s._id === true)?.count || 0,
    avgMessageLength: stats.find(s => s._id === false)?.avgLength || 0
  };
};

// Pre-save middleware to update timestamp
chatMessageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.ChatMessage ||
  mongoose.model('ChatMessage', chatMessageSchema);
