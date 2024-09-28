
const Wishlist = require('../Models/Wishlist');
const Bid = require('../Models/Bid');

exports.addToWishlist = async (req, res) => {
    try {
      const userId = req.user._id;
      const { bidId } = req.body;
  
      const bid = await Bid.findById(bidId);
      if (!bid) {
        return res.status(404).json({ message: 'Bid not found' });
      }
  
      let wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        wishlist = new Wishlist({ user: userId, bids: [bidId] });
      } else {
        if (!wishlist.bids.includes(bidId)) {
          wishlist.bids.push(bidId);
        }
      }
  
      await wishlist.save();
      res.status(201).json({ message: 'Bid added to wishlist', wishlist });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getWishlist = async (req, res) => {
    try {
      const userId = req.user._id;
      const wishlist = await Wishlist.findOne({ user: userId })
      .populate({
        path: 'bids',
        populate: {
          path: 'user',
          select: 'username profile' // Specify the fields to return for the user
        }
      });
      if (!wishlist || wishlist.length === 0) {
        return res.status(200).json({ bids: [],message:"no wishlists" });
      }
      res.json(wishlist);
      
      
    } catch (error) {
     
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.removeFromWishlist = async (req, res) => {
    try {
      const userId = req.user._id;
      const { bidId } = req.body;
  
      const wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
  
      
      wishlist.bids = wishlist.bids.filter(id => id.toString() !== bidId);
      await wishlist.save();

  
      // Verify by fetching the wishlist again
      const updatedWishlist = await Wishlist.findOne({ user: userId });
  
      res.json({ message: 'Bid removed from wishlist', wishlist: updatedWishlist });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  