const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const TestBooking = require('../models/TestBooking');
const { sendSMS, smsTemplates } = require('../utils/smsService');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { bookingType, bookingId, amount } = req.body;

  // Validate booking
  let booking;
  if (bookingType === 'appointment') {
    booking = await Appointment.findById(bookingId).populate('doctor', 'consultationFee');
    if (!booking) {
      res.status(404);
      throw new Error('Appointment not found');
    }
    // Verify amount matches consultation fee
    if (amount !== booking.doctor.consultationFee) {
      res.status(400);
      throw new Error('Invalid amount');
    }
  } else if (bookingType === 'test') {
    booking = await TestBooking.findById(bookingId);
    if (!booking) {
      res.status(404);
      throw new Error('Test booking not found');
    }
    // Verify amount matches total amount
    if (amount !== booking.totalAmount) {
      res.status(400);
      throw new Error('Invalid amount');
    }
  } else {
    res.status(400);
    throw new Error('Invalid booking type');
  }

  // Check if booking belongs to user
  if (booking.patient.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Create Razorpay order
  const options = {
    amount: amount * 100, // amount in paise
    currency: 'INR',
    receipt: `${bookingType}_${bookingId}`,
    notes: {
      bookingType,
      bookingId: bookingId.toString(),
      userId: req.user._id.toString()
    }
  };

  const order = await razorpay.orders.create(options);

  // Create payment record
  const payment = await Payment.create({
    user: req.user._id,
    bookingType,
    bookingId,
    amount,
    razorpayOrderId: order.id,
    status: 'pending'
  });

  res.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    paymentId: payment._id,
    key: process.env.RAZORPAY_KEY_ID
  });
});

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paymentId
  } = req.body;

  // Verify signature
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpaySignature;

  if (!isAuthentic) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  // Update payment record
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    res.status(404);
    throw new Error('Payment record not found');
  }

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = 'completed';
  payment.paidAt = Date.now();

  await payment.save();

  // Update booking with payment
  if (payment.bookingType === 'appointment') {
    await Appointment.findByIdAndUpdate(payment.bookingId, {
      payment: payment._id
    });
  } else if (payment.bookingType === 'test') {
    await TestBooking.findByIdAndUpdate(payment.bookingId, {
      payment: payment._id
    });
  }

  // Send SMS notification
  const smsMessage = smsTemplates.paymentSuccess(
    req.user.name,
    payment.amount,
    payment.bookingType
  );
  await sendSMS(req.user.phone, smsMessage);

  res.json({
    success: true,
    message: 'Payment verified successfully',
    payment
  });
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('user', 'name email phone');

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Check if user has permission to view
  if (
    req.user.role === 'user' &&
    payment.user._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this payment');
  }

  res.json(payment);
});

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getPayments = asyncHandler(async (req, res) => {
  const { status, user, bookingType, page = 1, limit = 10 } = req.query;

  const query = {};

  // If user is patient, only show their payments
  if (req.user.role === 'user') {
    query.user = req.user._id;
  }

  if (status) {
    query.status = status;
  }

  if (user) {
    query.user = user;
  }

  if (bookingType) {
    query.bookingType = bookingType;
  }

  const payments = await Payment.find(query)
    .populate('user', 'name email phone')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Payment.countDocuments(query);

  res.json({
    payments,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count
  });
});

// @desc    Refund payment
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
const refundPayment = asyncHandler(async (req, res) => {
  const { refundAmount, refundReason } = req.body;

  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  if (payment.status !== 'completed') {
    res.status(400);
    throw new Error('Can only refund completed payments');
  }

  if (payment.status === 'refunded') {
    res.status(400);
    throw new Error('Payment already refunded');
  }

  // Process refund with Razorpay
  try {
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: (refundAmount || payment.amount) * 100, // amount in paise
      notes: {
        reason: refundReason
      }
    });

    payment.status = 'refunded';
    payment.refundAmount = refundAmount || payment.amount;
    payment.refundReason = refundReason;
    payment.refundedAt = Date.now();

    await payment.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      payment,
      refund
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Refund failed: ${error.message}`);
  }
});

// @desc    Get payment statistics
// @route   GET /api/payments/stats/dashboard
// @access  Private/Admin
const getPaymentStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Today's revenue
  const todayPayments = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paidAt: { $gte: today }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  // This month's revenue
  const monthPayments = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paidAt: { $gte: thisMonth }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  // Total revenue
  const totalPayments = await Payment.aggregate([
    {
      $match: {
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    today: {
      revenue: todayPayments[0]?.total || 0,
      count: todayPayments[0]?.count || 0
    },
    thisMonth: {
      revenue: monthPayments[0]?.total || 0,
      count: monthPayments[0]?.count || 0
    },
    total: {
      revenue: totalPayments[0]?.total || 0,
      count: totalPayments[0]?.count || 0
    }
  });
});

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentById,
  getPayments,
  refundPayment,
  getPaymentStats
};
