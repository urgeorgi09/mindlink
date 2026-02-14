import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js'; // Твоят Sequelize модел

// Helper за токени (Enterprise практика: DRY)
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body; // Не взимаме ролята от тялото!

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    // Enterprise Сигурност: Регистрацията винаги е само за обикновени потребители
    const role = 'user';

    // Проверка за съществуващ потребител (Sequelize синтаксис)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      id: uuidv4(), // Сигурно и уникално ID
      email,
      password: hashedPassword,
      role
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    
    // Constant-time check (bcrypt) предпазва от timing attacks
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Update last active
    await user.update({ lastActive: new Date() });

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    // req.user идва от вашия Auth Middleware
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Никога не връщай хеша!
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};