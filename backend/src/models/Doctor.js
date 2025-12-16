const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  slotDuration: {
    type: Number,
    default: 30 // minutes
  },
  maxAppointments: {
    type: Number,
    default: 1
  }
});

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add doctor name'],
    trim: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number']
  },
  specialization: {
    type: String,
    required: [true, 'Please add specialization']
  },
  qualifications: {
    type: String,
    required: [true, 'Please add qualifications']
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please add consultation fee']
  },
  image: {
    type: String,
    default: 'default-doctor.jpg'
  },
  bio: {
    type: String
  },
  availableSlots: [timeSlotSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
