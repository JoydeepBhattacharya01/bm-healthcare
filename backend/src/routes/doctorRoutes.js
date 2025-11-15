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
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getDoctors)
  .post(protect, admin, createDoctor);

router.get('/specializations/list', getSpecializations);

router.route('/:id')
  .get(getDoctorById)
  .put(protect, admin, updateDoctor)
  .delete(protect, admin, deleteDoctor);

router.get('/:id/slots', getDoctorSlots);

module.exports = router;
