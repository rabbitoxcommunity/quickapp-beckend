const express = require('express');
const router = express.Router();
const privacyController = require('../controllers/privacyController');

router.post('/add-privacy', privacyController.addOrUpdatePrivacy);
router.get('/get-privacy', privacyController.getPrivacy);

module.exports = router;