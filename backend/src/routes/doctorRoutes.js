const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorSlots,
  getSpecializations
} = require('../controllers/doctorController');
const { protect, admin, receptionistOrAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getDoctors)
  .post(protect, receptionistOrAdmin, createDoctor);

router.get('/specializations/list', getSpecializations);

router.route('/:id')
  .get(getDoctorById)
  .put(protect, receptionistOrAdmin, updateDoctor)
  .delete(protect, receptionistOrAdmin, deleteDoctor);

router.get('/:id/slots', getDoctorSlots);

module.exports = router;
