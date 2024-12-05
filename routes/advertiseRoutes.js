const express = require('express');
const router = express.Router();
const advertiseController = require('../controllers/advertiseController');
const { isAdmin } = require('../middleware/isAdmin');

router.post('/add-advertise',isAdmin, advertiseController.createAdvertise);
router.post('/all-advertise', advertiseController.getAllAdvertise);
router.delete('/delete-advertise/:id', isAdmin, advertiseController.deleteAdvertise);

module.exports = router;