const express = require('express');
const router = express.Router();
const versionController = require('../controllers/versionController');
const auth = require('../middleware/auth');

router.get('/latest', versionController.getLatestVersion);
router.post('/set', auth,versionController.setVersion);


module.exports = router;