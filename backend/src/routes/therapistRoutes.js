import express from 'express';
import { 
  getTherapists, 
  applyAsTherapist, 
  verifyTherapist, 
  getTherapistProfile 
} from '../controllers/therapistController.js';
import { requireAuth, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * ПУБЛИЧНИ МАРШРУТИ
 * Потребителите могат да виждат само одобрени терапевти
 */
router.get("/", getTherapists);
router.get("/:id", getTherapistProfile);

/**
 * ЗАЩИТЕНИ МАРШРУТИ
 */
router.use(requireAuth);

// Потребител кандидатства за терапевт (изпраща дипломи/сертификати)
router.post("/apply", applyAsTherapist);

// Само администратори могат да одобряват нови терапевти
router.patch("/verify/:id", restrictTo('admin'), verifyTherapist);

export default router;