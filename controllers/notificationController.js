const Notification = require("../Models/Notification");
const UserNotificationDismissal = require("../Models/UserNotificationDismissal");

const notificationController = {
    getCurrentNotification: async (req, res) => {
      try {
        const notification = await Notification.findOne({ notify: true }).sort({ createdAt: -1 });
        
        if (!notification) {
          return res.json(null);
        }
  
        if (req.user) {
          const dismissal = await UserNotificationDismissal.findOne({
            userId: req.user._id,
            notificationId: notification._id
          });
  
          if (dismissal) {
            return res.json(null);
          }
        }
  
        res.json(notification);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    },
  
    dismissNotification: async (req, res) => {
      try {
        const { notificationId } = req.body;
        
        if (!req.user) {
          return res.status(401).json({ error: 'User not authenticated' });
        }
  
        const dismissal = new UserNotificationDismissal({
          userId: req.user._id,
          notificationId
        });
  
        await dismissal.save();
        res.json({ message: 'Notification dismissed successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    },
  
    addNotification: async (req, res) => {
      try {
        await Notification.updateMany({}, { notify: false });
        const newNotification = new Notification({
          message: req.body.message,
          imageUrl: req.file ? req.file.path : null,
          notify: true
        });
        await newNotification.save();
        res.json(newNotification);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    },
  
    updateNotificationStatus: async (req, res) => {
      try {
        const { id, notify } = req.body;
        console.log(id, notify,"::::::")
        const notification = await Notification.findById(id);
        if (!notification) {
          return res.status(404).json({ error: 'Notification not found' });
        }
        if (notify) {
          await Notification.updateMany({}, { notify: false });
        }
        notification.notify = notify;
        await notification.save();
        res.json(notification);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    },
  
    deleteNotification: async (req, res) => {
      try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id);
        res.json({ message: 'Notification deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    },
  
    getAllNotifications: async (req, res) => {
      try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    }
  };
  
  module.exports = notificationController;