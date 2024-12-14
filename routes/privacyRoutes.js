const express = require('express');
const router = express.Router();
const privacyController = require('../controllers/privacyController');
const auth = require('../middleware/auth');

router.post('/add-privacy',auth, privacyController.addOrUpdatePrivacy);
router.get('/get-privacy', privacyController.getPrivacy);

module.exports = router;