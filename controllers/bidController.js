const Bid = require("../Models/Bid");
const User = require("../Models/User");
const Wishlist = require("../Models/Wishlist");


exports.createBid = async (req, res) => {
  try {
    const { location, category, title, tags, bidAmount, amountTitle, contactNumber, isWhatsapp } = req.body;

    const bidData = {
      location,
      category,
      title,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      bidAmount,
      isActive: true,
      amountTitle,
      contactNumber,
      isWhatsapp: isWhatsapp === 'true',
      image: req.file ? req.file.path : null
    };

    // If a user is authenticated, include their ID
  
    if (req.user) {
      bidData.user = req.user._id;
    }

    const bid = new Bid(bidData);
    await bid.save();
    res.status(201).json({ message: 'Bid created successfully', bid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.inactivateBid = async (req, res) => {
  try {
    // Check if the user is a superadmin
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmins can inactivate bids' });
    }

    const { bidId } = req.params;

    // Find the bid and update its status
    const bid = await Bid.findByIdAndUpdate(
      bidId,
      { isActive: false },
      { new: true } // This option returns the updated document
    );

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    res.json({ message: 'Bid inactivated successfully', bid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.activateBid = async (req, res) => {
  try {
    // Check if the user is a superadmin
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmins can inactivate bids' });
    }

    const { bidId } = req.params;

    // Find the bid and update its status
    const bid = await Bid.findByIdAndUpdate(
      bidId,
      { isActive: true },
      { new: true } // This option returns the updated document
    );

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    res.json({ message: 'Bid activated successfully', bid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBids = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const userRole = req.user ? req.user.role : null; // Assuming role is stored in the user object
    const { category, page = 1, limit = 10, search } = req.body; // Defaults for page and limit

    // Default values for pagination
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (parseInt(page, 10) - 1) * limitNumber;

    // Ensure category is valid
    if (category && category.trim() === '') {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Fetch the user's wishlist if user is logged in
    let wishlist = null;
    if (userId) {
      wishlist = await Wishlist.findOne({ user: userId });
    }

    // Fetch bids with filtering, pagination, search, and isActive check
    let query = {};
    if (userRole !== 'superadmin') {
      query.isActive = true; // Only active bids for non-superadmin users
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    // Implement search functionality
    if (search) {
      // Add search to query, adjusting fields as necessary (e.g., title, description)
      query.$or = [
        { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        // Add more fields as needed
      ];
    }

    // Fetch bids with the current query
    const bids = await Bid.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Check if there are more bids available
    const totalBids = await Bid.countDocuments(query);
    const hasMore = (skip + limitNumber) < totalBids; // Correct calculation for hasMore
    const pageCount = limitNumber > 0 ? Math.ceil(totalBids / limitNumber) : 0;

    if (bids.length === 0) {
      return res.json({ bids: [], hasMore, pageCount });
    }

    // Populate user data and wishlist status
    const populatedBids = await Promise.all(bids.map(async (bid) => {
      const user = await User.findById(bid.user);
      const isInWishlist = wishlist ? wishlist.bids.includes(bid._id.toString()) : false;
      return {
        ...bid.toObject(),
        user: user ? {
          username: user.username,
          profile: user.profile, // Include profile image in the user object
        } : null,
        wishlist: isInWishlist, // Reflect the current wishlist status
      };
    }));

    res.json({ bids: populatedBids, hasMore, pageCount });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};








exports.getBidById = async (req, res) => {
  try {
    // Find the bid by ID and populate user details
    const bid = await Bid.findById(req.params.id).populate('user', 'username profile');
    
    // If bid is not found, return a 404 response with an empty data array
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found', data: [] });
    }

    // Check if the user is logged in
    console.log(req.user,'::::')
    const userId = req.user ? req.user._id : null;
    let wishlist = null;

    // Fetch the wishlist if the user is logged in
    if (userId) {
      wishlist = await Wishlist.findOne({ user: userId });
    }

    // Check if the bid is in the user's wishlist
    const isInWishlist = wishlist ? wishlist.bids.includes(bid._id.toString()) : false;

    // Send the response with bid details and wishlist status
    res.json({ ...bid.toObject(), isInWishlist });
  } catch (error) {
    // Return a 500 response with the error message if an exception occurs
    res.status(500).json({ error: error.message });
  }
};




// GET BIDS BY USER

exports.getUserBids = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find bids and populate the user field
    const bids = await Bid.find({ user: userId }).populate('user', 'username profile');
    console.log(userId)

    // If no bids are found, return an empty array with a message
    if (bids.length === 0) {
      return res.status(200).json({ bids: [], message: 'No bids found for this user' });
    }

    res.json({ bids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// DELETE USER CREATED BID

exports.deleteBid = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user information in req.user
    const userRole = req.user.role; // Assuming the user's role is stored in req.user.role
    const { bidId } = req.params;

    // Find the bid to be deleted
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Check if the user is a superadmin or the bid creator
    if (userRole !== 'superadmin' && bid?.user?.toString() !== userId?.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this bid' });
    }

    // Delete the bid
    await Bid.findByIdAndDelete(bidId);
    res.json({ message: 'Bid successfully deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// SEARCH BIDS (LOCATION OR TAGS)
exports.searchBids = async (req, res) => {
  try {
    const { searchKey } = req.body;

    let query = {};

    if (searchKey) {
      // Use regex for partial matching on both location and tags
      const regex = new RegExp(searchKey, 'i'); // 'i' makes the search case-insensitive
      query = {
        $or: [
          { location: regex },
          { tags: { $in: [regex] } }
        ]
      };
    }

    const bids = await Bid.find(query).sort({ createdAt: -1 }).populate('user', 'username profile');

    if (bids.length === 0) {
      return res.json([]);
    }

    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// exports.searchBidsByCategory = async (req, res) => {
//   try {
//     const { category, page = 1, limit = 10 } = req.body; // Default to page 1 and limit 10
//     const userId = req?.user?._id;

//     if (!category) {
//       return res.status(400).json({ message: 'Category is required' });
//     }

//     const wishlist = await Wishlist.findOne({ user: userId });

//     // Calculate pagination values
//     const skip = (page - 1) * limit;
//     const limitNumber = parseInt(limit, 10);

//     // Handle the "All" category case
//     let bids;
//     if (category === 'All') {
//       bids = await Bid.find({})
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limitNumber)
//         .populate('user', 'username profile');
//     } else {
//       bids = await Bid.find({ category })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limitNumber)
//         .populate('user', 'username profile');
//     }

//     if (bids.length === 0) {
//       return res.json([]);
//     }

//     // Add wishlist status to each bid
//     const bidsWithWishlistStatus = bids.map(bid => {
//       const isInWishlist = wishlist ? wishlist.bids.includes(bid._id.toString()) : false;
//       return {
//         ...bid.toObject(), // Convert bid document to plain JavaScript object
//         wishlist: isInWishlist, // Add the wishlist status
//       };
//     });

//     res.json(bidsWithWishlistStatus);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


