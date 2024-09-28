const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');


router.post('/register', upload.single('profile'), authController.register);
router.post('/login', authController.login);
router.post('/superlogin', authController.superLogin);
router.post('/verifyRefresh',auth, authController.verifyRefresh);

module.exports = router;