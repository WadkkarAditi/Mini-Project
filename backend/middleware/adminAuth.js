import User from '../models/User.js';

const adminAuth = async (req, res, next) => {
    try {
        // req.userId is added by the regular auth middleware
        const user = await User.findById(req.userId);

        if (user && user.role === 'admin') {
            next(); // User is an admin, proceed to the next function
        } else {
            res.status(403).json({ message: "Access denied. Admin privileges required." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error during admin verification." });
    }
};

export default adminAuth;