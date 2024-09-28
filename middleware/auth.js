const jwt = require('jsonwebtoken');
const User = require('../Models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'Token expired.', code: 'TOKEN_EXPIRED' });
      }
      throw err;
    }

    const user = await User.findOne({ _id: decoded.userId, isActive: true });

    if (!user) {
      return res.status(401).json({ error: 'User not found or inactive.' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Please authenticate.', code: 'AUTHENTICATION_ERROR' });
  }
};
