import sequelize from '../config/database.js';
import User from '../src/models/User.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// Използваме фиксирани ID-та за тест акаунтите, за да не се дублират при всеки сийд
const SEED_USERS = [
  {
    id: '00000000-0000-4000-a000-000000000001', // Фиксиран UUID
    email: 'admin@mindlink.bg',
    role: 'admin',
    username: 'system_admin'
  },
  {
    id: '00000000-0000-4000-a000-000000000002',
    email: 'therapist@mindlink.bg',
    role: 'therapist',
    username: 'main_therapist'
  }
];

const seedUsers = async () => {
  const transaction = await sequelize.transaction();
  try {
    console.log('🚀 Seeding system users...');

    // Enterprise подход: upsert (update or insert) по имейл или фиксирано ID
    await User.bulkCreate(SEED_USERS, {
      updateOnDuplicate: ['role', 'username'], 
      transaction
    });

    await transaction.commit();
    console.log('✅ Users synced successfully.');
  } catch (err) {
    await transaction.rollback();
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await sequelize.close();
  }
};

seedUsers();