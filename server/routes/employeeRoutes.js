const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getProfile,
  updateProfile,
  deleteEmployee,
  addDocument,
  deleteDocument,
  createEmployee,
  getPayrollAll,
  updateSalaryStructure,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// Employee Management Endpoints (Admin & HR)
router.get('/', authorize('admin', 'hr'), getAllEmployees);
router.post('/', authorize('admin', 'hr'), createEmployee);
router.delete('/:id', authorize('admin', 'hr'), deleteEmployee);

// Profile Endpoints
router.get('/profile/me', getProfile);
router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);

// Documents Endpoints
router.post('/profile/:id/documents', addDocument);
router.delete('/profile/:id/documents/:docId', deleteDocument);

// Payroll Management Endpoints (Admin & HR)
router.get('/payroll/all', authorize('admin', 'hr'), getPayrollAll);
router.put('/:id/salary', authorize('admin', 'hr'), updateSalaryStructure);

module.exports = router;
