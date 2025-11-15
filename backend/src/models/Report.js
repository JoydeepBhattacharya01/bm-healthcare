const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestBooking',
    required: true
  },
  reportFile: {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    }
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String
  },
  isViewed: {
    type: Boolean,
    default: false
  },
  viewedAt: {
    type: Date
  },
  smsNotificationSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
reportSchema.index({ patient: 1 });
reportSchema.index({ testBooking: 1 });

module.exports = mongoose.model('Report', reportSchema);
