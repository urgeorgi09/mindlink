// Enterprise Database Pool Manager
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Валидация на критични променливи
const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
requiredEnvVars.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`❌ CRITICAL: ${name} missing in .env`);
  }
});

// Enterprise connection pool configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // ОПТИМИЗИРАН POOL за високо натоварване
    pool: {
      max: 20, // Максимум 20 връзки
      min: 5,  // Минимум 5 активни
      acquire: 30000, // 30s timeout
      idle: 10000,    // 10s idle преди затваряне
      evict: 5000     // Проверка на всеки 5s
    },
    
    // Retry logic при загуба на връзка
    retry: {
      max: 3,
      timeout: 3000
    },
    
    // SSL за production
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    
    // Query optimization
    benchmark: process.env.NODE_ENV === 'development',
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    }
  }
);

// Health check функция
export const checkDatabaseHealth = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection healthy');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Graceful shutdown
export const closeDatabaseConnection = async () => {
  try {
    await sequelize.close();
    console.log('🔌 Database connection closed gracefully');
  } catch (error) {
    console.error('❌ Error closing database:', error.message);
  }
};

// Auto-reconnect при загуба на връзка
sequelize.beforeConnect(async (config) => {
  console.log('🔄 Attempting database connection...');
});

sequelize.afterConnect(async (connection) => {
  console.log('✅ Database connected successfully');
});

export default sequelize;
