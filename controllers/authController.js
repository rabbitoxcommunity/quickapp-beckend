
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const multer = require('multer');
const upload = multer({ dest: 'profile/' });

exports.register = async (req, res) => {
  try {
    const { username, email, password, location } = req.body;

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


exports.verifyRefresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

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
    const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive' });
    }
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    
    if (user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Only superadmins can log in.' });
    }
    
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '6h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    res.json({ accessToken, refreshToken, user: userWithoutPassword });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};