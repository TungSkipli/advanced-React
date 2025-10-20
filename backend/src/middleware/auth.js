const { auth } = require('../config/firebase')

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token provided"
            });
        }
        const token = authHeader.split('Bearer ')[1];

        const decodedToken = await auth.verifyIdToken(token);

        req.user = decodedToken;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ 
            success: false,
            message: "Unauthorized - Invalid token",
            error: error.message 
        });
    }
}

module.exports = {
    authenticateUser,
}
