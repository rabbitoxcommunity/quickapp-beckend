const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');
const roleCheck = require('../middleware/roleCheck');

router.get('/', notificationController.getCurrentNotification);
router.post('/dismiss', auth, notificationController.dismissNotification);
router.get('/allNotification', auth, notificationController.getAllNotifications);
router.post('/createNotification', auth, upload.single('image'), notificationController.addNotification);
router.put('/:id/status', auth, notificationController.updateNotificationStatus);
router.delete('/deleteNotification/:id', auth, notificationController.deleteNotification);


module.exports = router;