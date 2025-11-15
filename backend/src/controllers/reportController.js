const asyncHandler = require('express-async-handler');
const Report = require('../models/Report');
const TestBooking = require('../models/TestBooking');
const { sendSMS, smsTemplates } = require('../utils/smsService');
const { deleteFile } = require('../config/cloudinary');

// @desc    Upload report
// @route   POST /api/reports
// @access  Private/Receptionist/Admin
const uploadReport = asyncHandler(async (req, res) => {
  const { testBooking, remarks } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  // Check if test booking exists
  const booking = await TestBooking.findById(testBooking)
    .populate('patient', 'name phone')
    .populate('tests.test', 'name');

  if (!booking) {
    res.status(404);
    throw new Error('Test booking not found');
  }

  // Create report
  const report = await Report.create({
    patient: booking.patient._id,
    testBooking: booking._id,
    reportFile: {
      url: req.file.path,
      publicId: req.file.filename,
      filename: req.file.originalname
    },
    uploadedBy: req.user._id,
    remarks
  });

  // Update test booking
  booking.status = 'completed';
  booking.report = report._id;
  await booking.save();

  const populatedReport = await Report.findById(report._id)
    .populate('patient', 'name email phone')
    .populate('testBooking')
    .populate('uploadedBy', 'name');

  // Send SMS notification
  const testNames = booking.tests.length > 1 
    ? `${booking.tests.length} tests` 
    : booking.tests[0].test.name;
  const smsMessage = smsTemplates.reportReady(booking.patient.name, testNames);
  await sendSMS(booking.patient.phone, smsMessage);

  // Mark SMS as sent
  report.smsNotificationSent = true;
  await report.save();

  res.status(201).json(populatedReport);
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
const getReports = asyncHandler(async (req, res) => {
  const { patient, page = 1, limit = 10 } = req.query;

  const query = {};

  // If user is patient, only show their reports
  if (req.user.role === 'user') {
    query.patient = req.user._id;
  }

  if (patient) {
    query.patient = patient;
  }

  const reports = await Report.find(query)
    .populate('patient', 'name email phone')
    .populate('testBooking')
    .populate('uploadedBy', 'name')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ uploadedAt: -1 });

  const count = await Report.countDocuments(query);

  res.json({
    reports,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count
  });
});

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate('patient', 'name email phone')
    .populate({
      path: 'testBooking',
      populate: {
        path: 'tests.test',
        select: 'name category'
      }
    })
    .populate('uploadedBy', 'name');

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Check if user has permission to view
  if (
    req.user.role === 'user' &&
    report.patient._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this report');
  }

  // Mark as viewed if patient is viewing for the first time
  if (req.user.role === 'user' && !report.isViewed) {
    report.isViewed = true;
    report.viewedAt = Date.now();
    await report.save();
  }

  res.json(report);
});

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private/Receptionist/Admin
const updateReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  const { remarks } = req.body;

  // If new file is uploaded, delete old file and update
  if (req.file) {
    // Delete old file from Cloudinary
    await deleteFile(report.reportFile.publicId);

    report.reportFile = {
      url: req.file.path,
      publicId: req.file.filename,
      filename: req.file.originalname
    };
    report.uploadedAt = Date.now();
  }

  if (remarks !== undefined) {
    report.remarks = remarks;
  }

  const updatedReport = await report.save();

  res.json(updatedReport);
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Delete file from Cloudinary
  await deleteFile(report.reportFile.publicId);

  // Update test booking
  await TestBooking.findByIdAndUpdate(report.testBooking, {
    report: null,
    status: 'in_progress'
  });

  await report.deleteOne();

  res.json({ message: 'Report deleted successfully' });
});

// @desc    Download report
// @route   GET /api/reports/:id/download
// @access  Private
const downloadReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Check if user has permission to download
  if (
    req.user.role === 'user' &&
    report.patient.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to download this report');
  }

  // Return the Cloudinary URL for download
  res.json({
    url: report.reportFile.url,
    filename: report.reportFile.filename
  });
});

module.exports = {
  uploadReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  downloadReport
};
