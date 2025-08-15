import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User with this email already exists." });
        
        const hashedPassword = await bcrypt.hash(password, 12);
        // The 'role' will be 'user' by default, as defined in the User model
        await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully. Please login." });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration." });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found." });
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." });
        
        // The token now includes the user's role
        const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // --- THIS IS THE CORRECTED LINE ---
        // We now send the user's role back to the frontend
        res.status(200).json({ result: { name: user.name, role: user.role }, token });
        
    } catch (error) {
        res.status(500).json({ message: "Server error during login." });
    }
});

export default router;