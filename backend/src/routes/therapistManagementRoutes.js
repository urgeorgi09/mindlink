/**
 * GET /api/therapist/patients/:userId/progress
 * Оптимизирано изчисляване на прогреса чрез SQL агрегация
 */
router.get('/patients/:userId/progress', requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    // Използваме директна SQL заявка чрез Sequelize за бързина
    const stats = await Emotion.findAll({
      where: {
        userId,
        createdAt: { [Op.gte]: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
      },
      attributes: [
        [fn('DATE_TRUNC', 'day', col('createdAt')), 'day'],
        [fn('AVG', col('mood')), 'avgMood'],
        [fn('AVG', col('stress')), 'avgStress'],
        [fn('COUNT', col('id')), 'entryCount']
      ],
      group: [fn('DATE_TRUNC', 'day', col('createdAt'))],
      order: [[fn('DATE_TRUNC', 'day', col('createdAt')), 'ASC']]
    });

    res.json({ success: true, progress: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});