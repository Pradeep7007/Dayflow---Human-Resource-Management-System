const express = require('express');
const router = express.Router();
const {
  getHelpCenterContent,
  createSupportRequest,
  getSupportRequests,
} = require('../controllers/helpCenterController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getHelpCenterContent);
router.post('/request', protect, createSupportRequest);
router.get('/requests', protect, authorize('admin', 'hr'), getSupportRequests);

module.exports = router;
