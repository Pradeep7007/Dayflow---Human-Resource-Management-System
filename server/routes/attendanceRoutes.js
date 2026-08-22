const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getTodayStatus,
  getMyAttendance,
  getAllAttendance,
  updateAttendanceRecord,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// Employee Endpoints
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/today', getTodayStatus);
router.get('/my-records', getMyAttendance);

// Admin / HR Endpoints
router.get('/all', authorize('admin', 'hr'), getAllAttendance);
router.post('/update', authorize('admin', 'hr'), updateAttendanceRecord);

module.exports = router;
