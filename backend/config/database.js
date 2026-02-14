const { Sequelize } = require('sequelize');
require('dotenv').config(); // Уверяваме се, че зареждаме променливите

// Валидация: Ако тези липсват, сървърът въобще не трябва да тръгва
const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
requiredEnvVars.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`CRITICAL ERROR: Environment variable ${name} is missing. Check your .env file.`);
  }
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432, // Портът може да има default, ако е стандартен
    dialect: 'postgres',
    // В Enterprise среди логваме само при разработка
    logging: process.env.NODE_ENV === 'development' ? console.log : false, 
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 5, 
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: 30000,
      idle: 10000
    },
    // Важно за личен сървър: добави SSL, ако базата ти е на друга машина
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false 
      }
    } : {}
  }
);

module.exports = sequelize;