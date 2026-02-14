import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import User from '../src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindlink';

const seedUsers = [
  {
    _id: 'admin-' + uuidv4(),
    role: 'admin'
  },
  {
    _id: 'therapist-' + uuidv4(),
    role: 'therapist'
  },
  {
    _id: 'user-' + uuidv4(),
    role: 'user'
  }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const userData of seedUsers) {
      const existingUser = await User.findById(userData._id);
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Created ${userData.role}: ${userData._id}`);
      } else {
        console.log(`⚠️  User already exists: ${userData._id}`);
      }
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\nTest accounts created:');
    seedUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user._id}`);
    });
    
    console.log('\nYou can use these IDs in the frontend RoleSelector component for testing.');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();