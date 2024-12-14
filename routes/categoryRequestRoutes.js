const express = require('express');
const router = express.Router();
const categoryRequestController = require('../controllers/categoryRequestController');

router.post('/create-category', categoryRequestController.createNewCategory);
router.post('/get-requestedCategory', categoryRequestController.getAllCategory);
router.delete('/delete-requestedCategory/:id', categoryRequestController.deleteCategory);


module.exports = router;