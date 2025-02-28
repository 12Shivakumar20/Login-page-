const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.cookies.auth_token;  // Get the token from cookies

    if (!token) {
        return res.redirect('/login');
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            console.log('Invalid token', error);
            return res.redirect('/login');
        }
        req.user = decoded;
        next(); 
    });
};

module.exports = verifyToken;
