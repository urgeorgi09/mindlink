import Conversation from '../models/Conversation.js';
import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js';
import { encrypt, decrypt } from '../utils/crypto.js';

/**
 * GET /api/therapist-chat/conversations
 * Get all conversations for therapist
 */
export const getTherapistConversations = async (req, res) => {
  try {
    const therapistId = req.user.id;
    
    const conversations = await Conversation.find({
      'participants.userId': therapistId,
      'participants.role': 'therapist'
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Get therapist conversations error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/therapist-chat/available-therapists
 * Get available therapists for users
 */
export const getAvailableTherapists = async (req, res) => {
  try {
    const therapists = await User.find({ role: 'therapist' })
      .select('_id createdAt lastActive')
      .sort({ lastActive: -1 });

    const therapistList = therapists.map(t => ({
      id: t._id,
      name: `Терапевт ${t._id.slice(0, 8)}`,
      status: 'online',
      lastActive: t.lastActive
    }));

    res.json({
      success: true,
      therapists: therapistList
    });
  } catch (error) {
    console.error('Get available therapists error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/therapist-chat/start-conversation
 * Start conversation with therapist
 */
export const startConversation = async (req, res) => {
  try {
    const { therapistId } = req.body;
    const userId = req.user.id;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { userId, role: 'user' } },
          { $elemMatch: { userId: therapistId, role: 'therapist' } }
        ]
      }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          { userId, role: 'user' },
          { userId: therapistId, role: 'therapist' }
        ]
      });
    }

    res.json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/therapist-chat/messages/:conversationId
 * Get messages for conversation
 */
export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.userId === userId)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const messages = await ChatMessage.find({ conversationId })
      .sort({ timestamp: 1 });

    const decryptedMessages = messages.map(msg => ({
      ...msg.toObject(),
      content: decrypt(msg.contentEnc)
    }));

    res.json({
      success: true,
      messages: decryptedMessages
    });
  } catch (error) {
    console.error('Get conversation messages error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/therapist-chat/send-message
 * Send message in conversation
 */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const userId = req.user.id;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.userId === userId)) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    // Determine role
    const participant = conversation.participants.find(p => p.userId === userId);
    const role = participant.role;

    // Create message
    const message = await ChatMessage.create({
      userId,
      conversationId,
      role,
      contentEnc: encrypt(content)
    });

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: content.substring(0, 100),
        sender: userId,
        timestamp: new Date()
      }
    });

    res.json({
      success: true,
      message: {
        ...message.toObject(),
        content
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};