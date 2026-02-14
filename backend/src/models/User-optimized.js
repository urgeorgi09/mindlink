import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  role: {
    type: DataTypes.ENUM('user', 'therapist', 'admin'),
    defaultValue: 'user'
  },
  // Изравнена структура (Flattened auth)
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
    // В Sequelize можем да скрием полето по подразбиране чрез scopes
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastActive: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'users',
  defaultScope: {
    attributes: { exclude: ['password'] } // Сигурност: Паролата не се връща при обикновени заявки
  },
  scopes: {
    withPassword: { attributes: {}, } // Използва се само при логин
  }
});

/**
 * Enterprise RBAC Логика
 */
User.prototype.hasPermission = function(permission) {
  const permissions = {
    user: ['read_own', 'write_own'],
    therapist: ['read_own', 'write_own', 'read_users', 'manage_sessions'],
    admin: ['read_own', 'write_own', 'read_users', 'manage_sessions', 'manage_users', 'system_admin']
  };
  return permissions[this.role]?.includes(permission) || false;
};

export default User;