const express = require('express');
const router = express.Router();
const {
  createLeaveRequest,
  getMyLeaveRequests,
  cancelLeaveRequest,
  getAllLeaveRequests,
  reviewLeaveRequest,
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// Employee Endpoints
router.post('/request', createLeaveRequest);
router.get('/my-requests', getMyLeaveRequests);
router.delete('/cancel/:id', cancelLeaveRequest);

// Admin / HR Approval Workspace Endpoints
router.get('/all', authorize('admin', 'hr'), getAllLeaveRequests);
router.put('/review/:id', authorize('admin', 'hr'), reviewLeaveRequest);

module.exports = router;
