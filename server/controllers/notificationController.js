// Notification & Activity Stream Controller

let userNotifications = [
  {
    id: 'notif-1',
    type: 'Leave',
    title: 'Leave Request Approved',
    message: 'Your 2-day Sick Leave request for Aug 24-25 has been approved by HR.',
    time: '10 mins ago',
    date: '2026-08-22',
    isRead: false,
    link: '/employee/leaves',
    badge: 'success',
  },
  {
    id: 'notif-2',
    type: 'Attendance',
    title: 'Missing Check-Out Reminder',
    message: 'System logged a missing check-out event for Aug 21. Please regularize your hours.',
    time: '2 hours ago',
    date: '2026-08-22',
    isRead: false,
    link: '/employee/attendance',
    badge: 'warning',
  },
  {
    id: 'notif-3',
    type: 'Payroll',
    title: 'August 2026 Payslip Available',
    message: 'Your salary disbursement statement for August 2026 is ready for viewing.',
    time: 'Yesterday',
    date: '2026-08-21',
    isRead: true,
    link: '/employee/payroll',
    badge: 'info',
  },
  {
    id: 'notif-4',
    type: 'HR',
    title: 'Annual Performance Appraisal Announcement',
    message: 'Q3 performance review cycle begins next week. Please complete your self-evaluation form.',
    time: '2 days ago',
    date: '2026-08-20',
    isRead: true,
    link: '/help-center',
    badge: 'indigo',
  },
  {
    id: 'notif-5',
    type: 'Leave',
    title: 'New Leave Approval Pending',
    message: 'Tharun R submitted a 3-day Casual Leave request requiring sign-off.',
    time: '3 days ago',
    date: '2026-08-19',
    isRead: true,
    link: '/admin/leaves',
    badge: 'warning',
  },
];

const activityTimeline = [
  {
    id: 'act-1',
    user: 'HR Admin',
    action: 'Verified August 2026 Payroll Cycle',
    timestamp: 'Today at 09:30 AM',
    type: 'Payroll',
    details: 'Disbursement calculated for 24 active employees.',
  },
  {
    id: 'act-2',
    user: 'Tharun R',
    action: 'Submitted Casual Leave Request',
    timestamp: 'Yesterday at 04:15 PM',
    type: 'Leave',
    details: 'Requested 3 days for family relocation.',
  },
  {
    id: 'act-3',
    user: 'Ananya Sharma',
    action: 'Approved Attendance Regularization',
    timestamp: 'Aug 20 at 11:00 AM',
    type: 'Attendance',
    details: 'Adjusted check-out log for Kishore M.',
  },
  {
    id: 'act-4',
    user: 'System Bot',
    action: 'Generated Smart HR Insights',
    timestamp: 'Aug 19 at 08:00 AM',
    type: 'HR',
    details: 'Identified 14% shift absenteeism trend on Mondays.',
  },
];

// @desc    Get Notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;
  res.json({
    success: true,
    unreadCount,
    notifications: userNotifications,
  });
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  const { id } = req.params;
  userNotifications = userNotifications.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;
  res.json({ success: true, unreadCount, notifications: userNotifications });
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  userNotifications = userNotifications.map((n) => ({ ...n, isRead: true }));
  res.json({ success: true, unreadCount: 0, notifications: userNotifications });
};

// @desc    Get Activity Feed
// @route   GET /api/notifications/activity
// @access  Private
const getActivityTimeline = async (req, res) => {
  res.json({ success: true, timeline: activityTimeline });
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getActivityTimeline,
};
