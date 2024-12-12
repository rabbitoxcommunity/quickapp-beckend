const isAdmin = (req, res, next) => {
  // Check if req.user exists
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: No user found' });
  }

  // Check if user has the required role
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }

  next();
};

module.exports = { isAdmin };