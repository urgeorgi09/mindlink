const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'mindlink_secret_key_2025';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://mindlink_user:mindlink_pass@mindlink-db:5432/mindlink';

// PostgreSQL connection
const pool = new Pool({
  connectionString: DATABASE_URL,
});

// Initialize database tables
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        specialty VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

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

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Всички полета са задължителни' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Паролата трябва да е поне 6 символа' });
        }

        // Check if user exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Потребител с този email вече съществува' });
        }

        // Validate role
        if (!['user', 'therapist', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Невалидна роля' });
        }

        // Validate specialty for therapists
        if (role === 'therapist' && !specialty) {
            return res.status(400).json({ message: 'Специалността е задължителна за терапевти' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role,
            specialty: role === 'therapist' ? specialty : undefined,
            createdAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);
        const userId = result.insertedId;

        // Generate token
        const token = jwt.sign(
            { id: userId, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user without password
        const { password: _, ...userWithoutPassword } = { ...newUser, id: userId };

        res.status(201).json({
            message: 'Регистрацията е успешна',
            user: userWithoutPassword,
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

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email и парола са задължителни' });
        }

        // Find user
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Невалиден email или парола' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Невалиден email или парола' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user without password
        const { password: _, ...userWithoutPassword } = { ...user, id: user._id };

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

// Get therapist profile by ID
app.get('/api/therapist/profile/:id', async (req, res) => {
    try {
        const therapist = await db.collection('users')
            .findOne(
                { _id: new ObjectId(req.params.id), role: 'therapist' },
                { projection: { password: 0, email: 0 } }
            );
        
        if (!therapist) {
            return res.status(404).json({ message: 'Терапевтът не е намерен' });
        }

        res.json({ therapist: { ...therapist, id: therapist._id } });
    } catch (error) {
        console.error('Error fetching therapist profile:', error);
        res.status(500).json({ message: 'Грешка при зареждане на профила' });
    }
});

// Update therapist profile
app.put('/api/therapist/profile', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'therapist') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        const { name, specialty, experience, description, phone, education, profileImage } = req.body;
        
        await db.collection('users').updateOne(
            { _id: new ObjectId(req.user.id) },
            { 
                $set: { 
                    name,
                    specialty,
                    experience,
                    description,
                    phone,
                    education,
                    profileImage,
                    updatedAt: new Date()
                }
            }
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
        const user = await db.collection('users')
            .findOne(
                { _id: new ObjectId(req.user.id) },
                { projection: { password: 0 } }
            );
        
        if (!user) {
            return res.status(404).json({ message: 'Потребителят не е намерен' });
        }

        res.json({ user: { ...user, id: user._id } });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Грешка при зареждане на потребителя' });
    }
});

// Get patient's therapists
app.get('/api/patient/therapists', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        // Намираме всички терапевти, които са приели този пациент
        const therapists = await db.collection('users')
            .find(
                { 
                    role: 'therapist',
                    assignedPatients: new ObjectId(req.user.id)
                },
                { projection: { password: 0, email: 0 } }
            )
            .toArray();
        
        const formattedTherapists = therapists.map(therapist => ({
            ...therapist,
            id: therapist._id
        }));
        
        res.json({ therapists: formattedTherapists });
    } catch (error) {
        console.error('Error fetching patient therapists:', error);
        res.status(500).json({ message: 'Грешка при зареждане на терапевтите' });
    }
});

// Get patient's assigned therapist
app.get('/api/patient/therapist', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        const patient = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) });
        
        if (!patient || !patient.assignedTherapist) {
            return res.json({ hasTherapist: false });
        }
        
        const therapist = await db.collection('users')
            .findOne(
                { _id: patient.assignedTherapist },
                { projection: { password: 0 } }
            );
        
        if (therapist) {
            res.json({ 
                hasTherapist: true, 
                therapist: { ...therapist, id: therapist._id } 
            });
        } else {
            res.json({ hasTherapist: false });
        }
    } catch (error) {
        console.error('Error checking therapist:', error);
        res.status(500).json({ message: 'Грешка при проверка на терапевта' });
    }
});

// Accept therapist request
app.post('/api/therapist/accept', authenticateToken, async (req, res) => {
    try {
        const { patientId } = req.body;
        
        if (req.user.role !== 'therapist') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        await db.collection('users').updateOne(
            { _id: new ObjectId(patientId) },
            { 
                $set: { assignedTherapist: new ObjectId(req.user.id) },
                $unset: { requestedTherapist: "", requestDate: "" }
            }
        );
        
        // Добавяме пациента към списъка на терапевта
        await db.collection('users').updateOne(
            { _id: new ObjectId(req.user.id) },
            { $addToSet: { assignedPatients: new ObjectId(patientId) } }
        );
        
        res.json({ message: 'Пациентът е приет успешно' });
    } catch (error) {
        console.error('Error accepting request:', error);
        res.status(500).json({ message: 'Грешка при приемане на заявката' });
    }
});

// Get therapist patients
app.get('/api/therapist/patients', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'therapist') {
            return res.status(403).json({ message: 'Достъп отказан' });
        }
        
        const patients = await db.collection('users')
            .find({ 
                role: 'user', 
                assignedTherapist: new ObjectId(req.user.id) 
            })
            .project({ password: 0 })
            .toArray();
        
        const formattedPatients = patients.map(user => ({
            ...user,
            id: user._id,
            lastMessage: 'Няма съобщения',
            time: 'Нов',
            unread: 0
        }));
        
        res.json({ patients: formattedPatients });
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
        
        const requests = await db.collection('users')
            .find({ 
                role: 'user', 
                requestedTherapist: new ObjectId(req.user.id) 
            })
            .project({ password: 0 })
            .toArray();
        
        const formattedRequests = requests.map(user => ({
            ...user,
            id: user._id
        }));
        
        res.json({ requests: formattedRequests });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Грешка при зареждане на заявките' });
    }
});

// Send therapist request
app.post('/api/therapist/request', authenticateToken, async (req, res) => {
    try {
        const { therapistId } = req.body;
        
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Само пациенти могат да изпращат заявки' });
        }
        
        await db.collection('users').updateOne(
            { _id: new ObjectId(req.user.id) },
            { 
                $set: { 
                    requestedTherapist: new ObjectId(therapistId),
                    requestDate: new Date()
                }
            }
        );
        
        res.json({ message: 'Заявката е изпратена успешно' });
    } catch (error) {
        console.error('Error sending request:', error);
        res.status(500).json({ message: 'Грешка при изпращане на заявката' });
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
        
        const note = {
            title,
            content,
            patientId: new ObjectId(patientId),
            therapistId: new ObjectId(req.user.id),
            date: new Date()
        };
        
        await db.collection('notes').insertOne(note);
        
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
        
        const notes = await db.collection('notes')
            .find({ 
                patientId: new ObjectId(patientId),
                therapistId: new ObjectId(req.user.id)
            })
            .sort({ date: -1 })
            .toArray();
        
        const formattedNotes = notes.map(note => ({
            ...note,
            id: note._id
        }));
        
        res.json({ notes: formattedNotes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Грешка при зареждане на бележките' });
    }
});

// Send message
app.post('/api/chat/send', authenticateToken, async (req, res) => {
    try {
        const { recipientId, text } = req.body;
        
        if (!text || !recipientId) {
            return res.status(400).json({ message: 'Текст и получател са задължителни' });
        }
        
        const message = {
            text,
            senderId: new ObjectId(req.user.id),
            recipientId: new ObjectId(recipientId),
            timestamp: new Date(),
            time: new Date().toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })
        };
        
        await db.collection('messages').insertOne(message);
        
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
        
        const messages = await db.collection('messages')
            .find({
                $or: [
                    { senderId: new ObjectId(req.user.id), recipientId: new ObjectId(recipientId) },
                    { senderId: new ObjectId(recipientId), recipientId: new ObjectId(req.user.id) }
                ]
            })
            .sort({ timestamp: 1 })
            .toArray();
        
        const formattedMessages = messages.map(msg => ({
            id: msg._id,
            text: msg.text,
            senderId: msg.senderId,
            time: msg.time
        }));
        
        res.json({ messages: formattedMessages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Грешка при зареждане на съобщенията' });
    }
});

// Get therapists
app.get('/api/therapists', async (req, res) => {
    try {
        const therapists = await db.collection('users')
            .find({ role: 'therapist' })
            .project({ password: 0 })
            .toArray();
        
        const formattedTherapists = therapists.map(therapist => ({
            ...therapist,
            id: therapist._id,
            avatar: '👩⚕️',
            experience: '5+ години опит',
            rating: (4.5 + Math.random() * 0.4).toFixed(1),
            price: '80 лв/сесия',
            available: Math.random() > 0.3
        }));
        
        res.json({ therapists: formattedTherapists });
    } catch (error) {
        console.error('Error fetching therapists:', error);
        res.status(500).json({ message: 'Грешка при зареждане на терапевтите' });
    }
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Достъп отказан' });
    }

    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json({ users: usersWithoutPasswords });
});

// Serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
});