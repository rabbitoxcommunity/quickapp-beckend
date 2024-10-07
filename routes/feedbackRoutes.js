const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/add-feedback', feedbackController.addFeedback);
router.post('/all-feedback', feedbackController.getAllFeedback);
router.delete('/delete-feedback/:id', feedbackController.deleteFeedback);

module.exports = router;