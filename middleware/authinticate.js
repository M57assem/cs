const jwt = require('jsonwebtoken');
const authenticateUser = (req, res, next) => {
    
    let token = req.headers.authorization || req.body.token;

    // Remove "Bearer " prefix if present
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7); // Remove "Bearer " from token
    }

    if (!token) {
        console.error('Token not provided');
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('Invalid token:', err);
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            console.log('Token decoded:', decoded);
            req.userId = decoded.userId;
            next();
        }
    });
};




module.exports = authenticateUser;
