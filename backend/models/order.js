import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderType: {
        type: String,
        required: true,
        // THIS IS THE FIX: 'print' is now an allowed value.
        enum: ['products', 'print'] 
    },
    // Fields for Product Orders
    items: [{
        name: String,
        price: Number,
        quantity: Number
    }],
    // Fields for Print Orders
    documentPath: {
        type: String 
    },
    pages: {
        type: Number
    },
    copies: {
        type: Number
    },
    printOptions: {
        type: String
    },
    // Common Fields
    location: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

