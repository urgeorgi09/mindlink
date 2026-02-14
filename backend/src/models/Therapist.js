import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Therapist = sequelize.define('Therapist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Връзка към основната таблица User (ако терапевтът има акаунт)
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    unique: true,
    references: { model: 'Users', key: 'id' }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: "Неизвестен",
    index: true // Индекс за бързо търсене по град
  },
  specialty: {
    type: DataTypes.STRING,
    index: true
  },
  phone: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
  },
  // Експертиза като Postgres масив
  expertise: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2), // Съхранява стойности като 4.85
    defaultValue: 0,
    validate: { min: 0, max: 5 }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  availability: DataTypes.TEXT,
  imageUrl: DataTypes.STRING
}, {
  timestamps: true,
  tableName: 'therapists'
});

export default Therapist;