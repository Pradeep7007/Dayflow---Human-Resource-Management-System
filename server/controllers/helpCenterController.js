// HR Help Center Knowledge Base & Support Request Controller

const faqs = [
  {
    id: 'faq-1',
    category: 'Leave',
    question: 'How many paid leaves do I have each year?',
    answer: 'Full-time DayFlow employees receive 24 paid leaves annually (12 Paid Casual/Earned Leaves, 8 Sick Leaves, and 4 Restricted/Floating Holidays). Leaves accrue at 2 days per completed month.',
    tags: ['paid leave', 'quota', 'earned leave', 'sick leave'],
    helpfulCount: 42,
    unhelpfulCount: 1,
  },
  {
    id: 'faq-2',
    category: 'Leave',
    question: 'How do I apply for sick leave?',
    answer: 'Navigate to "Leave Requests" in your employee portal sidebar, click "Apply for Leave", select "Sick Leave" as the type, specify the date range, and attach a medical certificate if taking more than 2 consecutive days.',
    tags: ['sick leave', 'apply leave', 'medical certificate'],
    helpfulCount: 38,
    unhelpfulCount: 0,
  },
  {
    id: 'faq-3',
    category: 'Payroll',
    question: 'When will my salary be credited?',
    answer: 'Monthly salaries are disbursed on the 1st business day of each month for the preceding month. Payslips become viewable in your "My Payslips" portal 24 hours prior to bank transfer.',
    tags: ['salary credit', 'payday', 'payslip', 'disbursement'],
    helpfulCount: 56,
    unhelpfulCount: 2,
  },
  {
    id: 'faq-4',
    category: 'Attendance',
    question: 'How do I correct attendance or missing check-out?',
    answer: 'If you forgot to check out or have a missing check-in log, open "My Attendance", click "Request Attendance Regularization", select the date, specify your actual check-in/out times, and submit for HR manager approval.',
    tags: ['attendance correction', 'missing check-out', 'regularization'],
    helpfulCount: 29,
    unhelpfulCount: 1,
  },
  {
    id: 'faq-5',
    category: 'Benefits',
    question: 'What health insurance and benefits are provided?',
    answer: 'DayFlow provides comprehensive Group Medical Coverage (GMC) of ₹5,00,000 for employees and dependants, along with wellness allowances and annual health checkups.',
    tags: ['insurance', 'health checkup', 'benefits', 'medical claim'],
    helpfulCount: 31,
    unhelpfulCount: 0,
  },
  {
    id: 'faq-6',
    category: 'Company Policies',
    question: 'What is the working hours and grace period policy?',
    answer: 'Standard office hours are 09:00 AM to 06:00 PM (Monday to Friday). A grace period of 15 minutes is allowed until 09:15 AM. Three late arrivals exceeding 15 minutes in a month trigger a half-day deduction.',
    tags: ['grace period', 'working hours', 'late policy', 'shift'],
    helpfulCount: 45,
    unhelpfulCount: 3,
  },
  {
    id: 'faq-7',
    category: 'Documents',
    question: 'How can I download my annual Tax Form 16 or Pay Slips?',
    answer: 'Go to "My Payslips" or "My Profile" -> "Documents". You can generate high-resolution PDF copies of your monthly payslips and annual Tax Form 16 anytime.',
    tags: ['form 16', 'tax document', 'download payslip'],
    helpfulCount: 24,
    unhelpfulCount: 0,
  },
];

const policies = [
  {
    id: 'pol-1',
    title: 'DayFlow Employee Handbook 2026',
    category: 'Company Policies',
    lastUpdated: 'Jan 2026',
    fileSize: '2.4 MB',
    summary: 'Comprehensive guidelines covering workplace conduct, ethics, leave entitlements, performance reviews, and separation policies.',
  },
  {
    id: 'pol-2',
    title: 'Remote & Hybrid Work Governance Guidelines',
    category: 'Company Policies',
    lastUpdated: 'Mar 2026',
    fileSize: '1.1 MB',
    summary: 'Rules for work-from-home eligibility, core online hours, equipment security, and internet reimbursement policies.',
  },
  {
    id: 'pol-3',
    title: 'Travel & Business Expense Policy',
    category: 'Payroll',
    lastUpdated: 'May 2026',
    fileSize: '850 KB',
    summary: 'Reimbursement caps for domestic and international business travel, lodging, meals, and daily allowances.',
  },
];

// In-memory support tickets store
let supportTickets = [
  {
    id: 'TICK-802',
    employeeName: 'Tharun R',
    category: 'Payroll',
    subject: 'Discrepancy in August HRA calculation',
    details: 'My HRA allowance shows ₹15,000 instead of ₹18,000 after my recent promotion.',
    status: 'Open',
    createdAt: '2026-08-22',
  },
];

// @desc    Get Knowledge Base FAQs & Policies
// @route   GET /api/help-center
// @access  Private
const getHelpCenterContent = async (req, res) => {
  res.json({
    success: true,
    faqs,
    policies,
    categories: ['Leave', 'Attendance', 'Payroll', 'Benefits', 'Company Policies', 'Documents'],
  });
};

// @desc    Submit HR Support Request Ticket
// @route   POST /api/help-center/request
// @access  Private
const createSupportRequest = async (req, res) => {
  const { category, subject, details } = req.body;
  if (!subject || !details) {
    return res.status(400).json({ message: 'Subject and details are required.' });
  }

  const newTicket = {
    id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
    employeeName: req.user?.name || 'DayFlow Employee',
    category: category || 'General HR',
    subject,
    details,
    status: 'Open',
    createdAt: new Date().toISOString().split('T')[0],
  };

  supportTickets.unshift(newTicket);

  res.status(201).json({
    success: true,
    message: 'HR Support Request created successfully.',
    ticket: newTicket,
  });
};

// @desc    Get All HR Support Requests (Admin / HR)
// @route   GET /api/help-center/requests
// @access  Private (Admin & HR)
const getSupportRequests = async (req, res) => {
  res.json({
    success: true,
    tickets: supportTickets,
  });
};

module.exports = {
  getHelpCenterContent,
  createSupportRequest,
  getSupportRequests,
};
