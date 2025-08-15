import express from 'express';
import Order from '../models/order.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// GET /api/admin/orders - Fetch ALL orders
// This route is protected by two middlewares: first auth, then adminAuth
router.get('/orders', [auth, adminAuth], async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email') // Get user's name and email
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders." });
    }
});

// PUT /api/admin/orders/:orderId/status - Update an order's status
router.put('/orders/:orderId/status', [auth, adminAuth], async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (order) {
            order.status = status;
            await order.save();
            res.status(200).json({ message: "Order status updated successfully." });
        } else {
            res.status(404).json({ message: "Order not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update order status." });
    }
});

export default router;