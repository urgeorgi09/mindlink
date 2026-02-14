import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  participants: [{
    userId: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'therapist'],
      required: true
    }
  }],
  
  lastMessage: {
    content: String,
    sender: String,
    timestamp: Date
  },
  
  status: {
    type: String,
    enum: ['active', 'closed', 'pending'],
    default: 'active'
  }
}, {
  timestamps: true
});

ConversationSchema.index({ 'participants.userId': 1 });

const Conversation = mongoose.model('Conversation', ConversationSchema);

export default Conversation;