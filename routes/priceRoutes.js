const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

router.post('/add-price', priceController.addPrice);
router.post('/all-price', priceController.getAllPrice);
router.delete('/deletePrice/:id', priceController.deletePrice);

module.exports = router;