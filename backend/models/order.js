import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderType: { type: String, enum: ['printing', 'products'], required: true },
    contactNo: { type: String, required: true },
    location: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Created', 'Pending Payment', 'Paid', 'In Progress', 'Delivered'],
        default: 'Created',
    },

    // --- Fields for Product Orders ---
    items: [{
        name: String,
        price: Number,
        quantity: Number,
    }],

    // --- Fields for Printing Orders ---
    fileName: { type: String },
    filePath: { type: String },
    settings: {
        copies: { type: Number },
        color: { type: Boolean },
        sided: { type: String },
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;