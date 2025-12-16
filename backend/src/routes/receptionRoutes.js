const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAllTestBookings,
  confirmAppointment,
  rejectAppointment,
  confirmTestBooking,
  updateTestBookingStatus,
  updateAppointmentStatus,
  getDashboardStats,
  createAppointmentForUser,
  createTestBookingForUser
} = require('../controllers/receptionController');
const { protect, receptionistOrAdmin } = require('../middleware/authMiddleware');

// All routes require receptionist or admin authentication
router.use(protect);
router.use(receptionistOrAdmin);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Appointments management
router.get('/appointments', getAllAppointments);
router.post('/appointments', createAppointmentForUser);
router.put('/appointments/:id/confirm', confirmAppointment);
router.put('/appointments/:id/reject', rejectAppointment);
router.put('/appointments/:id/status', updateAppointmentStatus);

// Test bookings management
router.get('/test-bookings', getAllTestBookings);
router.post('/test-bookings', createTestBookingForUser);
router.put('/test-bookings/:id/confirm', confirmTestBooking);
router.put('/test-bookings/:id/status', updateTestBookingStatus);

module.exports = router;
