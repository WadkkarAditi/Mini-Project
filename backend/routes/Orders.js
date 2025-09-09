import express from 'express';
import multer from 'multer';
import Order from '../models/order.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// --- Multer Configuration for File Uploads ---
const storage = multer.diskStorage({
    // Important: Ensure the 'uploads/' directory exists in your backend's root folder
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });


// --- NEW ROUTE for Creating a Print/Document Order ---
// This is the route that was missing.
// It handles POST requests to /api/orders
router.post(
    '/', // The path is just '/' because '/api/orders' is defined in index.js
    auth, // First, authenticate the user
    upload.single('document'), // Then, handle the single file upload. 'document' MUST match the frontend FormData key.
    async (req, res) => {
        try {
            const { location, contactNo, amount, pages, copies, printOptions } = req.body;
            
            // Check if a file was uploaded
            if (!req.file) {
                return res.status(400).json({ message: "No document file uploaded." });
            }

            const newOrder = new Order({
                user: req.userId, // Assumes your auth middleware sets req.userId
                orderType: 'print',
                documentPath: req.file.path, // Save the path to the uploaded file
                location,
                contactNo,
                amount,
                pages,
                copies,
                printOptions,
                status: 'Paid', // Dummy payment status
            });

            await newOrder.save();
            res.status(201).json(newOrder);

        } catch (error) {
            console.error('Error creating print order:', error); // Log the actual error on the server
            res.status(500).json({ message: "Server error while placing print order." });
        }
    }
);


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
