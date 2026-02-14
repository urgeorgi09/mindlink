const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const JournalEntry = sequelize.define('JournalEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    index: true, // Критично за бързина при филтриране по потребител
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  // Enterprise стандарт: Криптирани полета
  titleEnc: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Encrypted title'
  },
  contentEnc: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Encrypted content'
  },
  category: {
    type: DataTypes.ENUM('personal', 'gratitude', 'goals', 'reflection'),
    defaultValue: 'personal'
  },
  mood: {
    type: DataTypes.SMALLINT, // Пести място в БД спрямо INTEGER
    validate: { min: 1, max: 5 }
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  timestamps: true,
  tableName: 'journal_entries',
  indexes: [
    // Композитен индекс за бързо сортиране по дата в рамките на един профил
    {
      fields: ['userId', 'createdAt']
    }
  ]
});

module.exports = JournalEntry;