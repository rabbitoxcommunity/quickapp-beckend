const Advertise = require("../Models/Advertise");
const Bid = require("../Models/Bid");
const Category = require("../Models/Category");
const Feedback = require("../Models/Feedback");
const User = require("../Models/User");

exports.getDashboardCounts = async (req, res) => {
    try {
      const totalBids = await Bid.countDocuments();
      const totalUsers = await User.countDocuments();
      const totalCategories = await Category.countDocuments();
      const totalAdvertisements = await Advertise.countDocuments();
      const totalFeedback = await Feedback.countDocuments();
  
      res.status(200).json({
        totalBids,
        totalUsers,
        totalCategories,
        totalAdvertisements,
        totalFeedback,
      });
    } catch (error) {
      console.error('Error retrieving dashboard counts:', error);
      res.status(500).json({ error: error.message });
    }
  };