const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine folder based on route or some condition
    let folder = 'uploads/'; // Default folder

    // Example: Check if the request is for notifications
    if (req.originalUrl.includes('/notification')) {
      folder = 'uploads/notifications/';
    } else if (req.originalUrl.includes('/user')) {
      folder = 'uploads/user/';
    }

    // Ensure the folder exists, create it if it doesn't
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
    // Save only the filename to the database
    req.body.image = filename;
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.HEIC' && ext !== '.HEIF') {
      return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 50 * 1024 * 1024 
  }
});

module.exports = upload;
