import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/authMiddleware.js'; // Използваме оптимизирания middleware
import { User, ChatMessage, Journal, Emotion } from '../models/index.js';
import { Op, fn, col } from 'sequelize';

const router = express.Router();

// Сигурност: Само админи имат достъп до тези маршрути
router.use(requireAuth);
router.use(restrictTo('admin'));

/**
 * GET /api/admin/users
 * Търсене и пагинация
 */
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (role) whereClause.role = role;
    if (search) {
      // Търсене по имейл или потребителско име чрез ILIKE
      whereClause[Op.or] = [
        { email: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] } // Никога не връщаме пароли
    });

    res.json({
      success: true,
      users,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/admin/users/:userId
 * Използваме транзакция за пълна сигурност
 */
router.delete('/users/:userId', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, error: 'Потребителят не е намерен' });

    // Благодарение на ON DELETE CASCADE в Postgres, 
    // изтриването на потребителя ще изтрие всичко свързано с него.
    await user.destroy({ transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Потребителят и всички негови данни са изтрити' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/stats
 * Оптимизирана статистика
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      User.count(),
      User.count({ where: { role: 'therapist' } }),
      Journal.count(),
      ChatMessage.count(),
      // Групиране по роли чрез Sequelize
      User.findAll({
        attributes: ['role', [fn('COUNT', col('role')), 'count']],
        group: ['role']
      })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: stats[0],
        therapists: stats[1],
        content: { journals: stats[2], messages: stats[3] },
        breakdown: stats[4]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;