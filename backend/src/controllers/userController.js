import User from '../models/User.js';
import MoodEntry from '../models/MoodEntry.js';
import ChatMessage from '../models/ChatMessage.js';
import JournalEntry from '../models/JournalEntry.js';
import { decrypt, generateBackupKey, validateBackupKey } from '../utils/crypto.js';

/**
 * GET /api/user/:userId/settings
 * Връща настройки на потребителя
 */
export async function getUserSettings(req, res) {
  try {
    const { userId } = req.params;
    
    let user = await User.findById(userId);
    
    if (!user) {
      // Създай нов user при първо извикване
      user = await User.create({ _id: userId });
    }
    
    res.json({
      success: true,
      settings: user.settings,
      stats: user.stats,
      hasBackup: !!user.backupKey
    });
  } catch (err) {
    console.error('Get settings error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * PUT /api/user/:userId/settings
 * Обновява настройки
 */
export async function updateUserSettings(req, res) {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { settings: updates } },
      { new: true, upsert: true }
    );
    
    res.json({
      success: true,
      settings: user.settings
    });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/user/:userId/backup
 * Генерира backup ключ
 */
export async function createBackup(req, res) {
  try {
    const { userId } = req.params;
    
    const backupKey = generateBackupKey(userId);
    
    await User.findByIdAndUpdate(userId, {
      backupKey,
      lastBackup: new Date()
    });
    
    res.json({
      success: true,
      backupKey,
      qrData: `mindlink://restore?key=${backupKey}`
    });
  } catch (err) {
    console.error('Backup creation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/user/restore
 * Възстановява достъп от backup ключ
 */
export async function restoreFromBackup(req, res) {
  try {
    const { backupKey } = req.body;
    
    if (!backupKey) {
      return res.status(400).json({ success: false, error: 'Липсва backup ключ' });
    }
    
    // Намери user по backup key
    const user = await User.findOne({ backupKey }).select('+backupKey');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Невалиден backup ключ' });
    }
    
    res.json({
      success: true,
      userId: user._id,
      message: 'Профилът е възстановен успешно'
    });
  } catch (err) {
    console.error('Restore error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * GET /api/user/:userId/export
 * Експортира всички данни (GDPR право на преносимост)
 */
export async function exportUserData(req, res) {
  try {
    const { userId } = req.params;
    
    // Събиране на данни
    const [user, moods, chats, journals] = await Promise.all([
      User.findById(userId),
      MoodEntry.find({ userId }).lean(),
      ChatMessage.find({ userId }).lean(),
      JournalEntry.find({ userId }).lean()
    ]);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Потребител не е намерен' });
    }
    
    // Декриптиране на чувствителни данни
    const decryptedMoods = moods.map(m => ({
      ...m,
      note: m.noteEnc ? decrypt(m.noteEnc) : null,
      aiReply: m.aiReplyEnc ? decrypt(m.aiReplyEnc) : null
    }));
    
    const decryptedChats = chats.map(c => ({
      ...c,
      content: decrypt(c.contentEnc)
    }));
    
    const decryptedJournals = journals.map(j => ({
      ...j,
      text: decrypt(j.textEnc)
    }));
    
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user._id,
        createdAt: user.createdAt,
        settings: user.settings,
        stats: user.stats
      },
      moodEntries: decryptedMoods,
      chatMessages: decryptedChats,
      journalEntries: decryptedJournals
    };
    
    // Запиши export request
    await User.findByIdAndUpdate(userId, {
      $push: {
        'gdpr.dataExportRequests': {
          requestedAt: new Date(),
          completedAt: new Date()
        }
      }
    });
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="mindlink-export-${userId}-${Date.now()}.json"`);
    res.json(exportData);
    
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/user/:userId/import
 * Импортира backup данни
 */
export async function importUserData(req, res) {
  try {
    const { userId } = req.params;
    const { data } = req.body;
    
    if (!data || !data.user) {
      return res.status(400).json({ success: false, error: 'Невалидни данни за импорт' });
    }
    
    // TODO: Валидация и конфликт резолюция
    // За сега просто update-ваме user settings
    
    await User.findByIdAndUpdate(userId, {
      $set: {
        settings: data.user.settings || {}
      }
    }, { upsert: true });
    
    res.json({
      success: true,
      message: 'Данните са импортирани успешно'
    });
    
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * DELETE /api/user/:userId
 * Изтрива потребител и всички данни (GDPR право на забрава)
 */
export async function deleteUserData(req, res) {
  try {
    const { userId } = req.params;
    const { confirmation } = req.body;
    
    // Изисква потвърждение
    if (confirmation !== userId) {
      return res.status(400).json({
        success: false,
        error: 'Моля потвърдете изтриването като въведете вашия ID'
      });
    }
    
    // Изтриване на всички данни
    await Promise.all([
      User.findByIdAndDelete(userId),
      MoodEntry.deleteMany({ userId }),
      ChatMessage.deleteMany({ userId }),
      JournalEntry.deleteMany({ userId })
    ]);
    
    res.json({
      success: true,
      message: 'Всички данни са изтрити успешно'
    });
    
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/user/:userId/activity
 * Обновява lastActive timestamp
 */
export async function updateActivity(req, res) {
  try {
    const { userId } = req.params;
    
    await User.findByIdAndUpdate(userId, {
      lastActive: new Date()
    }, { upsert: true });
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export default {
  getUserSettings,
  updateUserSettings,
  createBackup,
  restoreFromBackup,
  exportUserData,
  importUserData,
  deleteUserData,
  updateActivity
};