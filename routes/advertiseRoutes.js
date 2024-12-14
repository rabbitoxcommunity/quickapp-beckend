const express = require('express');
const router = express.Router();
const advertiseController = require('../controllers/advertiseController');
const { isAdmin } = require('../middleware/isAdmin');
const auth = require('../middleware/auth');

router.post('/add-advertise', advertiseController.createAdvertise);
router.post('/all-advertise', advertiseController.getAllAdvertise);
router.delete('/delete-advertise/:id', auth, advertiseController.deleteAdvertise);

module.exports = router;