import sequelize from '../config/database.js';
import Badge from '../src/models/Badge.js';
import { logger } from '../utils/logger.js'; // Пример за използване на логър
import badgesData from './data/badges.json' assert { type: 'json' };

/**
 * Enterprise Seed Script
 * Използва автоматично засичане на полета и транзакционна сигурност.
 */
const seedBadges = async () => {
  const t = await sequelize.transaction();
  
  try {
    logger.info('Starting database seeding...');

    // Динамично извличане на полетата от модела, за да не ги хардкодваме
    // Изключваме primary key и timestamps
    const modelAttributes = Object.keys(Badge.rawAttributes);
    const fieldsToUpdate = modelAttributes.filter(
      attr => !['id', 'createdAt', 'updatedAt', 'badgeId'].includes(attr)
    );

    await Badge.bulkCreate(badgesData, {
      updateOnDuplicate: fieldsToUpdate,
      transaction: t,
      validate: true // Enterprise стандарт: винаги валидирай данните преди запис
    });

    await t.commit();
    logger.info('Seeding successful.');
  } catch (error) {
    await t.rollback();
    logger.error('Seeding failed. Rollback executed.', { error: error.message });
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

seedBadges();