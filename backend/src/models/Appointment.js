const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Please add appointment date']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Please add appointment time']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  symptoms: {
    type: String
  },
  notes: {
    type: String
  },
  prescriptionNotes: {
    type: String
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  confirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  confirmedAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
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
appointmentSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingId = `APT${timestamp}${random}`;
  }
  next();
});

// Index for efficient queries
appointmentSchema.index({ patientMobile: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ bookingId: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
