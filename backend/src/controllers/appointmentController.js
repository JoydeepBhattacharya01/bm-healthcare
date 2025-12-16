const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { sendSMS, smsTemplates } = require('../utils/smsService');
const moment = require('moment');

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const { doctor, appointmentDate, appointmentTime, symptoms, notes } = req.body;

  // Check if doctor exists
  const doctorExists = await Doctor.findById(doctor);

  if (!doctorExists) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  if (!doctorExists.isActive) {
    res.status(400);
    throw new Error('Doctor is not available');
  }

  // Check if slot is already booked
  const existingAppointment = await Appointment.findOne({
    doctor,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (existingAppointment) {
    res.status(400);
    throw new Error('This time slot is already booked');
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor,
    appointmentDate,
    appointmentTime,
    symptoms,
    notes,
    status: 'pending'
  });

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization consultationFee');

  // Send SMS notification
  const dateStr = moment(appointmentDate).format('DD MMM YYYY');
  const smsMessage = smsTemplates.appointmentBooked(
    req.user.name,
    doctorExists.name,
    dateStr,
    appointmentTime
  );
  await sendSMS(req.user.phone, smsMessage);

  res.status(201).json(populatedAppointment);
});

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin/Receptionist
const getAppointments = asyncHandler(async (req, res) => {
  const { status, doctor, patient, date, page = 1, limit = 10 } = req.query;

  const query = {};

  // If user is patient, only show their appointments
  if (req.user.role === 'user') {
    query.patient = req.user._id;
  }

  if (status) {
    query.status = status;
  }

  if (doctor) {
    query.doctor = doctor;
  }

  if (patient) {
    query.patient = patient;
  }

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.appointmentDate = { $gte: startDate, $lt: endDate };
  }

  const appointments = await Appointment.find(query)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization consultationFee')
    .populate('payment')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ appointmentDate: 1, appointmentTime: 1 });

  const count = await Appointment.countDocuments(query);

  res.json({
    appointments,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count
  });
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'name email phone dateOfBirth gender address')
    .populate('doctor', 'name specialization qualifications consultationFee')
    .populate('payment')
    .populate('confirmedBy', 'name')
    .populate('cancelledBy', 'name');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check if user has permission to view
  if (
    req.user.role === 'user' &&
    appointment.patient._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this appointment');
  }

  res.json(appointment);
});

// @desc    Confirm appointment
// @route   PUT /api/appointments/:id/confirm
// @access  Private/Receptionist/Admin
const confirmAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'name phone')
    .populate('doctor', 'name');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  if (appointment.status === 'confirmed') {
    res.status(400);
    throw new Error('Appointment already confirmed');
  }

  if (appointment.status === 'cancelled') {
    res.status(400);
    throw new Error('Cannot confirm cancelled appointment');
  }

  appointment.status = 'confirmed';
  appointment.confirmedBy = req.user._id;
  appointment.confirmedAt = Date.now();

  const updatedAppointment = await appointment.save();

  // Send SMS notification
  const dateStr = moment(appointment.appointmentDate).format('DD MMM YYYY');
  const smsMessage = smsTemplates.appointmentConfirmed(
    appointment.patient.name,
    appointment.doctor.name,
    dateStr,
    appointment.appointmentTime
  );
  await sendSMS(appointment.patient.phone, smsMessage);

  res.json(updatedAppointment);
});

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body;

  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'name phone')
    .populate('doctor', 'name');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check if user has permission to cancel
  if (
    req.user.role === 'user' &&
    appointment.patient._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to cancel this appointment');
  }

  if (appointment.status === 'cancelled') {
    res.status(400);
    throw new Error('Appointment already cancelled');
  }

  if (appointment.status === 'completed') {
    res.status(400);
    throw new Error('Cannot cancel completed appointment');
  }

  appointment.status = 'cancelled';
  appointment.cancelledBy = req.user._id;
  appointment.cancelledAt = Date.now();
  appointment.cancellationReason = cancellationReason;

  const updatedAppointment = await appointment.save();

  // Send SMS notification
  const dateStr = moment(appointment.appointmentDate).format('DD MMM YYYY');
  const smsMessage = smsTemplates.appointmentCancelled(
    appointment.patient.name,
    appointment.doctor.name,
    dateStr
  );
  await sendSMS(appointment.patient.phone, smsMessage);

  res.json(updatedAppointment);
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private/Receptionist/Admin
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const {
    appointmentDate,
    appointmentTime,
    status,
    symptoms,
    notes,
    prescriptionNotes
  } = req.body;

  if (appointmentDate) appointment.appointmentDate = appointmentDate;
  if (appointmentTime) appointment.appointmentTime = appointmentTime;
  if (status) appointment.status = status;
  if (symptoms) appointment.symptoms = symptoms;
  if (notes) appointment.notes = notes;
  if (prescriptionNotes) appointment.prescriptionNotes = prescriptionNotes;

  const updatedAppointment = await appointment.save();

  res.json(updatedAppointment);
});

// @desc    Get appointment statistics
// @route   GET /api/appointments/stats/dashboard
// @access  Private/Admin/Receptionist
const getAppointmentStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = await Appointment.countDocuments({
    appointmentDate: { $gte: today, $lt: tomorrow }
  });

  const pendingAppointments = await Appointment.countDocuments({
    status: 'pending'
  });

  const confirmedAppointments = await Appointment.countDocuments({
    status: 'confirmed',
    appointmentDate: { $gte: today }
  });

  const completedAppointments = await Appointment.countDocuments({
    status: 'completed'
  });

  res.json({
    todayAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments
  });
});

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  confirmAppointment,
  cancelAppointment,
  updateAppointment,
  getAppointmentStats
};
