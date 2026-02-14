import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserStats = sequelize.define('UserStats', {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: { model: 'Users', key: 'id' }
  },
  // Проследяване на активност
  loginStreak: { type: DataTypes.INTEGER, defaultValue: 0 },
  longestStreak: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastLoginDate: { type: DataTypes.DATE },
  totalLogins: { type: DataTypes.INTEGER, defaultValue: 0 },
  
  // Статистика за съдържание
  journalEntries: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalWords: { type: DataTypes.BIGINT, defaultValue: 0 },
  moodEntries: { type: DataTypes.INTEGER, defaultValue: 0 },
  averageMood: { type: DataTypes.DECIMAL(3, 2), defaultValue: 3.00 },

  // Геймификация и цели
  goalsCompleted: { type: DataTypes.INTEGER, defaultValue: 0 },
  goalsCreated: { type: DataTypes.INTEGER, defaultValue: 0 },
  meditationMinutes: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  timestamps: true,
  tableName: 'user_stats'
});

/**
 * Enterprise логика: Виртуални полета
 */
UserStats.prototype.getGoalCompletionRate = function() {
  if (this.goalsCreated === 0) return 0;
  return Math.round((this.goalsCompleted / this.goalsCreated) * 100);
};

/**
 * Логика за стрийк (Streak Logic)
 */
UserStats.prototype.updateLoginStreak = function() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const last = this.lastLoginDate ? new Date(this.lastLoginDate.getFullYear(), this.lastLoginDate.getMonth(), this.lastLoginDate.getDate()).getTime() : null;

  if (last) {
    const diff = (today - last) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      this.loginStreak += 1;
      if (this.loginStreak > this.longestStreak) this.longestStreak = this.loginStreak;
    } else if (diff > 1) {
      this.loginStreak = 1;
    }
  } else {
    this.loginStreak = 1;
    this.longestStreak = 1;
  }
  this.lastLoginDate = now;
  this.totalLogins += 1;
  return this.save();
};

export default UserStats;