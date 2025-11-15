const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  confirmAppointment,
  cancelAppointment,
  updateAppointment,
  getAppointmentStats
} = require('../controllers/appointmentController');
const { protect, receptionistOrAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getAppointments)
  .post(protect, createAppointment);

router.get('/stats/dashboard', protect, receptionistOrAdmin, getAppointmentStats);

router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, receptionistOrAdmin, updateAppointment);

router.put('/:id/confirm', protect, receptionistOrAdmin, confirmAppointment);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;
