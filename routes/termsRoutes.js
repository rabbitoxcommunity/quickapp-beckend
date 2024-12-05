const express = require('express');
const router = express.Router();
const termsController = require('../controllers/termsController');
const { isAdmin } = require('../middleware/isAdmin');

router.post('/add-terms',isAdmin, termsController.addOrUpdateTerms);
router.get('/get-terms', isAdmin, termsController.getTerms);

module.exports = router;