import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes-optimized.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Admin server running on port ${PORT}`);
});

export default app;