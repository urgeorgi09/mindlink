const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const TherapistVerification = sequelize.define('TherapistVerification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // Един потребител може да има само една активна заявка
    references: { model: 'Users', key: 'id' }
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Предотвратява дублиране на лицензи
  },
  // Enterprise стандарт: Съхраняваме метаданни за документа
  documentUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Secure link to private storage (S3/Cloud)'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    index: true // Оптимизация за админ панела
  },
  reviewedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'Users', key: 'id' } // Връзка към админа
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'therapist_verifications',
  indexes: [
    { fields: ['status'] },
    { fields: ['userId'] }
  ]
});

module.exports = TherapistVerification;