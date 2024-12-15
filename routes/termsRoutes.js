const express = require('express');
const router = express.Router();
const termsController = require('../controllers/termsController');
const auth = require('../middleware/auth');

router.post('/add-terms',auth, termsController.addOrUpdateTerms);
router.get('/get-terms', termsController.getTerms);

module.exports = router;