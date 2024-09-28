const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/add-category', categoryController.addCategory);
router.get('/all-category', categoryController.getAllCategories);
router.delete('/deleteCategory/:id', categoryController.deleteCategory);

module.exports = router;