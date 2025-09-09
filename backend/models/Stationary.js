import mongoose from 'mongoose';

const stationarySchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
}, {
    timestamps: true
});

// The model name is "Stationary" (singular, uppercase S)
const Stationary = mongoose.model('Stationary', stationarySchema);

export default Stationary;