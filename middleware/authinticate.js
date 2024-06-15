const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization || req.body.token;

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
