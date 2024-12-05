const express = require('express');
const router = express.Router();
const categoryRequestController = require('../controllers/categoryRequestController');
const { isAdmin } = require('../middleware/isAdmin');

router.post('/create-category', isAdmin, categoryRequestController.createNewCategory);

module.exports = router;