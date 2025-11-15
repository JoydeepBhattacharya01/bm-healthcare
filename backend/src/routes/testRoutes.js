const express = require('express');
const router = express.Router();
const {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  getTestCategories,
  createTestBooking,
  getTestBookings,
  getTestBookingById,
  confirmTestBooking,
  updateTestBooking
} = require('../controllers/testController');
const { protect, admin, receptionistOrAdmin } = require('../middleware/authMiddleware');

// Test routes
router.route('/')
  .get(getTests)
  .post(protect, admin, createTest);

router.get('/categories/list', getTestCategories);

router.route('/:id')
  .get(getTestById)
  .put(protect, admin, updateTest)
  .delete(protect, admin, deleteTest);

// Test booking routes
router.route('/bookings')
  .get(protect, getTestBookings)
  .post(protect, createTestBooking);

router.route('/bookings/:id')
  .get(protect, getTestBookingById)
  .put(protect, receptionistOrAdmin, updateTestBooking);

router.put('/bookings/:id/confirm', protect, receptionistOrAdmin, confirmTestBooking);

module.exports = router;
