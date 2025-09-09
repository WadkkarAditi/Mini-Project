import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// It's good practice to call config() in any file that uses process.env
// especially if it might be used in different contexts.
dotenv.config();

const auth = async (req, res, next) => {
    try {
        // 1. Check if the Authorization header even exists.
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // This is a more specific error than a generic "Token is not valid"
            return res.status(401).json({ message: "No token provided or header is malformed." });
        }

        // 2. Extract the token
        const token = authHeader.split(" ")[1];
        
        // 3. Verify the token
        // THIS IS THE LINE THAT IS FAILING.
        // The cause is almost certainly an incorrect JWT_SECRET.
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach user ID to the request
        // Ensure the payload you created has an 'id' property.
        req.userId = decodedData?.id;

        // 5. Proceed to the next step (the order creation logic)
        next();

    } catch (error) {
        // This catch block will trigger if jwt.verify fails due to:
        // - An incorrect secret key
        // - An expired token
        // - A malformed token
        console.error("Authentication Error:", error.message); // Log the specific error on the server
        res.status(401).json({ message: "Token is not valid. Please log in again." });
    }
};

export default auth;
