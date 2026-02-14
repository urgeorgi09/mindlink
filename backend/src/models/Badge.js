import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * Модел за дефиниция на значка (Каталог)
 */
export const Badge = sequelize.define('Badge', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true, // ex: "mood_streak_7"
  },
  name: {
    type: DataTypes.STRING,
    allowInNull: false
  },
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  iconUrl: DataTypes.STRING, // Път до иконата на значката
  color: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Postgres поддържа масиви
    defaultValue: ['#6366f1']
  },
  criteria: {
    type: DataTypes.JSONB, // Позволява гъвкави условия (напр. { "count": 10 })
    defaultValue: {}
  }
}, {
  timestamps: true
});

/**
 * Свързваща таблица (UserBadges) - Кой, кога и коя значка е взел
 */
export const UserBadge = sequelize.define('UserBadge', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  unlockedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Дефиниране на Many-to-Many връзката
// User.belongsToMany(Badge, { through: UserBadge });
// Badge.belongsToMany(User, { through: UserBadge });