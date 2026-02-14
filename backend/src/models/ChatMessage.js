const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false,
    index: true // Оптимизация за бързо зареждане на чат хронология
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  // Криптирано съдържание на съобщението
  contentEnc: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'AES-256-GCM encrypted content'
  },
  // Метаданни (например дали е прочетено)
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    index: true
  }
}, {
  timestamps: true, // Позволява автоматично следене на createdAt и updatedAt
  tableName: 'chat_messages',
  indexes: [
    // Комбиниран индекс за бързо сортиране по време в конкретен разговор
    {
      fields: ['conversationId', 'timestamp']
    }
  ]
});

module.exports = ChatMessage;