import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import User from '../models/User.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists." });
        
        const hashedPassword = await bcrypt.hash(password, 12);
        await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
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
        
        const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ result: { name: user.name, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// POST /api/auth/google-login
router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString('hex');
            user = await User.create({ name, email, password: randomPassword });
        }

        const appToken = jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ result: { name: user.name, role: user.role }, token: appToken });

    } catch (error) {
        console.error("GOOGLE LOGIN ERROR:", error);
        res.status(500).json({ message: "Google Sign-In failed. Try again later." });
    }
});

export default router;