import { User, MoodEntry, ChatMessage, JournalEntry, Emotion, sequelize } from '../models/index.js';
import { decrypt, generateBackupKey } from '../utils/crypto.js';

/**
 * GET /api/user/export
 * GDPR: Право на преносимост. Декриптира и подготвя всички данни.
 */
export async function exportUserData(req, res) {
  try {
    const userId = req.user.id; // Сигурност: Експортираш само СВОИТЕ данни

    // Използваме асоциациите на Sequelize за по-чист код
    const [user, moods, messages, journalEntries, emotions] = await Promise.all([
      User.findByPk(userId),
      MoodEntry.findAll({ where: { userId }, raw: true }),
      ChatMessage.findAll({ where: { userId }, raw: true }),
      JournalEntry.findAll({ where: { userId }, raw: true }),
      Emotion.findAll({ where: { userId }, raw: true })
    ]);

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // Enterprise Оптимизация: Декриптиране с проверка
    const decryptSafe = (text) => text ? decrypt(text) : '';

    const exportData = {
      metadata: { version: "1.0", exportedAt: new Date() },
      profile: user.toJSON(),
      activity: {
        moods: moods.map(m => ({ ...m, note: decryptSafe(m.noteEnc) })),
        messages: messages.map(msg => ({ ...msg, content: decryptSafe(msg.contentEnc) })),
        journal: journalEntries.map(j => ({ ...j, text: decryptSafe(j.textEnc) })),
        emotions
      }
    };

    // Логване на GDPR събитие (Одит)
    await user.update({ lastDataExport: new Date() });

    res.setHeader('Content-Disposition', `attachment; filename="export-${userId}.json"`);
    res.json(exportData);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Грешка при експорт' });
  }
}

/**
 * DELETE /api/user/account
 * GDPR: Право на забрава. Изтрива всичко в една транзакция.
 */
export async function deleteUserData(req, res) {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { confirmation } = req.body;

    if (confirmation !== 'DELETE MY DATA') {
      return res.status(400).json({ success: false, error: 'Неправилно потвърждение' });
    }

    // Enterprise стандарт: Всичко или нищо (Transaction)
    // Ако моделите в Sequelize имат onDelete: 'CASCADE', долните редове са излишни
    await MoodEntry.destroy({ where: { userId }, transaction: t });
    await ChatMessage.destroy({ where: { userId }, transaction: t });
    await JournalEntry.destroy({ where: { userId }, transaction: t });
    await Emotion.destroy({ where: { userId }, transaction: t });
    await User.destroy({ where: { id: userId }, transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Профилът е изтрит окончателно' });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ success: false, error: 'Грешка при изтриване' });
  }
}