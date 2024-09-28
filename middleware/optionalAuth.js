
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        // Retrieve user by userId
        const user = await User.findById(decoded.userId).select('-password');
  
        // Attach user to request object
        req.user = user;
      } catch (error) {
        console.error('Failed to authenticate token:', error.message);
      }
    } else {
      console.log('No auth header or not a Bearer token');
    }
    next();
  };
  
  module.exports = optionalAuth;