const User = require("../Models/User");

exports.getUsers = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.body;

  try {
    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Define search criteria (you can search by username, email, or any other fields)
    const searchCriteria = search
      ? {
          $or: [
            { username: { $regex: search, $options: 'i' } }, // case-insensitive search for username
            { email: { $regex: search, $options: 'i' } }     // case-insensitive search for email
          ]
        }
      : {};

    // Fetch users with search criteria and pagination
    const users = await User.find(searchCriteria, '-password')
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Get the total number of users that match the search criteria
    const totalUsers = await User.countDocuments(searchCriteria);

    // Send users along with pagination and search info
    res.json({
      users,
      totalPages: Math.ceil(totalUsers / limitNumber),
      currentPage: pageNumber,
      search,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
} catch (error) {
    console.error('Error deleting User:', error);
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