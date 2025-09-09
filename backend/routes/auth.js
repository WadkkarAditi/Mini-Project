import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, password } = req.body;
    
    // Basic input validation
    if (!name || !password || !req.body.email) {
        return res.status(400).json({ message: "Please provide name, email, and password." });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const email = req.body.email.toLowerCase().trim();

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User with this email already exists." });
        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const newUser = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign(
            { email: newUser.email, id: newUser._id, role: newUser.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Standardized response object
        const userProfile = { name: newUser.name, email: newUser.email, role: newUser.role };
        res.status(201).json({ result: userProfile, token });

    } catch (error) {
        console.error('REGISTRATION ERROR:', error); 
        res.status(500).json({ message: "Something went wrong during registration." });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { password } = req.body;

    // Basic input validation
    if (!password || !req.body.email) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    const email = req.body.email.toLowerCase().trim();

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Invalid credentials." }); // More secure message
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." });
        
        const token = jwt.sign(
            { email: user.email, id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        // Standardized response object
        const userProfile = { name: user.name, email: user.email, role: user.role };
        res.status(200).json({ result: userProfile, token });

    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({ message: "Something went wrong during login." });
    }
});

export default router;
