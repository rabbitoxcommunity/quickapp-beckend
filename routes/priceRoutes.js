const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');
const { isAdmin } = require('../middleware/isAdmin');

router.post('/add-price', isAdmin, priceController.addPrice);
router.post('/all-price', priceController.getAllPrice);
router.delete('/deletePrice/:id', isAdmin, priceController.deletePrice);

module.exports = router;