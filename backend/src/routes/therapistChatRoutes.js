import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/authMiddleware.js'; 
import {
  getTherapistConversations,
  getAvailableTherapists,
  startConversation,
  getConversationMessages,
  sendMessage
} from '../controllers/therapistChatController.js';

const router = express.Router();

router.use(requireAuth);

/**
 * ЗА ПОТРЕБИТЕЛИ
 * Търсене на сертифицирани специалисти
 */
router.get('/available-therapists', getAvailableTherapists);
router.post('/start-conversation', startConversation);

/**
 * ЗА ТЕРАПЕВТИ
 * Само регистрирани терапевти виждат списъка си с пациенти
 */
router.get('/conversations', restrictTo('therapist'), getTherapistConversations);

/**
 * ОБЩИ (СЪС СТРИКТНА ПРОВЕРКА НА СОБСТВЕНОСТ)
 */
router.get('/messages/:conversationId', getConversationMessages);
router.post('/send-message', sendMessage);

export default router;