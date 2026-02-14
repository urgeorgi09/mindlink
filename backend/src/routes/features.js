// POST /api/journal
router.post('/', authMiddleware, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { content, prompt, tags } = req.body;
    
    // 1. Криптираме съдържанието
    const contentEnc = encrypt(content);
    const wordCount = content.split(' ').length;

    // 2. Създаваме записа
    const entry = await JournalEntry.create({
      userId: req.user.id,
      prompt,
      contentEnc, // Съхраняваме само криптирано
      wordCount,
      tags
    }, { transaction });

    // 3. Атомно обновяване на статистиката
    const stats = await UserStats.findOne({ where: { userId: req.user.id } });
    await stats.increment('journalEntries', { by: 1, transaction });

    await transaction.commit();
    
    // Пост-процес: Проверка за значки (Async)
    achievementService.checkJournalBadges(req.user.id);

    res.status(201).json({ success: true, id: entry.id });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
});