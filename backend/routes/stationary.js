import express from 'express';
import Stationary from '../models/Stationary.js';

const router = express.Router();

// GET /api/stationary - Fetches all stationary items
router.get('/', async (req, res) => {
    try {
        // Mongoose will automatically look in the 'stationaries' collection
        const items = await Stationary.find({});
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch stationary items." });
    }
});

export default router;