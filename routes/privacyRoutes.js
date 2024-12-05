const express = require('express');
const router = express.Router();
const privacyController = require('../controllers/privacyController');
const { isAdmin } = require('../middleware/isAdmin');

router.post('/add-privacy',isAdmin, privacyController.addOrUpdatePrivacy);
router.get('/get-privacy',isAdmin, privacyController.getPrivacy);

module.exports = router;