const mongoose = require('mongoose');

const testBookingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tests: [{
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  bookingDate: {
    type: Date,
    required: [true, 'Please add booking date']
  },
  bookingTime: {
    type: String,
    required: [true, 'Please add booking time']
  },
  collectionType: {
    type: String,
    enum: ['home', 'walkin'],
    default: 'walkin'
  },
  collectionAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'sample_collected', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  confirmedAt: {
    type: Date
  },
  sampleCollectedAt: {
    type: Date
  },
  notes: {
    type: String
  },
  smsNotificationSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
testBookingSchema.index({ patient: 1, bookingDate: 1 });
testBookingSchema.index({ status: 1 });

module.exports = mongoose.model('TestBooking', testBookingSchema);
