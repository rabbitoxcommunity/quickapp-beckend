const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAdmin } = require('../middleware/isAdmin');

router.post('/add-category', isAdmin, categoryController.addCategory);
router.post('/all-category', categoryController.getAllCategories);
router.delete('/deleteCategory/:id', isAdmin,categoryController.deleteCategory);

module.exports = router;