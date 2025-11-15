const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
  const { specialization, search, isActive, page = 1, limit = 10 } = req.query;

  const query = {};

  if (specialization) {
    query.specialization = { $regex: specialization, $options: 'i' };
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } }
    ];
  }

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const doctors = await Doctor.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Doctor.countDocuments(query);

  res.json({
    doctors,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count
  });
});

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

// @desc    Create doctor
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    specialization,
    qualifications,
    experience,
    consultationFee,
    bio,
    availableSlots,
    image
  } = req.body;

  // Check if doctor email exists
  const doctorExists = await Doctor.findOne({ email });

  if (doctorExists) {
    res.status(400);
    throw new Error('Doctor with this email already exists');
  }

  const doctor = await Doctor.create({
    name,
    email,
    phone,
    specialization,
    qualifications,
    experience,
    consultationFee,
    bio,
    availableSlots,
    image
  });

  if (doctor) {
    res.status(201).json(doctor);
  } else {
    res.status(400);
    throw new Error('Invalid doctor data');
  }
});

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private/Admin
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    doctor.name = req.body.name || doctor.name;
    doctor.email = req.body.email || doctor.email;
    doctor.phone = req.body.phone || doctor.phone;
    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.qualifications = req.body.qualifications || doctor.qualifications;
    doctor.experience = req.body.experience || doctor.experience;
    doctor.consultationFee = req.body.consultationFee || doctor.consultationFee;
    doctor.bio = req.body.bio || doctor.bio;
    doctor.image = req.body.image || doctor.image;
    doctor.isActive = req.body.isActive !== undefined ? req.body.isActive : doctor.isActive;

    if (req.body.availableSlots) {
      doctor.availableSlots = req.body.availableSlots;
    }

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    // Soft delete - deactivate doctor
    doctor.isActive = false;
    await doctor.save();
    res.json({ message: 'Doctor deactivated' });
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

// @desc    Get doctor available slots
// @route   GET /api/doctors/:id/slots
// @access  Public
const getDoctorSlots = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    res.json(doctor.availableSlots);
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

// @desc    Get all specializations
// @route   GET /api/doctors/specializations/list
// @access  Public
const getSpecializations = asyncHandler(async (req, res) => {
  const specializations = await Doctor.distinct('specialization');
  res.json(specializations);
});

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorSlots,
  getSpecializations
};
