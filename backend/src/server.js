import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/database.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

import { authMiddleware } from './middleware/authMiddleware.js';

import emotionRoutes from './routes/emotionRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import therapistRoutes from './routes/therapistRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import journalRoutes from "./routes/journalRoutes.js";
app.use("/api/journal", journalRoutes);


dotenv.config();

const app = express();

// ==================== SECURITY ====================
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization", "x-anonymous-id"],
  credentials: true,
}));

// Rate limit
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Твърде много заявки.'
}));

// ==================== MIDDLEWARE ====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

// GLOBAL AUTH
app.use(authMiddleware);

// ==================== ROUTES ====================
app.use('/api/emotions', emotionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/journal', journalRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ERROR HANDLER
app.use(errorHandler);

// ==================== SERVER ====================
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();

export default app;
