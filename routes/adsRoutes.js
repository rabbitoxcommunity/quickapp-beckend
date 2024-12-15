const express = require('express');
const router = express.Router();
const adBannerController = require('../controllers/adBannerController');
const { isAdmin } = require('../middleware/isAdmin');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/create', auth, roleCheck(['superadmin']), upload.single('image'), adBannerController.createBanner);
router.get('/all', adBannerController.getAllBanners);
router.delete('/:id', auth, roleCheck(['superadmin']), adBannerController.deleteBanner);

module.exports = router;