const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.post('/add-category', auth, categoryController.addCategory);
router.post('/all-category', categoryController.getAllCategories);
router.delete('/deleteCategory/:id', auth,categoryController.deleteCategory);

module.exports = router;