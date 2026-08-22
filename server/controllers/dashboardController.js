const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');

// @desc    Get Admin / HR Command Center Dashboard Stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin & HR)
const getAdminDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1. TOP SUMMARY METRICS
    const totalEmployees = await User.countDocuments({ status: { $ne: 'terminated' } });
    
    const todayAttendance = await Attendance.find({
      date: { $gte: todayStart, $lte: todayEnd },
    });

    const presentToday = todayAttendance.filter((a) => a.status === 'Present' || a.status === 'Half-day').length;
    const onLeaveToday = todayAttendance.filter((a) => a.status === 'Leave').length;

    const pendingLeaveApprovals = await Leave.countDocuments({ status: 'Pending' });

    // 2. ATTENTION REQUIRED ITEMS
    const pendingLeaveList = await Leave.find({ status: 'Pending' })
      .sort({ createdAt: -1 })
      .limit(5);

    const missingCheckouts = todayAttendance.filter((a) => a.checkIn && !a.checkOut);
    const halfDays = todayAttendance.filter((a) => a.status === 'Half-day');

    const anomalies = [
      ...missingCheckouts.map((a) => ({
        id: a._id,
        type: 'Missing Check-Out',
        employeeName: a.employeeName,
        detail: `Checked in at ${a.checkIn} but no check-out recorded yet.`,
        severity: 'high',
      })),
      ...halfDays.map((a) => ({
        id: a._id,
        type: 'Half-Day Logged',
        employeeName: a.employeeName,
        detail: `Late arrival at ${a.checkIn}. Total hours: ${a.workingHours} hrs.`,
        severity: 'medium',
      })),
    ];

    // 3. WORKFORCE OVERVIEW & DISTRIBUTIONS
    const deptAgg = await User.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]);

    const departmentDistribution = deptAgg.map((d) => ({
      department: d._id || 'Engineering & General',
      count: d.count,
    }));

    const leaveTypeAgg = await Leave.aggregate([
      { $group: { _id: '$leaveType', count: { $sum: 1 } } },
    ]);

    const leaveTrend = {
      Paid: (leaveTypeAgg.find((l) => l._id === 'Paid') || {}).count || 0,
      Sick: (leaveTypeAgg.find((l) => l._id === 'Sick') || {}).count || 0,
      Unpaid: (leaveTypeAgg.find((l) => l._id === 'Unpaid') || {}).count || 0,
    };

    // Attendance Trend for the last 7 days
    const attendanceTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const dEnd = new Date(d);
      dEnd.setHours(23, 59, 59, 999);

      const count = await Attendance.countDocuments({
        date: { $gte: d, $lte: dEnd },
        status: { $in: ['Present', 'Half-day'] },
      });

      attendanceTrend.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.toLocaleDateString(),
        presentCount: count,
      });
    }

    // 4. RECENT ACTIVITY STREAM
    const recentLeaves = await Leave.find()
      .sort({ updatedAt: -1 })
      .limit(3);

    const recentEmployees = await User.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select('name role department createdAt');

    const activityFeed = [
      ...recentEmployees.map((e) => ({
        id: `emp-${e._id}`,
        type: 'New Employee',
        title: `New account onboarded: ${e.name}`,
        subtitle: `${e.department || 'Staff'} • ${e.role.toUpperCase()}`,
        time: new Date(e.createdAt).toLocaleDateString(),
        icon: 'user-plus',
      })),
      ...recentLeaves.map((l) => ({
        id: `leave-${l._id}`,
        type: 'Leave Action',
        title: `Leave ${l.status}: ${l.employeeName}`,
        subtitle: `${l.leaveType} Leave (${l.daysCount} days)`,
        time: new Date(l.updatedAt || l.createdAt).toLocaleDateString(),
        icon: l.status === 'Approved' ? 'check' : l.status === 'Rejected' ? 'x' : 'clock',
      })),
    ].slice(0, 5);

    res.json({
      success: true,
      summary: {
        totalEmployees,
        presentToday,
        onLeaveToday,
        pendingLeaveApprovals,
      },
      attention: {
        pendingLeaves: pendingLeaveList,
        anomalies,
        expiringDocumentsCount: 2,
      },
      overview: {
        departmentDistribution,
        leaveTrend,
        attendanceTrend,
        activeRate: Math.round((presentToday / (totalEmployees || 1)) * 100),
      },
      recentActivity: activityFeed,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};

module.exports = {
  getAdminDashboardStats,
};
