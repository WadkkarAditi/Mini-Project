import express from 'express';
import Snack from '../models/Snack.js';

const router = express.Router();

// GET /api/snacks - Fetches all snacks from the database
router.get('/', async (req, res) => {
    try {
        const snacks = await Snack.find({});
        res.status(200).json(snacks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch snacks." });
    }
});

export default router;