// backend/src/models/Therapist.js
import mongoose from "mongoose";

const TherapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, default: "Неизвестен" },
  specialty: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  expertise: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  availability: { type: String, default: "" },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Therapist || mongoose.model("Therapist", TherapistSchema);
