const express = require('express');
const router = express.Router();
const {
  uploadReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  downloadReport
} = require('../controllers/reportController');
const { protect, admin, receptionistOrAdmin } = require('../middleware/authMiddleware');
const { uploadReport: uploadReportMiddleware } = require('../config/cloudinary');

router.route('/')
  .get(protect, getReports)
  .post(protect, receptionistOrAdmin, uploadReportMiddleware.single('report'), uploadReport);

router.route('/:id')
  .get(protect, getReportById)
  .put(protect, receptionistOrAdmin, uploadReportMiddleware.single('report'), updateReport)
  .delete(protect, admin, deleteReport);

router.get('/:id/download', protect, downloadReport);

module.exports = router;
