import { Conversation, ChatMessage, User, Participant } from '../models/index.js';
import sequelize from '../config/database.js';
import { encrypt, decrypt } from '../utils/crypto.js';
import { Op } from 'sequelize';
import crypto from 'crypto';

/**
 * Enterprise подход: Проверка на роля и участие чрез Join Table
 */
export const startConversation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { therapistId } = req.body;
    const userId = req.user.id;

    // 1. Валидация: Терапевтът наистина ли е терапевт?
    const therapist = await User.findOne({ where: { id: therapistId, role: 'therapist' } });
    if (!therapist) {
      return res.status(404).json({ success: false, error: 'Терапевтът не е намерен или няма права.' });
    }

    // 2. Намиране на съществуващ разговор (Complex SQL Query)
    // Търсим разговор, в който участват точно тези двама души
    const existingConversation = await Conversation.findOne({
      include: [
        { model: User, where: { id: [userId, therapistId] } }
      ],
      group: ['Conversation.id'],
      having: sequelize.literal('count(Users.id) = 2')
    });

    if (existingConversation) {
      return res.json({ success: true, conversation: existingConversation });
    }

    // 3. Създаване на нов разговор
    const newConversation = await Conversation.create({ id: crypto.randomUUID() }, { transaction: t });
    
    // Добавяне на участниците (Join Table)
    await Participant.bulkCreate([
      { conversationId: newConversation.id, userId: userId, role: 'user' },
      { conversationId: newConversation.id, userId: therapistId, role: 'therapist' }
    ], { transaction: t });

    await t.commit();
    res.json({ success: true, conversation: newConversation });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, error: 'Грешка при стартиране на чат' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const userId = req.user.id;

    // Проверка за участие (Enterprise standard: Security first)
    const participation = await Participant.findOne({
      where: { conversationId, userId }
    });

    if (!participation) {
      return res.status(403).json({ success: false, error: 'Нямате достъп до този разговор' });
    }

    // Криптиране на съобщението
    const contentEnc = encrypt(content);

    const message = await ChatMessage.create({
      id: crypto.randomUUID(),
      conversationId,
      userId,
      role: participation.role,
      contentEnc
    });

    // Оптимизация: Обновяваме само Timestamp на разговора, без да записваме некриптиран текст!
    await Conversation.update(
      { updatedAt: new Date() },
      { where: { id: conversationId } }
    );

    res.json({ success: true, message: { ...message.toJSON(), content } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Грешка при изпращане' });
  }
};