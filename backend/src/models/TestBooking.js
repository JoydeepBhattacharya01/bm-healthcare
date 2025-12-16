const mongoose = require('mongoose');

const testBookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true
  },
  patientName: {
    type: String,
    required: [true, 'Please add patient name'],
    trim: true
  },
  patientMobile: {
    type: String,
    required: [true, 'Please add mobile number'],
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit mobile number']
  },
  patientEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
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

// Generate unique booking ID before saving
testBookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingId = `TST${timestamp}${random}`;
  }
  next();
});

// Index for efficient queries
testBookingSchema.index({ patientMobile: 1, bookingDate: 1 });
testBookingSchema.index({ status: 1 });
testBookingSchema.index({ bookingId: 1 });

module.exports = mongoose.model('TestBooking', testBookingSchema);
