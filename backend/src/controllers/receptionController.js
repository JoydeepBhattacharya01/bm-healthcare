const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const TestBooking = require('../models/TestBooking');
const Doctor = require('../models/Doctor');
const Test = require('../models/Test');
const User = require('../models/User');
const { sendSMS, smsTemplates } = require('../utils/smsService');
const moment = require('moment');

// @desc    Get all appointments for reception
// @route   GET /api/reception/appointments
// @access  Private/Receptionist/Admin
const getAllAppointments = asyncHandler(async (req, res) => {
  const { status, doctor, date, search, page = 1, limit = 20 } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (doctor) {
    query.doctor = doctor;
  }

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.appointmentDate = { $gte: startDate, $lt: endDate };
  }

  if (search) {
    query.$or = [
      { patientName: { $regex: search, $options: 'i' } },
      { patientMobile: { $regex: search, $options: 'i' } },
      { bookingId: { $regex: search, $options: 'i' } }
    ];
  }

  const [appointments, count] = await Promise.all([
    Appointment.find(query)
      .populate('doctor', 'name specialization consultationFee')
      .populate('confirmedBy', 'name')
      .populate('cancelledBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appointmentDate: -1, createdAt: -1 })
      .lean(),
    Appointment.countDocuments(query)
  ]);

  res.json({
    appointments,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    total: count
  });
});

// @desc    Get all test bookings for reception
// @route   GET /api/reception/test-bookings
// @access  Private/Receptionist/Admin
const getAllTestBookings = asyncHandler(async (req, res) => {
  const { status, date, search, page = 1, limit = 20 } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.bookingDate = { $gte: startDate, $lt: endDate };
  }

  if (search) {
    query.$or = [
      { patientName: { $regex: search, $options: 'i' } },
      { patientMobile: { $regex: search, $options: 'i' } },
      { bookingId: { $regex: search, $options: 'i' } }
    ];
  }

  const [testBookings, count] = await Promise.all([
    TestBooking.find(query)
      .populate('tests.test', 'name category price')
      .populate('confirmedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ bookingDate: -1, createdAt: -1 })
      .lean(),
    TestBooking.countDocuments(query)
  ]);

  res.json({
    testBookings,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    total: count
  });
});

// @desc    Confirm appointment
// @route   PUT /api/reception/appointments/:id/confirm
// @access  Private/Receptionist/Admin
const confirmAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
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

  const dateStr = moment(appointment.appointmentDate).format('DD MMM YYYY');
  const smsMessage = smsTemplates.appointmentConfirmed(
    appointment.patientName,
    appointment.doctor.name,
    dateStr,
    appointment.appointmentTime,
    appointment.bookingId
  );
  
  try {
    await sendSMS(appointment.patientMobile, smsMessage);
  } catch (error) {
    console.error('SMS sending failed:', error);
  }

  res.json(updatedAppointment);
});

// @desc    Reject/Cancel appointment
// @route   PUT /api/reception/appointments/:id/reject
// @access  Private/Receptionist/Admin
const rejectAppointment = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body;

  const appointment = await Appointment.findById(req.params.id)
    .populate('doctor', 'name');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  if (appointment.status === 'cancelled') {
    res.status(400);
    throw new Error('Appointment already cancelled');
  }

  appointment.status = 'cancelled';
  appointment.cancelledBy = req.user._id;
  appointment.cancelledAt = Date.now();
  appointment.cancellationReason = cancellationReason || 'Rejected by reception';

  const updatedAppointment = await appointment.save();

  const dateStr = moment(appointment.appointmentDate).format('DD MMM YYYY');
  const smsMessage = smsTemplates.appointmentCancelled(
    appointment.patientName,
    appointment.doctor.name,
    dateStr,
    appointment.bookingId
  );
  
  try {
    await sendSMS(appointment.patientMobile, smsMessage);
  } catch (error) {
    console.error('SMS sending failed:', error);
  }

  res.json(updatedAppointment);
});

// @desc    Confirm test booking
// @route   PUT /api/reception/test-bookings/:id/confirm
// @access  Private/Receptionist/Admin
const confirmTestBooking = asyncHandler(async (req, res) => {
  const testBooking = await TestBooking.findById(req.params.id)
    .populate('tests.test', 'name');

  if (!testBooking) {
    res.status(404);
    throw new Error('Test booking not found');
  }

  if (testBooking.status === 'confirmed') {
    res.status(400);
    throw new Error('Test booking already confirmed');
  }

  testBooking.status = 'confirmed';
  testBooking.confirmedBy = req.user._id;
  testBooking.confirmedAt = Date.now();

  const updatedBooking = await testBooking.save();

  const dateStr = moment(testBooking.bookingDate).format('DD MMM YYYY');
  const testNames = testBooking.tests.map(t => t.test.name).join(', ');
  const smsMessage = smsTemplates.testConfirmed(
    testBooking.patientName,
    testNames,
    dateStr,
    testBooking.bookingTime,
    testBooking.bookingId
  );
  
  try {
    await sendSMS(testBooking.patientMobile, smsMessage);
  } catch (error) {
    console.error('SMS sending failed:', error);
  }

  res.json(updatedBooking);
});

// @desc    Update test booking status
// @route   PUT /api/reception/test-bookings/:id/status
// @access  Private/Receptionist/Admin
const updateTestBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const testBooking = await TestBooking.findById(req.params.id);

  if (!testBooking) {
    res.status(404);
    throw new Error('Test booking not found');
  }

  testBooking.status = status;

  if (status === 'sample_collected') {
    testBooking.sampleCollectedAt = Date.now();
  }

  const updatedBooking = await testBooking.save();

  res.json(updatedBooking);
});

// @desc    Get dashboard statistics
// @route   GET /api/reception/stats
// @access  Private/Receptionist/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
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

  const todayTestBookings = await TestBooking.countDocuments({
    bookingDate: { $gte: today, $lt: tomorrow }
  });

  const pendingTestBookings = await TestBooking.countDocuments({
    status: 'pending'
  });

  const totalBookingsToday = todayAppointments + todayTestBookings;

  res.json({
    todayAppointments,
    pendingAppointments,
    confirmedAppointments,
    todayTestBookings,
    pendingTestBookings,
    totalBookingsToday
  });
});

// @desc    Create appointment on behalf of user
// @route   POST /api/reception/appointments
// @access  Private/Receptionist/Admin
const createAppointmentForUser = asyncHandler(async (req, res) => {
  const { 
    patientName, 
    patientMobile, 
    patientEmail,
    doctor, 
    appointmentDate, 
    appointmentTime, 
    symptoms, 
    notes 
  } = req.body;

  if (!patientName || !patientMobile || !doctor || !appointmentDate || !appointmentTime) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const doctorExists = await Doctor.findById(doctor).select('name specialization consultationFee').lean();

  if (!doctorExists) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Allow multiple bookings for the same time slot
  // Removed time slot conflict check to enable multiple users to book same slot

  const appointment = await Appointment.create({
    patientName,
    patientMobile,
    patientEmail,
    doctor,
    appointmentDate,
    appointmentTime,
    symptoms,
    notes,
    status: 'confirmed',
    confirmedBy: req.user._id,
    confirmedAt: Date.now()
  });

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('doctor', 'name specialization consultationFee')
    .lean();

  // Send response immediately
  res.status(201).json({
    success: true,
    bookingId: appointment.bookingId,
    appointment: populatedAppointment
  });

  // Send SMS in background (non-blocking)
  const dateStr = moment(appointmentDate).format('DD MMM YYYY');
  const smsMessage = smsTemplates.appointmentConfirmed(
    patientName,
    doctorExists.name,
    dateStr,
    appointmentTime,
    appointment.bookingId
  );
  
  sendSMS(patientMobile, smsMessage)
    .catch(error => console.error('SMS sending failed:', error));
});

// @desc    Create test booking on behalf of user
// @route   POST /api/reception/test-bookings
// @access  Private/Receptionist/Admin
const createTestBookingForUser = asyncHandler(async (req, res) => {
  const {
    patientName,
    patientMobile,
    patientEmail,
    tests,
    bookingDate,
    bookingTime,
    collectionType,
    collectionAddress,
    notes
  } = req.body;

  if (!patientName || !patientMobile || !tests || tests.length === 0 || !bookingDate || !bookingTime) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  let totalAmount = 0;
  const testDetails = [];
  const testIds = tests.map(t => t.test || t);
  
  // Fetch all tests in one query for better performance
  const foundTests = await Test.find({ _id: { $in: testIds } }).lean();
  
  if (foundTests.length !== testIds.length) {
    res.status(404);
    throw new Error('One or more tests not found');
  }

  // Create a map for quick lookup
  const testMap = {};
  foundTests.forEach(test => {
    testMap[test._id.toString()] = test;
  });

  for (const testItem of tests) {
    const testId = (testItem.test || testItem).toString();
    const test = testMap[testId];
    
    let price = test.price;
    if (collectionType === 'home' && test.isHomeCollectionAvailable) {
      price += test.homeCollectionCharge || 0;
    }
    
    testDetails.push({
      test: test._id,
      price
    });
    totalAmount += price;
  }

  const testBooking = await TestBooking.create({
    patientName,
    patientMobile,
    patientEmail,
    tests: testDetails,
    bookingDate,
    bookingTime,
    collectionType,
    collectionAddress,
    totalAmount,
    notes,
    status: 'confirmed',
    confirmedBy: req.user._id,
    confirmedAt: Date.now()
  });

  const populatedBooking = await TestBooking.findById(testBooking._id)
    .populate('tests.test', 'name category price')
    .lean();

  // Send response immediately
  res.status(201).json({
    success: true,
    bookingId: testBooking.bookingId,
    booking: populatedBooking
  });

  // Send SMS in background (non-blocking)
  const dateStr = moment(bookingDate).format('DD MMM YYYY');
  const testNames = populatedBooking.tests.map(t => t.test.name).join(', ');
  const smsMessage = smsTemplates.testConfirmed(
    patientName,
    testNames,
    dateStr,
    bookingTime,
    testBooking.bookingId
  );
  
  sendSMS(patientMobile, smsMessage)
    .catch(error => console.error('SMS sending failed:', error));
});

// @desc    Update appointment status
// @route   PUT /api/reception/appointments/:id/status
// @access  Private/Receptionist/Admin
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  appointment.status = status;

  if (status === 'completed') {
    appointment.completedAt = Date.now();
  }

  const updatedAppointment = await appointment.save();

  res.json(updatedAppointment);
});

module.exports = {
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
};
