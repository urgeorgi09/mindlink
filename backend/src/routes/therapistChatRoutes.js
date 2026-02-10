import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getTherapistConversations,
  getAvailableTherapists,
  startConversation,
  getConversationMessages,
  sendMessage
} from '../controllers/therapistChatController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get available therapists (for users)
router.get('/available-therapists', getAvailableTherapists);

// Start conversation with therapist
router.post('/start-conversation', startConversation);

// Get conversations (for therapists)
router.get('/conversations', getTherapistConversations);

// Get messages for conversation
router.get('/messages/:conversationId', getConversationMessages);

// Send message
router.post('/send-message', sendMessage);

export default router;