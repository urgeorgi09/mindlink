import express from 'express';
import { authMiddleware, requireAuth } from '../middleware/authMiddleware.js';
import { requireOwnershipOrRole, requireRole } from '../middleware/roleMiddleware.js';
import {
  getUserSettings,
  updateUserSettings,
  createBackup,
  restoreFromBackup,
  exportUserData,
  importUserData,
  deleteUserData,
  updateActivity,
  getUserProfile,
  createAccount
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/restore', restoreFromBackup);

// Routes that require authentication or anonymous access
router.use(authMiddleware);

// User profile and settings (own data or admin/therapist access)
router.get('/:userId/settings', requireOwnershipOrRole(['admin', 'therapist']), getUserSettings);
router.put('/:userId/settings', requireOwnershipOrRole(['admin']), updateUserSettings);
router.get('/:userId/profile', requireOwnershipOrRole(['admin', 'therapist']), getUserProfile);

// Backup and restore (own data only)
router.post('/:userId/backup', requireOwnershipOrRole([]), createBackup);

// Data export/import (own data or admin access)
router.get('/:userId/export', requireOwnershipOrRole(['admin']), exportUserData);
router.post('/:userId/import', requireOwnershipOrRole(['admin']), importUserData);

// Activity tracking (own data or admin/therapist access)
router.post('/:userId/activity', requireOwnershipOrRole(['admin', 'therapist']), updateActivity);

// Account deletion (own data or admin access)
router.delete('/:userId', requireOwnershipOrRole(['admin']), deleteUserData);

// Admin only routes
router.post('/create-account', requireAuth, requireRole('admin'), createAccount);

export default router;
