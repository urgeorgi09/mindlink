const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'mindlink_secret_key_2025';

// PostgreSQL connection using environment variables
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mindlink',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
});

// In-memory typing status storage
const typingStatus = new Map();



// Initialize database tables
const initDB = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        specialty VARCHAR(255),
        experience VARCHAR(255),
        description TEXT,
        phone VARCHAR(50),
        education VARCHAR(255),
        profile_image TEXT,
        uin VARCHAR(50),
        verified BOOLEAN DEFAULT false,
        session_price INTEGER DEFAULT 80,
        assigned_therapist INTEGER REFERENCES users(id),
        requested_therapist INTEGER REFERENCES users(id),
        request_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        sender_id INTEGER REFERENCES users(id),
        recipient_id INTEGER REFERENCES users(id),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        time VARCHAR(10),
        is_read BOOLEAN DEFAULT false,
        is_important BOOLEAN DEFAULT false
      )
    `);

    // Notes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        patient_id INTEGER REFERENCES users(id),
        therapist_id INTEGER REFERENCES users(id),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Therapist-Patient relationships table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS therapist_patients (
        id SERIAL PRIMARY KEY,
        therapist_id INTEGER REFERENCES users(id),
        patient_id INTEGER REFERENCES users(id),
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(therapist_id, patient_id)
      )
    `);

    // Mood entries table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mood_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        mood INTEGER NOT NULL,
        energy INTEGER NOT NULL,
        anxiety INTEGER NOT NULL,
        notes TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Journal entries table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50),
        word_count INTEGER,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Therapist verification table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS therapist_verifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        license_number VARCHAR(255) NOT NULL,
        document_url TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        reviewed_by INTEGER REFERENCES users(id),
        reviewed_at TIMESTAMP,
        rejection_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized');
    
    // Add uin, verified and session_price columns if they don't exist
    try {
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS uin VARCHAR(50)
      `);
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false
      `);
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS session_price INTEGER DEFAULT 80
      `);
      console.log('UIN, verified and session_price columns added/verified');
    } catch (error) {
      console.log('Columns already exist or error:', error.message);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Initialize database on startup
initDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Serve static files only if they exist (Docker uses nginx)
if (require('fs').existsSync(path.join(__dirname, '../frontend/dist'))) {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role = 'user', specialty } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Всички полета са задължителни' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Паролата трябва да е поне 6 символа' });
        }

        // Check if user exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Потребител с този email вече съществува' });
        }

        if (!['user', 'therapist', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Невалидна роля' });
        }

        if (role === 'therapist' && !specialty) {
            return res.status(400).json({ message: 'Специалността е задължителна за терапевти' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, email, password, role, specialty) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, specialty, created_at',
            [name, email, hashedPassword, role, role === 'therapist' ? specialty : null]
        );

        const newUser = result.rows[0];
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Регистрацията е успешна',
            user: newUser,
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Грешка в сървъра' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email и парола са задължителни' });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Невалиден email или парола' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Невалиден email или парола' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Успешно влизане',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Грешка в сървъра' });
    }
});

// Update therapist profile
app.put('/api/therapist/update-profile', authenticateToken, async (req, res) => {
    try {
        const { experience, phone, education, sessionPrice, profileImage } = req.body;
        
        if (req.user.role !== 'therapist') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        await pool.query(
            'UPDATE users SET experience = $1, phone = $2, education = $3, session_price = $4, profile_image = $5 WHERE id = $6',
            [experience, phone, education, sessionPrice, profileImage, req.user.id]
        );
        
        res.json({ message: 'Профилът е обновен успешно' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Грешка при обновяване на профила' });
    }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role, specialty, experience, description, phone, education, profile_image FROM users WHERE id = $1',
            [req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Потребителят не е намерен' });
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Грешка при зареждане на потребителя' });
    }
});

// Get therapist profile by ID (public)
app.get('/api/therapist/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'SELECT id, name, specialty, experience, description, phone, education, profile_image, verified, session_price FROM users WHERE id = $1 AND role = $2',
            [id, 'therapist']
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Терапевтът не е намерен' });
        }

        res.json({ therapist: result.rows[0] });
    } catch (error) {
        console.error('Error fetching therapist profile:', error);
        res.status(500).json({ message: 'Грешка при зареждане на профила' });
    }
});

// Get therapist profile
app.get('/api/therapist/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, specialty, experience, description, phone, education, profile_image, verified, session_price FROM users WHERE id = $1',
            [req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Потребителят не е намерен' });
        }

        res.json({ therapist: result.rows[0] });
    } catch (error) {
        console.error('Error fetching therapist:', error);
        res.status(500).json({ message: 'Грешка при зареждане на профила' });
    }
});

// Update therapist profile
app.put('/api/therapist/profile', authenticateToken, async (req, res) => {
    try {
        const { experience, phone, education, sessionPrice, profileImage, description } = req.body;
        
        if (req.user.role !== 'therapist') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        await pool.query(
            'UPDATE users SET experience = $1, phone = $2, education = $3, session_price = $4, profile_image = $5, description = $6 WHERE id = $7',
            [experience, phone, education, sessionPrice, profileImage, description, req.user.id]
        );
        
        res.json({ message: 'Профилът е обновен успешно' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Грешка при обновяване на профила' });
    }
});

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        const result = await pool.query(
            'SELECT id, name, email, role, specialty, verified, uin, created_at FROM users ORDER BY created_at DESC'
        );
        
        res.json({ users: result.rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Грешка при зареждане на потребителите' });
    }
});

// Get therapists
app.get('/api/therapists', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, specialty, experience, description, phone, education, profile_image, verified, session_price FROM users WHERE role = $1',
            ['therapist']
        );
        
        const therapists = result.rows.map(therapist => ({
            ...therapist,
            avatar: '👩⚕️',
            rating: (4.0 + Math.random()).toFixed(1),
            price: `${therapist.session_price || 80} лв/сесия`,
            available: true
        }));
        
        res.json({ therapists });
    } catch (error) {
        console.error('Error fetching therapists:', error);
        res.status(500).json({ message: 'Грешка при зареждане на терапевтите' });
    }
});

// Admin: Get unverified therapists
app.get('/api/admin/therapists/unverified', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        const result = await pool.query(
            'SELECT id, name, email, specialty, experience, education, created_at FROM users WHERE role = $1 AND verified = false',
            ['therapist']
        );
        
        res.json({ therapists: result.rows });
    } catch (error) {
        console.error('Error fetching unverified therapists:', error);
        res.status(500).json({ message: 'Грешка при зареждане на терапевтите' });
    }
});

// Admin: Verify therapist
app.post('/api/admin/therapists/verify', async (req, res) => {
    try {
        const { therapistId } = req.body;
        
        await pool.query(
            'UPDATE users SET verified = true WHERE id = $1 AND role = $2',
            [therapistId, 'therapist']
        );
        
        res.json({ message: 'Терапевтът е верифициран успешно' });
    } catch (error) {
        console.error('Error verifying therapist:', error);
        res.status(500).json({ message: 'Грешка при верификация' });
    }
});

// Verify therapist UIN with BLS registry
app.post('/api/therapist/verify-uin', authenticateToken, async (req, res) => {
    try {
        const { uin } = req.body;
        
        if (req.user.role !== 'therapist') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        if (!uin || !/^\d{10}$/.test(uin)) {
            return res.status(400).json({ 
                success: false,
                message: 'УИН номерът трябва да е точно 10 цифри' 
            });
        }
        
        const userResult = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Потребителят не е намерен' });
        }
        
        const userName = userResult.rows[0].name.trim();
        
        // Try to verify with BLS registry
        try {
            const blsUrl = `https://blsbg.eu/bg/medics/search?uin=${uin}`;
            const response = await axios.get(blsUrl, { 
                timeout: 8000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const $ = cheerio.load(response.data);
            
            const registryName = $('.medic-name, .doctor-name, h3, h4, .name').first().text().trim();
            
            if (registryName && registryName.length > 3) {
                console.log('BLS verification success:', { uin, registryName });
                
                await pool.query(
                    'UPDATE users SET uin = $1, verified = true WHERE id = $2',
                    [uin, req.user.id]
                );
                
                return res.json({ 
                    success: true,
                    message: `Верификацията е успешна! Потвърдено: ${registryName}`,
                    data: { name: registryName, method: 'automatic' }
                });
            }
        } catch (scrapeError) {
            console.log('BLS scraping failed, using manual verification:', scrapeError.message);
        }
        
        // Fallback: Manual verification (save UIN, admin approves later)
        await pool.query(
            'UPDATE users SET uin = $1 WHERE id = $2',
            [uin, req.user.id]
        );
        
        res.json({ 
            success: true,
            message: 'УИН номерът е запазен. Очаква се ръчна верификация от администратор.',
            data: { method: 'manual', requiresApproval: true }
        });
        
    } catch (error) {
        console.error('UIN verification error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Грешка при верификация' 
        });
    }
});

// Get patient's therapists
app.get('/api/patient/therapists', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        const result = await pool.query(
            `SELECT u.id, u.name, u.specialty, u.experience, u.description, u.phone, u.education, u.profile_image 
             FROM users u 
             JOIN therapist_patients tp ON u.id = tp.therapist_id 
             WHERE tp.patient_id = $1 AND u.role = 'therapist'`,
            [req.user.id]
        );
        
        const therapists = result.rows.map(therapist => ({
            ...therapist,
            avatar: '👩⚕️',
            rating: (4.0 + Math.random()).toFixed(1),
            price: `${therapist.session_price || 80} лв/сесия`,
            available: true
        }));
        
        res.json({ therapists });
    } catch (error) {
        console.error('Error fetching patient therapists:', error);
        res.status(500).json({ message: 'Грешка при зареждане на терапевтите' });
    }
});

// Get patient's assigned therapist (for chat)
app.get('/api/patient/therapist', authenticateToken, async (req, res) => {
    try {
        console.log('🔍 /api/patient/therapist called by user:', req.user);
        
        if (req.user.role !== 'user') {
            console.log('❌ Access denied - role is:', req.user.role);
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        console.log('✅ Querying therapist_patients for patient_id:', req.user.id);
        
        const result = await pool.query(
            `SELECT u.id, u.name, u.specialty, u.experience, u.description, u.phone, u.education, u.profile_image 
             FROM users u 
             JOIN therapist_patients tp ON u.id = tp.therapist_id 
             WHERE tp.patient_id = $1 AND u.role = 'therapist'
             LIMIT 1`,
            [req.user.id]
        );
        
        console.log('📊 Query result rows:', result.rows.length);
        
        if (result.rows.length === 0) {
            console.log('❌ No therapist found for patient:', req.user.id);
            return res.json({ hasTherapist: false });
        }
        
        console.log('✅ Therapist found:', result.rows[0]);
        
        res.json({ 
            hasTherapist: true,
            therapist: result.rows[0]
        });
    } catch (error) {
        console.error('💥 Error fetching patient therapist:', error);
        res.status(500).json({ message: 'Грешка при зареждане на терапевта' });
    }
});

// Send therapist request
app.post('/api/therapist/request', authenticateToken, async (req, res) => {
    try {
        const { therapistId } = req.body;
        
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Само пациенти могат да изпращат заявки' });
        }
        
        await pool.query(
            'UPDATE users SET requested_therapist = $1, request_date = CURRENT_TIMESTAMP WHERE id = $2',
            [therapistId, req.user.id]
        );
        
        res.json({ message: 'Заявката е изпратена успешно' });
    } catch (error) {
        console.error('Error sending request:', error);
        res.status(500).json({ message: 'Грешка при изпращане на заявката' });
    }
});

// Get therapist patients
app.get('/api/therapist/patients', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'therapist') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        const result = await pool.query(
            `SELECT u.id, u.name, u.email, u.created_at 
             FROM users u 
             JOIN therapist_patients tp ON u.id = tp.patient_id 
             WHERE tp.therapist_id = $1 AND u.role = 'user'`,
            [req.user.id]
        );
        
        const patients = result.rows.map(user => ({
            ...user,
            lastMessage: 'Няма съобщения',
            time: 'Нов',
            unread: 0
        }));
        
        res.json({ patients });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Грешка при зареждане на пациентите' });
    }
});

// Get therapist requests
app.get('/api/therapist/requests', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'therapist') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        const result = await pool.query(
            'SELECT id, name, email, request_date FROM users WHERE requested_therapist = $1 AND role = $2',
            [req.user.id, 'user']
        );
        
        res.json({ requests: result.rows });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Грешка при зареждане на заявките' });
    }
});

// Accept therapist request
app.post('/api/therapist/accept', authenticateToken, async (req, res) => {
    try {
        const { patientId } = req.body;
        
        if (req.user.role !== 'therapist') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        // Clear the request and add to therapist-patient relationship
        await pool.query(
            'UPDATE users SET requested_therapist = NULL, request_date = NULL WHERE id = $1',
            [patientId]
        );
        
        // Add to therapist_patients table
        await pool.query(
            'INSERT INTO therapist_patients (therapist_id, patient_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.user.id, patientId]
        );
        
        res.json({ message: 'Пациентът е приет успешно' });
    } catch (error) {
        console.error('Error accepting request:', error);
        res.status(500).json({ message: 'Грешка при приемане на заявката' });
    }
});

// Send message
app.post('/api/chat/send', authenticateToken, async (req, res) => {
    try {
        const { recipientId, text, isImportant } = req.body;
        
        if (!text || !recipientId) {
            return res.status(400).json({ message: 'Текст и получател са задължителни' });
        }
        
        const result = await pool.query(
            'INSERT INTO messages (text, sender_id, recipient_id, time, is_important) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [text, req.user.id, recipientId, new Date().toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' }), isImportant || false]
        );
        
        res.json({ message: 'Съобщението е изпратено' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Грешка при изпращане на съобщението' });
    }
});

// Get messages
app.get('/api/chat/messages/:recipientId', authenticateToken, async (req, res) => {
    try {
        const recipientId = req.params.recipientId;
        
        const result = await pool.query(
            `SELECT id, text, sender_id, time, is_read, is_important FROM messages 
             WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1) 
             ORDER BY timestamp ASC`,
            [req.user.id, recipientId]
        );
        
        // Mark messages as read
        await pool.query(
            'UPDATE messages SET is_read = true WHERE recipient_id = $1 AND sender_id = $2 AND is_read = false',
            [req.user.id, recipientId]
        );
        
        const typingKey = `${recipientId}-${req.user.id}`;
        const isTyping = typingStatus.get(typingKey) || false;
        
        res.json({ messages: result.rows, isTyping });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Грешка при зареждане на съобщенията' });
    }
});

// Set typing status
app.post('/api/chat/typing', authenticateToken, async (req, res) => {
    try {
        const { recipientId, typing } = req.body;
        const typingKey = `${req.user.id}-${recipientId}`;
        
        if (typing) {
            typingStatus.set(typingKey, true);
            setTimeout(() => typingStatus.delete(typingKey), 3000);
        } else {
            typingStatus.delete(typingKey);
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Грешка' });
    }
});

// Get unread message count
app.get('/api/chat/unread-count', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT COUNT(*) FROM messages WHERE recipient_id = $1 AND is_read = false',
            [req.user.id]
        );
        
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ message: 'Грешка' });
    }
});

// Toggle message importance
app.post('/api/chat/toggle-important/:messageId', authenticateToken, async (req, res) => {
    try {
        const { messageId } = req.params;
        
        await pool.query(
            'UPDATE messages SET is_important = NOT is_important WHERE id = $1 AND sender_id = $2',
            [messageId, req.user.id]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error toggling importance:', error);
        res.status(500).json({ message: 'Грешка' });
    }
});

// Add patient note
app.post('/api/notes/add', authenticateToken, async (req, res) => {
    try {
        const { patientId, title, content } = req.body;
        
        if (req.user.role !== 'therapist') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        if (!patientId || !title || !content) {
            return res.status(400).json({ message: 'Всички полета са задължителни' });
        }
        
        await pool.query(
            'INSERT INTO notes (title, content, patient_id, therapist_id) VALUES ($1, $2, $3, $4)',
            [title, content, patientId, req.user.id]
        );
        
        res.json({ message: 'Бележката е добавена успешно' });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ message: 'Грешка при добавяне на бележката' });
    }
});

// Get patient notes
app.get('/api/notes/:patientId', authenticateToken, async (req, res) => {
    try {
        const patientId = req.params.patientId;
        
        if (req.user.role !== 'therapist') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        const result = await pool.query(
            'SELECT id, title, content, date FROM notes WHERE patient_id = $1 AND therapist_id = $2 ORDER BY date DESC',
            [patientId, req.user.id]
        );
        
        res.json({ notes: result.rows });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Грешка при зареждане на бележките' });
    }
});

// Save mood entry
app.post('/api/mood/save', authenticateToken, async (req, res) => {
    try {
        const { mood, energy, anxiety, notes } = req.body;
        
        const result = await pool.query(
            'INSERT INTO mood_entries (user_id, mood, energy, anxiety, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [req.user.id, mood, energy, anxiety, notes || '']
        );
        
        res.json({ message: 'Настроението е запазено', id: result.rows[0].id });
    } catch (error) {
        console.error('Error saving mood:', error);
        res.status(500).json({ message: 'Грешка при запазване на настроението' });
    }
});

// Get mood entries
app.get('/api/mood/entries', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, mood, energy, anxiety, notes, date FROM mood_entries WHERE user_id = $1 ORDER BY date DESC',
            [req.user.id]
        );
        
        res.json({ entries: result.rows });
    } catch (error) {
        console.error('Error fetching mood entries:', error);
        res.status(500).json({ message: 'Грешка при зареждане на записите' });
    }
});

// Delete all mood entries
app.delete('/api/mood/delete-all', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM mood_entries WHERE user_id = $1', [req.user.id]);
        res.json({ message: 'Всички записи за настроение са изтрити' });
    } catch (error) {
        console.error('Error deleting mood entries:', error);
        res.status(500).json({ message: 'Грешка при изтриване' });
    }
});

// Get patient emotions (therapist only)
app.get('/api/therapist/patient-emotions/:patientId', authenticateToken, async (req, res) => {
    try {
        const { patientId } = req.params;
        
        if (req.user.role !== 'therapist' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        const patientResult = await pool.query('SELECT id, name, role FROM users WHERE id = $1', [patientId]);
        
        if (patientResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Пациентът не е намерен' });
        }
        
        const result = await pool.query(
            'SELECT id, mood as intensity, anxiety, energy, notes, date FROM mood_entries WHERE user_id = $1 ORDER BY date DESC LIMIT 50',
            [patientId]
        );
        
        const emotions = result.rows.map(entry => {
            let emotion = 'Неизвестно';
            if (entry.intensity >= 8) emotion = 'Щастие';
            else if (entry.intensity >= 6) emotion = 'Спокойствие';
            else if (entry.intensity >= 4) emotion = 'Тревожност';
            else if (entry.intensity >= 2) emotion = 'Тъга';
            else emotion = 'Гняв';
            
            return {
                id: entry.id,
                emotion,
                intensity: entry.intensity * 10,
                notes: entry.notes || '',
                date: entry.date
            };
        });
        
        res.json({
            success: true,
            patientName: patientResult.rows[0].name,
            emotions
        });
    } catch (error) {
        console.error('Error fetching patient emotions:', error);
        res.status(500).json({ success: false, message: 'Грешка при зареждане на емоциите' });
    }
});

// Save journal entry
app.post('/api/journal/save', authenticateToken, async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const wordCount = content.split(/\s+/).length;
        
        await pool.query(
            'INSERT INTO journal_entries (user_id, title, content, category, word_count) VALUES ($1, $2, $3, $4, $5)',
            [req.user.id, title, content, category, wordCount]
        );
        
        res.json({ message: 'Записът е запазен' });
    } catch (error) {
        console.error('Error saving journal:', error);
        res.status(500).json({ message: 'Грешка при запазване на записа' });
    }
});

// Get journal entries
app.get('/api/journal/entries', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, title, content, category, word_count, date FROM journal_entries WHERE user_id = $1 ORDER BY date DESC',
            [req.user.id]
        );
        
        res.json({ entries: result.rows });
    } catch (error) {
        console.error('Error fetching journal entries:', error);
        res.status(500).json({ message: 'Грешка при зареждане на записите' });
    }
});

// Delete all journal entries
app.delete('/api/journal/delete-all', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM journal_entries WHERE user_id = $1', [req.user.id]);
        res.json({ message: 'Всички дневникови записи са изтрити' });
    } catch (error) {
        console.error('Error deleting journal entries:', error);
        res.status(500).json({ message: 'Грешка при изтриване' });
    }
});

// Submit therapist verification
app.post('/api/therapist/verify', authenticateToken, async (req, res) => {
    try {
        const { licenseNumber, documentUrl } = req.body;
        
        if (req.user.role !== 'therapist') {
            return res.status(403).json({ message: 'Само терапевти могат да се верифицират' });
        }
        
        if (!licenseNumber || !documentUrl) {
            return res.status(400).json({ message: 'Всички полета са задължителни' });
        }
        
        await pool.query(
            'INSERT INTO therapist_verifications (user_id, license_number, document_url) VALUES ($1, $2, $3)',
            [req.user.id, licenseNumber, documentUrl]
        );
        
        res.json({ message: 'Заявката за верификация е изпратена успешно' });
    } catch (error) {
        console.error('Error submitting verification:', error);
        res.status(500).json({ message: 'Грешка при изпращане на заявката' });
    }
});

// Get pending verifications (admin only)
app.get('/api/admin/verifications', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        const result = await pool.query(
            `SELECT v.*, u.name, u.email 
             FROM therapist_verifications v 
             JOIN users u ON v.user_id = u.id 
             WHERE v.status = 'pending' 
             ORDER BY v.created_at DESC`
        );
        
        res.json({ verifications: result.rows });
    } catch (error) {
        console.error('Error fetching verifications:', error);
        res.status(500).json({ message: 'Грешка при зареждане на верификациите' });
    }
});

// Get system stats (admin only)
app.get('/api/admin/overview', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        const totalUsers = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['user']);
        const totalTherapists = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['therapist']);
        const verifiedTherapists = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1 AND verified = true', ['therapist']);
        const totalMoodEntries = await pool.query('SELECT COUNT(*) FROM mood_entries');
        const totalJournalEntries = await pool.query('SELECT COUNT(*) FROM journal_entries');
        const totalMessages = await pool.query('SELECT COUNT(*) FROM messages');
        
        res.json({
            totalUsers: parseInt(totalUsers.rows[0].count),
            totalTherapists: parseInt(totalTherapists.rows[0].count),
            verifiedTherapists: parseInt(verifiedTherapists.rows[0].count),
            totalMoodEntries: parseInt(totalMoodEntries.rows[0].count),
            totalJournalEntries: parseInt(totalJournalEntries.rows[0].count),
            totalMessages: parseInt(totalMessages.rows[0].count)
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Грешка при зареждане на статистиките' });
    }
});

// Debug endpoint - view database tables (remove in production!)
app.get('/api/debug/tables', async (req, res) => {
    try {
        const users = await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
        const moodEntries = await pool.query('SELECT * FROM mood_entries ORDER BY date DESC LIMIT 20');
        const therapistPatients = await pool.query('SELECT * FROM therapist_patients');
        
        res.json({
            users: users.rows,
            moodEntries: moodEntries.rows,
            therapistPatients: therapistPatients.rows
        });
    } catch (error) {
        console.error('Error fetching debug data:', error);
        res.status(500).json({ message: 'Грешка' });
    }
});

// Presence system - онлайн статус
const presenceMap = new Map(); // userId -> { lastSeen: timestamp }
const ONLINE_THRESHOLD_MS = 30 * 1000; // 30 секунди

// Heartbeat - потребителят е онлайн
app.post('/api/presence/heartbeat', authenticateToken, (req, res) => {
    presenceMap.set(req.user.id, { lastSeen: Date.now() });
    res.json({ success: true });
});

// Offline - потребителят излиза
app.post('/api/presence/offline', authenticateToken, (req, res) => {
    presenceMap.delete(req.user.id);
    res.json({ success: true });
});

// Get status на един потребител
app.get('/api/presence/status/:userId', authenticateToken, (req, res) => {
    const userId = parseInt(req.params.userId);
    const presence = presenceMap.get(userId);
    
    if (!presence) {
        return res.json({ online: false, lastSeen: null });
    }
    
    const isOnline = (Date.now() - presence.lastSeen) < ONLINE_THRESHOLD_MS;
    res.json({ online: isOnline, lastSeen: presence.lastSeen });
});

// Batch status - за много потребители наведнъж
app.post('/api/presence/status/batch', authenticateToken, (req, res) => {
    const { userIds } = req.body;
    const statuses = {};
    
    userIds.forEach(userId => {
        const presence = presenceMap.get(userId);
        if (!presence) {
            statuses[userId] = { online: false, lastSeen: null };
        } else {
            const isOnline = (Date.now() - presence.lastSeen) < ONLINE_THRESHOLD_MS;
            statuses[userId] = { online: isOnline, lastSeen: presence.lastSeen };
        }
    });
    
    res.json({ statuses });
});

// Approve/Reject verification (admin only)
app.post('/api/admin/verify/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        await pool.query(
            'UPDATE therapist_verifications SET status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP, rejection_reason = $3 WHERE id = $4',
            [status, req.user.id, rejectionReason, id]
        );
        
        res.json({ message: `Верификацията е ${status === 'approved' ? 'одобрена' : 'отхвърлена'}` });
    } catch (error) {
        console.error('Error updating verification:', error);
        res.status(500).json({ message: 'Грешка при обновяване на верификацията' });
    }
});

// Analytics endpoint - role-based statistics
app.get('/api/analytics', authenticateToken, async (req, res) => {
    try {
        if (req.user.role === 'user') {
            // User analytics - personal stats
            const moodCount = await pool.query('SELECT COUNT(*) FROM mood_entries WHERE user_id = $1', [req.user.id]);
            const journalCount = await pool.query('SELECT COUNT(*) FROM journal_entries WHERE user_id = $1', [req.user.id]);
            const avgMood = await pool.query('SELECT AVG(mood) FROM mood_entries WHERE user_id = $1', [req.user.id]);
            
            res.json({
                moodEntries: parseInt(moodCount.rows[0].count),
                journalEntries: parseInt(journalCount.rows[0].count),
                averageMood: parseFloat(avgMood.rows[0].avg) || 0
            });
        } else if (req.user.role === 'therapist') {
            // Therapist analytics - patient stats
            const patientCount = await pool.query(
                'SELECT COUNT(*) FROM therapist_patients WHERE therapist_id = $1',
                [req.user.id]
            );
            const sessionCount = await pool.query(
                'SELECT COUNT(*) FROM notes WHERE therapist_id = $1 AND date >= NOW() - INTERVAL \'30 days\'',
                [req.user.id]
            );
            const messageCount = await pool.query(
                'SELECT COUNT(DISTINCT recipient_id) FROM messages WHERE sender_id = $1',
                [req.user.id]
            );
            
            res.json({
                totalPatients: parseInt(patientCount.rows[0].count),
                sessionsThisMonth: parseInt(sessionCount.rows[0].count),
                activeChats: parseInt(messageCount.rows[0].count)
            });
        } else if (req.user.role === 'admin') {
            // Admin analytics - platform-wide stats
            const totalUsers = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['user']);
            const totalTherapists = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['therapist']);
            const totalPatients = await pool.query('SELECT COUNT(DISTINCT patient_id) FROM therapist_patients');
            const moodCount = await pool.query('SELECT COUNT(*) FROM mood_entries');
            const journalCount = await pool.query('SELECT COUNT(*) FROM journal_entries');
            const avgMood = await pool.query('SELECT AVG(mood) FROM mood_entries');
            const activeUsers = await pool.query(
                'SELECT COUNT(DISTINCT user_id) FROM mood_entries WHERE date >= NOW() - INTERVAL \'7 days\''
            );
            
            res.json({
                totalUsers: parseInt(totalUsers.rows[0].count),
                totalTherapists: parseInt(totalTherapists.rows[0].count),
                totalPatients: parseInt(totalPatients.rows[0].count),
                activeUsers: parseInt(activeUsers.rows[0].count),
                moodEntries: parseInt(moodCount.rows[0].count),
                journalEntries: parseInt(journalCount.rows[0].count),
                averageMood: parseFloat(avgMood.rows[0].avg) || 0
            });
        } else {
            res.status(403).json({ message: 'Достъп отказан' });
        }
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Грешка при зареждане на аналитиката' });
    }
});

// Admin sync endpoint - get all data for admin dashboard
app.get('/api/admin/sync-data', async (req, res) => {
    try {
        const users = await pool.query('SELECT id, name, email, role, specialty, verified, uin, created_at FROM users ORDER BY created_at DESC');
        const messages = await pool.query('SELECT id, text, sender_id, recipient_id, timestamp, is_read, is_important FROM messages ORDER BY timestamp DESC');
        const moodEntries = await pool.query('SELECT id, user_id, mood, energy, anxiety, notes, date FROM mood_entries ORDER BY date DESC');
        const journalEntries = await pool.query('SELECT id, user_id, title, content, category, word_count, date FROM journal_entries ORDER BY date DESC');
        const notes = await pool.query('SELECT id, title, content, patient_id, therapist_id, date FROM notes ORDER BY date DESC');
        const therapistPatients = await pool.query('SELECT id, therapist_id, patient_id, assigned_at FROM therapist_patients');
        
        res.json({
            users: users.rows,
            messages: messages.rows,
            moodEntries: moodEntries.rows,
            journalEntries: journalEntries.rows,
            notes: notes.rows,
            therapistPatients: therapistPatients.rows
        });
    } catch (error) {
        console.error('Error syncing data:', error);
        res.status(500).json({ message: 'Грешка при синхронизация' });
    }
});

// Serve React app (only if dist exists)
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../frontend/dist/index.html');
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).json({ message: 'Frontend not found - using nginx proxy' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
    console.log(`🐘 PostgreSQL: postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});