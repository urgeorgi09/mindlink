// backend/src/seed/seedTherapists.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Therapist from "../models/Therapist.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mindlink";

const sample = [
  { name: "Д-р Иванова", city: "Стара Загора", specialty: "Когнитивно-поведенческа терапия", phone: "+359888111111", email: "ivanova@example.com", expertise: ["CBT", "Anxiety"], rating: 4.8 },
  { name: "Д-р Петров", city: "София", specialty: "Психодинамична терапия", phone: "+359888222222", email: "petrov@example.com", expertise: ["Depression", "Relationships"], rating: 4.6 },
  { name: "Мария Георгиева", city: "Пловдив", specialty: "Детски психолог", phone: "+359888333333", email: "maria@example.com", expertise: ["Children", "ADHD"], rating: 4.7 }
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB for seeding");
  await Therapist.deleteMany({});
  await Therapist.insertMany(sample);
  console.log("Seeded therapists");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
