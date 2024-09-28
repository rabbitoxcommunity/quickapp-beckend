const isAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
  
  module.exports = { isAdmin };