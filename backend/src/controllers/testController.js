const asyncHandler = require('express-async-handler');
const Test = require('../models/Test');
const TestBooking = require('../models/TestBooking');
const { sendSMS, smsTemplates } = require('../utils/smsService');
const moment = require('moment');

// @desc    Get all tests
// @route   GET /api/tests
// @access  Public
const getTests = asyncHandler(async (req, res) => {
  const { category, search, isActive, page = 1, limit = 20 } = req.query;

  const query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (isActive !== undefined && isActive !== 'all') {
    query.isActive = isActive === 'true';
  } else if (isActive !== 'all') {
    query.isActive = true;
  }

  const tests = await Test.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ name: 1 });

  const count = await Test.countDocuments(query);

  res.json({
    tests,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count
  });
});

// @desc    Get test by ID
// @route   GET /api/tests/:id
// @access  Public
const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (test) {
    res.json(test);
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
});

// @desc    Create test
// @route   POST /api/tests
// @access  Private/Admin
const createTest = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    price,
    preparationInstructions,
    reportDeliveryTime,
    isHomeCollectionAvailable,
    homeCollectionCharge,
    parameters
  } = req.body;

  const test = await Test.create({
    name,
    description,
    category,
    price,
    preparationInstructions,
    reportDeliveryTime,
    isHomeCollectionAvailable,
    homeCollectionCharge,
    parameters
  });

  res.status(201).json(test);
});

// @desc    Update test
// @route   PUT /api/tests/:id
// @access  Private/Admin
const updateTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (test) {
    test.name = req.body.name || test.name;
    test.description = req.body.description || test.description;
    test.category = req.body.category || test.category;
    test.price = req.body.price || test.price;
    test.preparationInstructions = req.body.preparationInstructions || test.preparationInstructions;
    test.reportDeliveryTime = req.body.reportDeliveryTime || test.reportDeliveryTime;
    test.isHomeCollectionAvailable = req.body.isHomeCollectionAvailable !== undefined 
      ? req.body.isHomeCollectionAvailable 
      : test.isHomeCollectionAvailable;
    test.homeCollectionCharge = req.body.homeCollectionCharge || test.homeCollectionCharge;
    test.isActive = req.body.isActive !== undefined ? req.body.isActive : test.isActive;
    
    if (req.body.parameters) {
      test.parameters = req.body.parameters;
    }

    const updatedTest = await test.save();
    res.json(updatedTest);
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
});

// @desc    Delete test
// @route   DELETE /api/tests/:id
// @access  Private/Admin
const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (test) {
    test.isActive = false;
    await test.save();
    res.json({ message: 'Test deactivated' });
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
});

// @desc    Get test categories
// @route   GET /api/tests/categories/list
// @access  Public
const getTestCategories = asyncHandler(async (req, res) => {
  const categories = await Test.distinct('category');
  res.json(categories);
});

// ========== TEST BOOKINGS ==========

// @desc    Create test booking
// @route   POST /api/tests/bookings
// @access  Private
const createTestBooking = asyncHandler(async (req, res) => {
  const {
    tests,
    bookingDate,
    bookingTime,
    collectionType,
    collectionAddress,
    notes
  } = req.body;

  // Calculate total amount
  let totalAmount = 0;
  const testItems = [];

  for (const item of tests) {
    const test = await Test.findById(item.testId);
    if (!test) {
      res.status(404);
      throw new Error(`Test not found: ${item.testId}`);
    }
    if (!test.isActive) {
      res.status(400);
      throw new Error(`Test not available: ${test.name}`);
    }
    
    totalAmount += test.price;
    testItems.push({
      test: test._id,
      price: test.price
    });
  }

  // Add home collection charge if applicable
  if (collectionType === 'home') {
    const firstTest = await Test.findById(tests[0].testId);
    if (firstTest && firstTest.isHomeCollectionAvailable) {
      totalAmount += firstTest.homeCollectionCharge || 0;
    }
  }

  const testBooking = await TestBooking.create({
    patient: req.user._id,
    tests: testItems,
    bookingDate,
    bookingTime,
    collectionType,
    collectionAddress: collectionType === 'home' ? collectionAddress : undefined,
    totalAmount,
    notes,
    status: 'pending'
  });

  const populatedBooking = await TestBooking.findById(testBooking._id)
    .populate('patient', 'name email phone')
    .populate('tests.test', 'name category price');

  // Send SMS notification
  const testNames = testItems.length > 1 
    ? `${testItems.length} tests` 
    : (await Test.findById(testItems[0].test)).name;
  const dateStr = moment(bookingDate).format('DD MMM YYYY');
  const smsMessage = smsTemplates.testBooked(
    req.user.name,
    testNames,
    dateStr,
    bookingTime
  );
  await sendSMS(req.user.phone, smsMessage);

  res.status(201).json(populatedBooking);
});

// @desc    Get all test bookings
// @route   GET /api/tests/bookings
// @access  Private
const getTestBookings = asyncHandler(async (req, res) => {
  const { status, patient, date, page = 1, limit = 10 } = req.query;

  const query = {};

  // If user is patient, only show their bookings
  if (req.user.role === 'user') {
    query.patient = req.user._id;
  }

  if (status) {
    query.status = status;
  }

  if (patient) {
    query.patient = patient;
  }

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.bookingDate = { $gte: startDate, $lt: endDate };
  }

  const bookings = await TestBooking.find(query)
    .populate('patient', 'name email phone')
    .populate('tests.test', 'name category price')
    .populate('payment')
    .populate('report')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ bookingDate: -1 });

  const count = await TestBooking.countDocuments(query);

  res.json({
    bookings,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count
  });
});

// @desc    Get test booking by ID
// @route   GET /api/tests/bookings/:id
// @access  Private
const getTestBookingById = asyncHandler(async (req, res) => {
  const booking = await TestBooking.findById(req.params.id)
    .populate('patient', 'name email phone dateOfBirth gender address')
    .populate('tests.test', 'name category price preparationInstructions')
    .populate('payment')
    .populate('report')
    .populate('confirmedBy', 'name')
    .populate('assignedTo', 'name');

  if (!booking) {
    res.status(404);
    throw new Error('Test booking not found');
  }

  // Check if user has permission to view
  if (
    req.user.role === 'user' &&
    booking.patient._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json(booking);
});

// @desc    Confirm test booking
// @route   PUT /api/tests/bookings/:id/confirm
// @access  Private/Receptionist/Admin
const confirmTestBooking = asyncHandler(async (req, res) => {
  const booking = await TestBooking.findById(req.params.id)
    .populate('patient', 'name phone')
    .populate('tests.test', 'name');

  if (!booking) {
    res.status(404);
    throw new Error('Test booking not found');
  }

  if (booking.status === 'confirmed') {
    res.status(400);
    throw new Error('Booking already confirmed');
  }

  booking.status = 'confirmed';
  booking.confirmedBy = req.user._id;
  booking.confirmedAt = Date.now();

  const updatedBooking = await booking.save();

  // Send SMS notification
  const testNames = booking.tests.length > 1 
    ? `${booking.tests.length} tests` 
    : booking.tests[0].test.name;
  const dateStr = moment(booking.bookingDate).format('DD MMM YYYY');
  const smsMessage = smsTemplates.testConfirmed(
    booking.patient.name,
    testNames,
    dateStr,
    booking.bookingTime
  );
  await sendSMS(booking.patient.phone, smsMessage);

  res.json(updatedBooking);
});

// @desc    Update test booking status
// @route   PUT /api/tests/bookings/:id
// @access  Private/Receptionist/Admin
const updateTestBooking = asyncHandler(async (req, res) => {
  const booking = await TestBooking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Test booking not found');
  }

  const { status, notes, assignedTo } = req.body;

  if (status) booking.status = status;
  if (notes) booking.notes = notes;
  if (assignedTo) booking.assignedTo = assignedTo;

  if (status === 'sample_collected') {
    booking.sampleCollectedAt = Date.now();
  }

  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});

module.exports = {
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
};
