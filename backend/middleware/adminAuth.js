import User from '../models/User.js';

const adminAuth = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized. No user ID found." });
    }

    const user = await User.findById(req.userId);

    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
  } catch (error) {
    console.error("AdminAuth error:", error.message);
    res.status(500).json({ message: "Server error during admin verification." });
  }
};

export default adminAuth;
