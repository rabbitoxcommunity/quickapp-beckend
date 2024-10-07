const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/isAdmin');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { getDashboardCounts } = require('../controllers/dashboardController');

router.get('/all-counts', auth, isAdmin, roleCheck(['superadmin']), getDashboardCounts);

module.exports = router;