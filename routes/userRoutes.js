const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/', auth, roleCheck(['superadmin']), userController.getUsers);
router.get('/user', auth, userController.getUserDetails);
router.patch('/:id/toggle-status', auth, roleCheck(['superadmin']), userController.toggleUserStatus);

module.exports = router;