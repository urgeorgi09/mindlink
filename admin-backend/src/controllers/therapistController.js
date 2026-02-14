// backend/src/controllers/therapistController.js
import Therapist from "../models/Therapist.js";

/**
 * GET /api/therapists
 * optional query: city, specialty, search
 */
export const getTherapists = async (req, res) => {
  try {
    const { city, specialty, search } = req.query;
    const query = {};

    if (city) query.city = city;
    if (specialty) query.specialty = specialty;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialty: { $regex: search, $options: "i" } },
        { expertise: { $regex: search, $options: "i" } }
      ];
    }

    const list = await Therapist.find(query).limit(100);
    res.json(list);
  } catch (err) {
    console.error("❌ getTherapists error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createTherapist = async (req, res) => {
  try {
    const t = new Therapist(req.body);
    await t.save();
    res.status(201).json(t);
  } catch (err) {
    console.error("❌ createTherapist error:", err);
    res.status(400).json({ error: err.message });
  }
};

export default { getTherapists, createTherapist };
