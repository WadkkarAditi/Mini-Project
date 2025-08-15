import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/order.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/payment/create-order
router.post('/create-order', auth, async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const options = {
            amount: order.amount * 100, // Amount in paisa
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex'),
        };

        const razorpayOrder = await razorpay.orders.create(options);
        
        order.razorpayOrderId = razorpayOrder.id;
        order.status = 'Pending Payment';
        await order.save();
        
        res.json(razorpayOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating Razorpay order' });
    }
});

// POST /api/payment/verify
router.post('/verify', auth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
            order.paymentId = razorpay_payment_id;
            order.status = 'Paid';
            await order.save();
            return res.status(200).json({ message: 'Payment verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;