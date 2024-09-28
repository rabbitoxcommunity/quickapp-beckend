const express = require('express');
const router = express.Router();
const termsController = require('../controllers/termsController');

router.post('/add-terms', termsController.addOrUpdateTerms);
router.get('/get-terms', termsController.getTerms);

module.exports = router;