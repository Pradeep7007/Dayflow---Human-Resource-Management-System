const Leave = require('../models/Leave');
const User = require('../models/User');

// Helper to calculate business days between two dates
const calculateDays = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = Math.abs(e - s);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 1;
};

// SUBMIT Leave Request (Employee)
exports.createLeaveRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: 'All leave fields are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({ success: false, message: 'End date cannot be prior to start date.' });
    }

    const daysCount = calculateDays(startDate, endDate);

    const newLeave = await Leave.create({
      user: userId,
      employeeId: user.employeeId,
      employeeName: user.name,
      department: user.department || 'Engineering',
      leaveType,
      startDate: start,
      endDate: end,
      daysCount,
      reason,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully for approval.',
      leave: newLeave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to submit leave request.' });
  }
};

// GET My Leave Requests (Employee)
exports.getMyLeaveRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await Leave.find({ user: userId }).sort({ createdAt: -1 });

    // Calculate balances
    const approvedPaid = requests
      .filter((r) => r.status === 'Approved' && r.leaveType === 'Paid')
      .reduce((acc, curr) => acc + curr.daysCount, 0);

    const approvedSick = requests
      .filter((r) => r.status === 'Approved' && r.leaveType === 'Sick')
      .reduce((acc, curr) => acc + curr.daysCount, 0);

    const balances = {
      paidAvailable: Math.max(0, 18 - approvedPaid),
      paidTotal: 18,
      sickAvailable: Math.max(0, 10 - approvedSick),
      sickTotal: 10,
      unpaidTaken: requests
        .filter((r) => r.status === 'Approved' && r.leaveType === 'Unpaid')
        .reduce((acc, curr) => acc + curr.daysCount, 0),
    };

    res.status(200).json({
      success: true,
      requests,
      balances,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve leave history.' });
  }
};

// CANCEL Pending Leave Request (Employee)
exports.cancelLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    if (leave.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized action.' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Only Pending leave requests can be cancelled.' });
    }

    await Leave.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Leave request cancelled successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel leave request.' });
  }
};

// GET All Leave Requests (Admin / HR Workspace)
exports.getAllLeaveRequests = async (req, res) => {
  try {
    const { status, leaveType, search } = req.query;
    let query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (leaveType && leaveType !== 'ALL') {
      query.leaveType = leaveType;
    }

    let requests = await Leave.find(query).sort({ createdAt: -1 });

    if (search) {
      const term = search.toLowerCase();
      requests = requests.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(term) ||
          r.employeeId.toLowerCase().includes(term) ||
          r.department.toLowerCase().includes(term)
      );
    }

    const counts = {
      pending: await Leave.countDocuments({ status: 'Pending' }),
      approved: await Leave.countDocuments({ status: 'Approved' }),
      rejected: await Leave.countDocuments({ status: 'Rejected' }),
    };

    res.status(200).json({
      success: true,
      requests,
      counts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch leave approval workspace.' });
  }
};

// REVIEW Leave Request (Admin / HR Approve or Reject)
exports.reviewLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminComment } = req.body; // action: 'Approved' | 'Rejected'

    if (!['Approved', 'Rejected'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action. Must be Approved or Rejected.' });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    leave.status = action;
    if (adminComment !== undefined) leave.adminComment = adminComment;
    leave.reviewedBy = req.user.name;
    leave.reviewedAt = new Date();

    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave request ${action.toLowerCase()} successfully.`,
      leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to review leave request.' });
  }
};
