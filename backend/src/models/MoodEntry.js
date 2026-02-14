const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const MoodEntry = sequelize.define('MoodEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  // SMALLINT е по-ефективен за стойности 1-5
  mood: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  energy: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  anxiety: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  // Криптирана бележка за максимална сигурност
  notesEnc: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'AES-256-GCM encrypted notes'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'mood_entries',
  indexes: [
    {
      // Индекс за бързи справки и генериране на графики
      name: 'idx_user_mood_history',
      fields: ['userId', 'date']
    }
  ]
});

module.exports = MoodEntry;