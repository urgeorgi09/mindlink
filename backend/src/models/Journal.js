import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Journal = sequelize.define('Journal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    index: true // Бързо филтриране по потребител
  },
  // Криптирани данни - TEXT тип за неограничена дължина на записа
  promptEnc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  textEnc: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Postgres специфичен тип за тагове
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  wordCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'journals',
  indexes: [
    // Композитен индекс за бързо зареждане на последните записи на потребителя
    {
      name: 'idx_user_journals_date',
      fields: ['userId', 'createdAt']
    }
  ]
});

export default Journal;