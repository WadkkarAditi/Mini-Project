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

// Route for Product Orders (Snacks & Stationary)
router.post('/place-product-order', auth, async (req, res) => {
    try {
        const { items, location, contactNo } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ message: "Cart is empty." });

        const amount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const newOrder = new Order({
            user: req.userId,
            orderType: 'products',
            items, location, contactNo, amount,
            status: 'Created',
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: "Server error placing order." });
    }
});

// Route for Printing Orders (Xerox)
router.post('/create', auth, upload.single('document'), async (req, res) => {
    try {
        const { copies, color, sided, pages, location, contactNo } = req.body;
        if (!req.file) return res.status(400).json({ message: "No document uploaded." });

        const costPerPage = color === 'true' ? 10 : 4;
        const amount = parseInt(pages) * parseInt(copies) * costPerPage;

        const newOrder = new Order({
            user: req.userId,
            orderType: 'printing',
            fileName: req.file.originalname,
            filePath: req.file.path,
            contactNo, location,
            settings: { copies, color, sided },
            amount,
            status: 'Created',
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: "Server error creating order." });
    }
});

// Route to Get User's Own Orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders." });
    }
});

export default router;