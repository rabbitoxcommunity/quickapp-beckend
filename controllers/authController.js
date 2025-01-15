
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const multer = require('multer');
const upload = multer({ dest: 'profile/' });

exports.register = async (req, res) => {
  try {
    const { username, email, password, location } = req.body;

    console.log('Request body FILE:', req.file);

    // Check if required fields are present
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const role = email.endsWith('@superadmin.com') ? 'superadmin' : 'user';

    const user = new User({
      username,
      email,
      password,
      location,
      profile: req.file ? req.file.path : null,
      role
    });

    await user.save();

    // Remove password from the response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Registration failed. Please try again.' });
  }
};


exports.editProfile = async (req, res) => {
  try {
    const { userId, username,location } = req.body; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update username if provided
    if (username) {
      user.username = username;
    }
    if (location) {
      user.location = location;
    }

    

    if (req.file) {
      user.profile = req.file ? req.file.path : null;
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: 'Profile updated successfully', user: userResponse });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({ error: 'Profile update failed. Please try again.' });
  }
};


exports.verifyRefresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    console.log(refreshToken)

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Check if the user exists and is active
    const user = await User.findOne({ _id: decoded.userId, isActive: true });
    if (!user) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    // Generate new access token
    const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7h' });

    res.json({ 
      accessToken: newAccessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        // Include other non-sensitive user details as needed
      }
    });

  } catch (error) {
    console.error('Error in verifyRefresh:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    
    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({ accessToken, refreshToken, user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.superLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive' });
    }
    
    // Check if the AUTHORIZED_SUPERADMINS environment variable is set
    const authorizedSuperadmins = process.env.AUTHORIZED_SUPERADMINS;
    if (!authorizedSuperadmins) {
      console.error('AUTHORIZED_SUPERADMINS environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Check if the user is in the list of authorized superadmins
    const authorizedEmails = authorizedSuperadmins.split(',').map(email => email.trim());
    if (!authorizedEmails.includes(user.email)) {
      return res.status(403).json({ message: 'Access denied. You are not authorized as a superadmin.' });
    }
    
    if (user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmins can log in.' });
    }
    
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    res.json({ accessToken, refreshToken, user: userWithoutPassword });
  } catch (error) {
    console.error('Error in superLogin:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    // Extract user ID from request
    const userId = req.user.id;

    console.log(`Deleting account for user ID: ${userId}`);

    // Attempt to find and delete the user
    const user = await User.findByIdAndDelete(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Optional: Handle logout or token invalidation
    // Example for JWT: Add user ID to a token blacklist if implemented

    // Send success response
    res.status(200).json({
      message: 'Account deleted successfully',
      deletedUser: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Error during account deletion:', error);

    // Send failure response with error details
    res.status(500).json({
      error: 'Failed to delete account',
      details: error.message,
    });
  }
};