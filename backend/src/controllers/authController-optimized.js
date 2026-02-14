import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js'; // Твоят Sequelize модел

// Помощна функция за генериране на токен (Enterprise DRY принцип)
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Валидация на входа
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    // 2. Сигурност: Force 'user' role. Никой не може да се регистрира като админ през API-то!
    const role = 'user'; 

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'User already exists' });
    }

    // 3. Хеширане и запис
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await User.create({
      id: uuidv4(),
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
    console.error('Registration Error:', error); // Задължително логване на сървъра
    res.status(500).json({ success: false, error: 'Internal server error' }); // Не връщай error.message на клиента!
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Търсене по email (Sequelize синтаксис)
    const user = await User.findOne({ where: { email } });
    
    // 2. Constant-time comparison (предпазва от timing attacks)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // 3. Обновяване на активност (Enterprise стандарт за одит)
    await user.update({ lastActive: new Date() });

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};