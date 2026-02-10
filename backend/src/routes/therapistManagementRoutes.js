import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole, requireOwnershipOrRole } from '../middleware/roleMiddleware.js';
import User from '../models/User.js';
import ChatMessage from '../models/ChatMessage.js';
import Journal from '../models/Journal.js';
import Emotion from '../models/Emotion.js';
import { decrypt } from '../utils/crypto.js';

const router = express.Router();

// All therapist routes require authentication
router.use(requireAuth);

/**
 * GET /api/therapist/patients
 * Get patients assigned to therapist (for future implementation)
 */
router.get('/patients', requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // For now, therapists can see basic stats of all users
    // In a real implementation, you'd have patient assignments
    const users = await User.find({ role: 'user' })
      .select('_id createdAt lastActive stats')
      .sort({ lastActive: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ role: 'user' });

    res.json({
      success: true,
      patients: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/therapist/patients/:userId/overview
 * Get patient overview (anonymized)
 */
router.get('/patients/:userId/overview', requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-backupKey');
    if (!user || user.role !== 'user') {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    // Get activity stats without exposing sensitive content
    const [chatCount, journalCount, emotionCount, recentEmotions] = await Promise.all([
      ChatMessage.countDocuments({ userId }),
      Journal.countDocuments({ userId }),
      Emotion.countDocuments({ userId }),
      Emotion.find({ userId })
        .select('mood energy anxiety stress createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.json({
      success: true,
      patient: {
        id: user._id,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
        stats: user.stats,
        activityCounts: {
          chatMessages: chatCount,
          journalEntries: journalCount,
          emotionEntries: emotionCount
        },
        recentMoodTrends: recentEmotions
      }
    });
  } catch (error) {
    console.error('Get patient overview error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/therapist/patients/:userId/progress
 * Get patient progress analytics
 */
router.get('/patients/:userId/progress', requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;
    
    const user = await User.findById(userId);
    if (!user || user.role !== 'user') {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get mood trends over time
    const emotions = await Emotion.find({
      userId,
      createdAt: { $gte: startDate }
    }).select('mood energy anxiety stress createdAt').sort({ createdAt: 1 });

    // Calculate averages by week
    const weeklyAverages = {};
    emotions.forEach(emotion => {
      const week = new Date(emotion.createdAt).toISOString().slice(0, 10);
      if (!weeklyAverages[week]) {
        weeklyAverages[week] = { mood: [], energy: [], anxiety: [], stress: [] };
      }
      weeklyAverages[week].mood.push(emotion.mood);
      weeklyAverages[week].energy.push(emotion.energy);
      weeklyAverages[week].anxiety.push(emotion.anxiety);
      weeklyAverages[week].stress.push(emotion.stress);
    });

    const progressData = Object.entries(weeklyAverages).map(([date, values]) => ({
      date,
      mood: values.mood.reduce((a, b) => a + b, 0) / values.mood.length,
      energy: values.energy.reduce((a, b) => a + b, 0) / values.energy.length,
      anxiety: values.anxiety.reduce((a, b) => a + b, 0) / values.anxiety.length,
      stress: values.stress.reduce((a, b) => a + b, 0) / values.stress.length,
      entries: values.mood.length
    }));

    res.json({
      success: true,
      progress: {
        timeframe: `${days} days`,
        totalEntries: emotions.length,
        weeklyData: progressData,
        trends: {
          improving: progressData.length > 1 && 
            progressData[progressData.length - 1].mood > progressData[0].mood,
          consistent: emotions.length > 0
        }
      }
    });
  } catch (error) {
    console.error('Get patient progress error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/therapist/dashboard
 * Get therapist dashboard data
 */
router.get('/dashboard', requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const [
      totalPatients,
      activePatients,
      recentActivity,
      criticalCases
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ 
        role: 'user',
        lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      }),
      Emotion.find({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }).select('userId mood anxiety stress createdAt').sort({ createdAt: -1 }).limit(10),
      Emotion.find({
        $or: [
          { anxiety: { $gte: 8 } },
          { stress: { $gte: 8 } },
          { mood: { $lte: 2 } }
        ],
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }).select('userId mood anxiety stress createdAt').sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({
      success: true,
      dashboard: {
        stats: {
          totalPatients,
          activePatients,
          inactivePatients: totalPatients - activePatients
        },
        recentActivity,
        alerts: {
          criticalCases: criticalCases.length,
          cases: criticalCases
        }
      }
    });
  } catch (error) {
    console.error('Get therapist dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/therapist/patient-emotions/:patientId
 * Get patient emotions for therapist
 */
router.get('/patient-emotions/:patientId', requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'user') {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const emotions = await Emotion.find({ userId: patientId })
      .select('emotion intensity notes createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      patientName: `Пациент ${patientId.slice(0, 8)}`,
      emotions: emotions.map(e => ({
        id: e._id,
        emotion: e.emotion || 'Неизвестно',
        intensity: e.intensity || 5,
        notes: e.notes || '',
        date: e.createdAt
      }))
    });
  } catch (error) {
    console.error('Get patient emotions error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;