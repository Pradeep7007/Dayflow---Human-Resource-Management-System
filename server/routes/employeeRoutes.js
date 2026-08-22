const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addDocument,
  deleteDocument,
  createEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/profile/me', getProfile);
router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);

router.post('/profile/:id/documents', addDocument);
router.delete('/profile/:id/documents/:docId', deleteDocument);

// Admin & HR Direct Account Creation Endpoint
router.post('/', authorize('admin', 'hr'), createEmployee);

module.exports = router;
