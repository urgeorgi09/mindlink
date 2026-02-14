import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Emotion = sequelize.define('Emotion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID, // В Postgres използваме UUID за по-добра сигурност и мащабируемост
    allowNull: false,
    index: true
  },
  mood: {
    type: DataTypes.SMALLINT, // Оптимизиран тип за стойности 1-5
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  energy: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  // Съхраняваме само криптираната бележка
  noteEnc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    index: true
  }
}, {
  timestamps: true,
  tableName: 'emotions',
  // Индекс за бързо извличане на хронологията на конкретен потребител
  indexes: [
    {
      fields: ['userId', 'timestamp']
    }
  ]
});

export default Emotion;