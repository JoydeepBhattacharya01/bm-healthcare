const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPaymentById,
  getPayments,
  refundPayment,
  getPaymentStats
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

router.get('/', protect, getPayments);
router.get('/stats/dashboard', protect, admin, getPaymentStats);

router.route('/:id')
  .get(protect, getPaymentById);

router.post('/:id/refund', protect, admin, refundPayment);

module.exports = router;
