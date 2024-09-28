const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const upload = require('../middleware/upload');

router.post('/', optionalAuth,  upload.single('image'), bidController.createBid);
router.post('/allBids', optionalAuth , bidController.getBids);
router.get('/:id', optionalAuth, bidController.getBidById);
router.get('/user/:userId', bidController.getUserBids);
router.delete('/user/:bidId',auth, bidController.deleteBid);
router.post('/search', bidController.searchBids);
router.patch('/:bidId/inactivate', auth, bidController.inactivateBid);
router.patch('/:bidId/activate', auth, bidController.activateBid);
// router.post('/category',optionalAuth, bidController.searchBidsByCategory);

module.exports = router;