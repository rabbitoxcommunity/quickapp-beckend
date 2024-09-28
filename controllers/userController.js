const User = require("../Models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
      // Assuming you have the user's ID from authentication
      const userId = req.user.id; // This depends on your authentication setup

      // Find the user by ID
      const user = await User.findById(userId).select('-password');

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Return user details
      res.status(200).json(user);
  } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};