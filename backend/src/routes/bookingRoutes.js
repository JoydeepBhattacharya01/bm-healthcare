const express = require('express');
const router = express.Router();
const {
  createGuestAppointment,
  createGuestTestBooking,
  getBookingsByMobile,
  getBookingById
} = require('../controllers/bookingController');

// Public booking routes (no authentication required)
router.post('/appointments', createGuestAppointment);
router.post('/tests', createGuestTestBooking);
router.get('/lookup/:mobile', getBookingsByMobile);
router.get('/:bookingId', getBookingById);

module.exports = router;
