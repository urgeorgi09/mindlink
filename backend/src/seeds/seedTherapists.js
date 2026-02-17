import { sequelize } from '../config/database.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const seedTherapists = async () => {
  try {
    await sequelize.sync(); // Уверяваме се, че таблиците съществуват
    
    const hashedPassword = await bcrypt.hash('password123', 12);

    const therapists = [
      {
        firstName: 'Ива',
        lastName: 'Иванова',
        email: 'ivanova@mindlink.bg',
        password: hashedPassword,
        role: 'therapist',
        city: 'Стара Загора',
        specialty: 'Когнитивно-поведенческа терапия',
        verificationStatus: 'approved', // Важно за филтрирането в API-то
        stats: { rating: 4.8, experienceYears: 10 }
      },
      // ... още записи
    ];

    // Използваме bulkCreate за скорост
    await User.bulkCreate(therapists, { ignoreDuplicates: true });
    
    console.log("✅ Базата данни е успешно попълнена с терапевти!");
    process.exit();
  } catch (error) {
    console.error("❌ Грешка при seeding:", error);
    process.exit(1);
  }
};

seedTherapists();