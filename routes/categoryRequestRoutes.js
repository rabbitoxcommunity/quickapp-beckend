const express = require('express');
const router = express.Router();
const categoryRequestController = require('../controllers/categoryRequestController');

router.post('/create-category', categoryRequestController.createNewCategory);

module.exports = router;