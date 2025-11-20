import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Badge from '../models/Badge.js';
import connectDB from '../config/database.js';

dotenv.config();

const badges = [
  { badgeId: 'chatbot_10', name: 'AI Приятел', description: 'Напиши 10 съобщения в чат с AI', category: 'chat', color: ['#06b6d4', '#2563eb'] },
  { badgeId: 'journal_5', name: 'Писател', description: 'Напиши 5 дневникови записа', category: 'journal', color: ['#a855f7', '#7e22ce'] },
  { badgeId: 'streak_7', name: '7-дневен Воин', description: 'Използвай приложението 7 дни подред', category: 'streak', color: ['#fb923c', '#ef4444'] },
  { badgeId: 'breathing_20', name: 'Дихателен Майстор', description: 'Завърши 20 дихателни упражнения', category: 'breathing', color: ['#4ade80', '#16a34a'] }
];

const seed = async () => {
  try {
    await connectDB();
    for (const b of badges) {
      await Badge.findOneAndUpdate(
        { badgeId: b.badgeId },
        { $setOnInsert: b },
        { upsert: true }
      );
    }
    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
