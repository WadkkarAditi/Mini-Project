import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    contactNo: { type: String, required: true },
    location: { type: String, required: true },
    settings: {
        copies: { type: Number, default: 1 },
        color: { type: Boolean, default: false },
        sided: { type: String, enum: ['single', 'double'], default: 'single' },
    },
    amount: { type: Number, required: true },
    razorpayOrderId: { type: String },
    paymentId: { type: String },
    status: {
        type: String,
        enum: ['Created', 'Pending Payment', 'Paid', 'In Progress', 'Delivered'],
        default: 'Created',
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;