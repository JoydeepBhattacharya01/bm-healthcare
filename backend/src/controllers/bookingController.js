const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const TestBooking = require('../models/TestBooking');
const Doctor = require('../models/Doctor');
const Test = require('../models/Test');
const { sendSMS, smsTemplates } = require('../utils/smsService');
const moment = require('moment');

// @desc    Create appointment (Guest booking)
// @route   POST /api/bookings/appointments
// @access  Public
const createGuestAppointment = asyncHandler(async (req, res) => {
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

  const doctorExists = await Doctor.findById(doctor);

  if (!doctorExists) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  if (!doctorExists.isActive) {
    res.status(400);
    throw new Error('Doctor is not available');
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
    status: 'pending'
  });

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('doctor', 'name specialization consultationFee');

  // Send response immediately
  res.status(201).json({
    success: true,
    bookingId: appointment.bookingId,
    appointment: populatedAppointment
  });

  // Send SMS in background (non-blocking)
  const dateStr = moment(appointmentDate).format('DD MMM YYYY');
  const smsMessage = smsTemplates.appointmentBooked(
    patientName,
    doctorExists.name,
    dateStr,
    appointmentTime,
    appointment.bookingId
  );
  
  sendSMS(patientMobile, smsMessage)
    .catch(error => console.error('SMS sending failed:', error));
});

// @desc    Create test booking (Guest booking)
// @route   POST /api/bookings/tests
// @access  Public
const createGuestTestBooking = asyncHandler(async (req, res) => {
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

  for (const testItem of tests) {
    const test = await Test.findById(testItem.test);
    if (!test) {
      res.status(404);
      throw new Error(`Test not found: ${testItem.test}`);
    }
    if (!test.isActive) {
      res.status(400);
      throw new Error(`Test is not available: ${test.name}`);
    }
    
    let price = test.price;
    if (collectionType === 'home' && test.isHomeCollectionAvailable) {
      price += test.homeCollectionCharge;
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
    status: 'pending'
  });

  const populatedBooking = await TestBooking.findById(testBooking._id)
    .populate('tests.test', 'name category price');

  // Send response immediately
  res.status(201).json({
    success: true,
    bookingId: testBooking.bookingId,
    booking: populatedBooking
  });

  // Send SMS in background (non-blocking)
  const dateStr = moment(bookingDate).format('DD MMM YYYY');
  const testNames = populatedBooking.tests.map(t => t.test.name).join(', ');
  const smsMessage = smsTemplates.testBooked(
    patientName,
    testNames,
    dateStr,
    bookingTime,
    testBooking.bookingId
  );
  
  sendSMS(patientMobile, smsMessage)
    .catch(error => console.error('SMS sending failed:', error));
});

// @desc    Get bookings by mobile number
// @route   GET /api/bookings/lookup/:mobile
// @access  Public
const getBookingsByMobile = asyncHandler(async (req, res) => {
  const { mobile } = req.params;

  if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
    res.status(400);
    throw new Error('Please provide a valid 10-digit mobile number');
  }

  const appointments = await Appointment.find({ patientMobile: mobile })
    .populate('doctor', 'name specialization consultationFee')
    .sort({ appointmentDate: -1 });

  const testBookings = await TestBooking.find({ patientMobile: mobile })
    .populate('tests.test', 'name category price')
    .sort({ bookingDate: -1 });

  res.json({
    success: true,
    appointments,
    testBookings
  });
});

// @desc    Get booking by booking ID
// @route   GET /api/bookings/:bookingId
// @access  Public
const getBookingById = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  let booking = null;
  let type = null;

  if (bookingId.startsWith('APT')) {
    booking = await Appointment.findOne({ bookingId })
      .populate('doctor', 'name specialization consultationFee phone');
    type = 'appointment';
  } else if (bookingId.startsWith('TST')) {
    booking = await TestBooking.findOne({ bookingId })
      .populate('tests.test', 'name category price');
    type = 'test';
  }

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  res.json({
    success: true,
    type,
    booking
  });
});

module.exports = {
  createGuestAppointment,
  createGuestTestBooking,
  getBookingsByMobile,
  getBookingById
};
