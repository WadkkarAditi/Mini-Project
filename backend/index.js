import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/Orders.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Connect to MongoDB and Start Server
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`✅ Backend server is running on http://localhost:${PORT}`)))
  .catch((error) => console.log(`❌ Connection error: ${error.message}`));