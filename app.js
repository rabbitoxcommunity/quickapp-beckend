require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bidRoutes = require('./routes/bidRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const priceRoutes = require('./routes/priceRoutes');
const adsRoutes = require('./routes/adsRoutes');
const termsRoutes = require('./routes/termsRoutes');
const privacyRoutes = require('./routes/privacyRoutes');
const advertiseRoutes = require('./routes/advertiseRoutes');
const categoryRequestRoutes = require('./routes/categoryRequestRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

connectDB();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);

// Dashboard
app.use('/api/dashboard', dashboardRoutes);

// USER ROUTES
app.use('/api/users', userRoutes);

// BID ROUTES
app.use('/api/bids', bidRoutes);

// WISHLISTS ROUTES
app.use('/api/wishlist', wishlistRoutes);

// ADS ROUTES
app.use('/api/adBanners', adsRoutes);

// CATEGORY
app.use('/api/categories', categoryRoutes);

// PRICE FOR
app.use('/api/price-for', priceRoutes);

// TERMS AND CONDITIONS
app.use('/api/terms', termsRoutes);

// Privacy Policy
app.use('/api/privacy', privacyRoutes);

// ADVERTISE REQUEST
app.use('/api/advertise', advertiseRoutes);

// ADVERTISE REQUEST
app.use('/api/request', categoryRequestRoutes);

// FEEDBACK
app.use('/api/feedback', feedbackRoutes);

// NOTIFICATIONS
app.use('/api/notification', notificationRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));