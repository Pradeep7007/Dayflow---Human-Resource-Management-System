const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Helper to get normalized start of today (UTC midnight)
const getTodayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// Check In
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const today = getTodayDate();
    let record = await Attendance.findOne({ user: userId, date: today });

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (record && record.checkIn) {
      return res.status(400).json({
        success: false,
        message: `Already checked in today at ${record.checkIn}.`,
        attendance: record,
      });
    }

    // Determine status (Late if after 9:30 AM)
    let status = 'Present';
    if (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30)) {
      status = 'Half-day';
    }

    if (!record) {
      record = new Attendance({
        user: userId,
        employeeId: user.employeeId,
        employeeName: user.name,
        department: user.department || 'Engineering',
        date: today,
        checkIn: timeString,
        status: status,
      });
    } else {
      record.checkIn = timeString;
      record.status = status;
    }

    await record.save();

    res.status(200).json({
      success: true,
      message: `Checked in successfully at ${timeString}!`,
      attendance: record,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Check-in failed.' });
  }
};

// Check Out
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getTodayDate();

    const record = await Attendance.findOne({ user: userId, date: today });
    if (!record || !record.checkIn) {
      return res.status(400).json({ success: false, message: 'You have not checked in today yet.' });
    }

    if (record.checkOut) {
      return res.status(400).json({
        success: false,
        message: `Already checked out today at ${record.checkOut}.`,
        attendance: record,
      });
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Calculate working hours (assume 8.5 default or derived)
    const hours = 8.5;

    record.checkOut = timeString;
    record.workingHours = hours;
    await record.save();

    res.status(200).json({
      success: true,
      message: `Checked out successfully at ${timeString}. Total hours: ${hours} hrs.`,
      attendance: record,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Check-out failed.' });
  }
};

// Get Today's Status for Logged-In User
exports.getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getTodayDate();
    const record = await Attendance.findOne({ user: userId, date: today });

    res.status(200).json({
      success: true,
      attendance: record || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve today status.' });
  }
};

// Get Personal Attendance History (Employee View)
exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    let query = { user: userId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await Attendance.find(query).sort({ date: -1 });

    // Calculate summary statistics
    const totalDays = records.length;
    const presentCount = records.filter((r) => r.status === 'Present').length;
    const halfDayCount = records.filter((r) => r.status === 'Half-day').length;
    const absentCount = records.filter((r) => r.status === 'Absent').length;
    const leaveCount = records.filter((r) => r.status === 'Leave').length;
    const totalHours = records.reduce((acc, curr) => acc + (curr.workingHours || 0), 0);

    res.status(200).json({
      success: true,
      records,
      stats: {
        totalDays,
        presentCount,
        halfDayCount,
        absentCount,
        leaveCount,
        totalHours: Math.round(totalHours * 10) / 10,
        averageHours: totalDays > 0 ? (totalHours / totalDays).toFixed(1) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve attendance logs.' });
  }
};

// Get All Attendance Records (Admin / HR View)
exports.getAllAttendance = async (req, res) => {
  try {
    const { employeeId, status, date, startDate, endDate } = req.query;

    let query = {};

    if (employeeId && employeeId !== 'ALL') {
      query.employeeId = employeeId;
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.date = { $gte: targetDate, $lt: nextDate };
    } else if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const records = await Attendance.find(query).sort({ date: -1, employeeName: 1 });

    // Summary Analytics Metrics
    const totalRecords = records.length;
    const present = records.filter((r) => r.status === 'Present').length;
    const halfDay = records.filter((r) => r.status === 'Half-day').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const leave = records.filter((r) => r.status === 'Leave').length;

    res.status(200).json({
      success: true,
      records,
      analytics: {
        totalRecords,
        present,
        halfDay,
        absent,
        leave,
        attendanceRate: totalRecords > 0 ? Math.round(((present + halfDay) / totalRecords) * 100) : 100,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch workforce attendance.' });
  }
};

// Manual Attendance Entry / Update (Admin / HR)
exports.updateAttendanceRecord = async (req, res) => {
  try {
    const { userId, date, status, checkIn, checkOut, remarks } = req.body;

    if (!userId || !date || !status) {
      return res.status(400).json({ success: false, message: 'User ID, Date, and Status are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Target employee not found.' });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    let record = await Attendance.findOne({ user: userId, date: targetDate });

    if (!record) {
      record = new Attendance({
        user: userId,
        employeeId: user.employeeId,
        employeeName: user.name,
        department: user.department || 'Engineering',
        date: targetDate,
      });
    }

    record.status = status;
    if (checkIn !== undefined) record.checkIn = checkIn;
    if (checkOut !== undefined) record.checkOut = checkOut;
    if (remarks !== undefined) record.remarks = remarks;
    if (status === 'Present') record.workingHours = 8.5;
    else if (status === 'Half-day') record.workingHours = 4.0;
    else record.workingHours = 0;

    await record.save();

    res.status(200).json({
      success: true,
      message: 'Attendance record updated successfully.',
      attendance: record,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update attendance record.' });
  }
};
