const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addDocument,
  deleteDocument,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/profile/me', getProfile);
router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);

router.post('/profile/:id/documents', addDocument);
router.delete('/profile/:id/documents/:docId', deleteDocument);

module.exports = router;
