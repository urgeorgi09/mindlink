import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * Основен модел за Разговор
 */
export const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'pending'),
    defaultValue: 'active'
  },
  // Пазим само ID на последното съобщение за бърза справка
  lastMessageId: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'conversations'
});

/**
 * Свързваща таблица за Участници (Participants)
 * Дефинира Many-to-Many връзката между User и Conversation
 */
export const Participant = sequelize.define('Participant', {
  role: {
    type: DataTypes.ENUM('user', 'therapist'),
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'conversation_participants',
  indexes: [
    { fields: ['userId', 'conversationId'], unique: true }
  ]
});

// Релации:
// Conversation.belongsToMany(User, { through: Participant });
// User.belongsToMany(Conversation, { through: Participant });