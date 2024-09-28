const express = require('express');
const router = express.Router();
const advertiseController = require('../controllers/advertiseController');

router.post('/add-advertise', advertiseController.createAdvertise);
router.get('/all-advertise', advertiseController.getAllAdvertise);
router.delete('/delete-advertise/:id', advertiseController.deleteAdvertise);

module.exports = router;