import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import orderRoutes from './routes/Orders.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.js';
import snackRoutes from './routes/snacks.js';
import stationaryRoutes from './routes/stationary.js'; // Ensure this is imported

dotenv.config();

if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
    process.exit(1);
}
// --- END CHECK ---

const app = express();
// ... rest of your file

const PORT = process.env.PORT || 5000;

// Middleware

// --- CORS CONFIGURATION ---
// This will fix the "Provisional headers are shown" error by allowing
// your frontend to send requests with the Authorization header.
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only your frontend to access
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these specific headers
};

app.use(cors(corsOptions)); // Use the detailed cors options
// --- END CORS CONFIGURATION ---

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/snacks', snackRoutes);
app.use('/api/stationary', stationaryRoutes); // Ensure this route is used

// Connect to MongoDB and Start Server
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`✅ Backend server is running on http://localhost:${PORT}`)))
  .catch((error) => console.log(`❌ Connection error: ${error.message}`));