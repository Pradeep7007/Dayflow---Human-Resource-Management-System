const express = require('express');
const router = express.Router();
const { getAdminDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/admin', protect, authorize('admin', 'hr'), getAdminDashboardStats);

module.exports = router;
