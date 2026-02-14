import { Therapist } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * GET /api/therapists
 * Оптимизирано търсене с пагинация и Whitelisting
 */
export const getTherapists = async (req, res) => {
  try {
    const { city, specialty, search, page = 1, limit = 20 } = req.query;
    
    // 1. Изчисляване на отместването (Pagination)
    const offset = (page - 1) * limit;
    
    // 2. Изграждане на динамична Query (Sequelize стил)
    const whereClause = {};
    if (city) whereClause.city = city;
    if (specialty) whereClause.specialty = specialty;
    
    if (search) {
      // Санитаризирано търсене (ILike е Case-Insensitive в Postgres)
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { specialty: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Therapist.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: rows,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (err) {
    console.error("❌ getTherapists error:", err);
    res.status(500).json({ success: false, error: "Вътрешна грешка при търсене" });
  }
};

/**
 * POST /api/therapists
 * Сигурно създаване с Whitelisting
 */
export const createTherapist = async (req, res) => {
  try {
    // 3. Enterprise Whitelisting: Приемаме САМО тези полета
    const { name, city, specialty, bio, expertise } = req.body;

    const newTherapist = await Therapist.create({
      id: crypto.randomUUID(),
      name,
      city,
      specialty,
      bio,
      expertise,
      isVerified: false // Твърдо зададено - не може да се промени от потребителя
    });

    res.status(201).json({ success: true, data: newTherapist });
  } catch (err) {
    res.status(400).json({ success: false, error: "Невалидни данни за терапевт" });
  }
};