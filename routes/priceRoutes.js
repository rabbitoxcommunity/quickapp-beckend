const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');
const { isAdmin } = require('../middleware/isAdmin');
const auth = require('../middleware/auth');

router.post('/add-price', auth, priceController.addPrice);
router.post('/all-price', priceController.getAllPrice);
router.delete('/deletePrice/:id', auth, priceController.deletePrice);

module.exports = router;