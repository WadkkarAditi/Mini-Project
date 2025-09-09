import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, password } = req.body;
    const email = req.body.email.toLowerCase().trim();

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User with this email already exists." });
        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create the new user
        const newUser = await User.create({ name, email, password: hashedPassword });

        // --- NEW ---
        // Create a token for the new user immediately
        const token = jwt.sign({ email: newUser.email, id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send back the token and user info, just like in login
        res.status(201).json({ result: { name: newUser.name, role: newUser.role }, token });
    } catch (error) {
        console.error('REGISTRATION ERROR:', error); 
        res.status(500).json({ message: "Server error during registration." });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { password } = req.body;
    const email = req.body.email.toLowerCase().trim();

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found." });
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." });
        
        const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({ result: { name: user.name, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ message: "Server error during login." });
    }
});

export default router;