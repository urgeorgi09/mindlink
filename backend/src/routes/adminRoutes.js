import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole, requirePermission } from '../middleware/roleMiddleware.js';
import User from '../models/User.js';
import ChatMessage from '../models/ChatMessage.js';
import Journal from '../models/Journal.js';
import Emotion from '../models/Emotion.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole('admin'));

/**
 * GET /api/admin/users
 * Get all users with pagination
 */
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const query = {};
    
    if (role && ['user', 'therapist', 'admin'].includes(role)) {
      query.role = role;
    }
    
    if (search) {
      query._id = { $regex: search, $options: 'i' };
    }

    const users = await User.find(query)
      .select('-backupKey')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/users/:userId
 * Get specific user details
 */
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-backupKey');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Get user activity stats
    const [chatCount, journalCount, emotionCount] = await Promise.all([
      ChatMessage.countDocuments({ userId }),
      Journal.countDocuments({ userId }),
      Emotion.countDocuments({ userId })
    ]);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        activityStats: {
          chatMessages: chatCount,
          journalEntries: journalCount,
          emotionEntries: emotionCount
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/admin/users/:userId/role
 * Update user role
 */
router.put('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'therapist', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid role. Must be user, therapist, or admin' 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-backupKey');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/admin/users/:userId
 * Delete user and all associated data
 */
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { confirmation } = req.body;

    if (confirmation !== 'DELETE') {
      return res.status(400).json({
        success: false,
        error: 'Confirmation required. Send "DELETE" in confirmation field'
      });
    }

    // Delete user and all associated data
    await Promise.all([
      User.findByIdAndDelete(userId),
      ChatMessage.deleteMany({ userId }),
      Journal.deleteMany({ userId }),
      Emotion.deleteMany({ userId })
    ]);

    res.json({
      success: true,
      message: 'User and all associated data deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/stats
 * Get system statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      usersByRole,
      totalChats,
      totalJournals,
      totalEmotions
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ 
        lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      }),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      ChatMessage.countDocuments(),
      Journal.countDocuments(),
      Emotion.countDocuments()
    ]);

    const roleStats = usersByRole.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, { user: 0, therapist: 0, admin: 0 });

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          byRole: roleStats
        },
        content: {
          chatMessages: totalChats,
          journalEntries: totalJournals,
          emotionEntries: totalEmotions
        }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;