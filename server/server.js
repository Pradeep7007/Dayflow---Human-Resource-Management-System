const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const helpCenterRoutes = require('./routes/helpCenterRoutes');
const { protect } = require('./middleware/authMiddleware');
const { authorize } = require('./middleware/roleMiddleware');

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Core Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/help-center', helpCenterRoutes);

// Protected Backend Role Enforcement Test Routes
app.get('/api/admin/dashboard-stats', protect, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Admin Authorized API',
    data: { totalWorkforce: 248, pendingLeaves: 14, totalPayroll: 184200 },
  });
});

app.get('/api/hr/dashboard-stats', protect, authorize('admin', 'hr'), (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to HR Authorized API',
    data: { pendingLeaves: 14, totalEmployees: 248 },
  });
});

app.get('/api/employee/dashboard-stats', protect, authorize('admin', 'hr', 'employee'), (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Employee Authorized API',
    data: { user: req.user },
  });
});

// Root API Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'DayFlow HRMS API Server',
    status: 'Healthy',
    timestamp: new Date(),
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[DayFlow Server] Running on http://localhost:${PORT}`);
});
