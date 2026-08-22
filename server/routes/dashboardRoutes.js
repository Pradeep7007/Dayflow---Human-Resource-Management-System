const express = require('express');
const router = express.Router();
const { getAdminDashboardStats, getSmartInsights, getWorkforceHealthAlerts } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/admin', protect, authorize('admin', 'hr'), getAdminDashboardStats);
router.get('/insights', protect, authorize('admin', 'hr'), getSmartInsights);
router.get('/alerts', protect, authorize('admin', 'hr'), getWorkforceHealthAlerts);

module.exports = router;
