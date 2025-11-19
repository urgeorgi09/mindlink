import { Therapist } from '../models/index.js';

// GET /api/therapists - Търси терапевти
export const getTherapists = async (req, res) => {
  try {
    const { city, specialty, search } = req.query;

    let query = {};

    if (city && city !== 'Всички градове') {
      query.city = city;
    }
    
    if (specialty && specialty !== 'Всички специалности') {
      query.specialty = specialty;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { expertise: { $regex: search, $options: 'i' } }
      ];
    }

    const therapists = await Therapist.find(query);
    res.json(therapists);
  } catch (err) {
    console.error('❌ Error fetching therapists:', err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/therapists - Добавя нов терапевт (optional)
export const createTherapist = async (req, res) => {
  try {
    const therapist = new Therapist(req.body);
    await therapist.save();
    res.status(201).json(therapist);
  } catch (err) {
    console.error('❌ Error creating therapist:', err);
    res.status(400).json({ error: err.message });
  }
};