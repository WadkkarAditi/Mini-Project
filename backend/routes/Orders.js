import express from 'express';
import multer from 'multer';
import Order from '../models/order.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// POST /api/orders/place-product-order - For Snacks & Stationary
router.post('/place-product-order', auth, async (req, res) => {
    try {
        const { items, location, contactNo } = req.body;

        // Calculate total amount on the backend for security
        const amount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const newOrder = new Order({
            user: req.userId,
            orderType: 'products',
            items: items,
            location,
            contactNo,
            amount,
            status: 'Paid', // Dummy payment status
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: "Server error while placing product order." });
    }
});

// GET /api/orders/my-orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders." });
    }
});

export default router;