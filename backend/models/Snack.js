import mongoose from 'mongoose';

const snackSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
}, {
    timestamps: true
});

const Snack = mongoose.model('Snack', snackSchema);

export default Snack;