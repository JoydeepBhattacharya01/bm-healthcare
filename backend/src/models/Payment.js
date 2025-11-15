const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['appointment', 'test'],
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'bookingType'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String
  },
  paidAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  refundAmount: {
    type: Number
  },
  refundReason: {
    type: String
  }
}, {
  timestamps: true
});

// Virtual for booking reference
paymentSchema.virtual('booking', {
  ref: function() {
    return this.bookingType === 'appointment' ? 'Appointment' : 'TestBooking';
  },
  localField: 'bookingId',
  foreignField: '_id',
  justOne: true
});

// Index for efficient queries
paymentSchema.index({ user: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
