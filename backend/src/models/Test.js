const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add test name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add test description']
  },
  category: {
    type: String,
    required: [true, 'Please add test category'],
    enum: ['Blood Test', 'Urine Test', 'Imaging', 'Cardiac', 'Pathology', 'Health Package', 'Other']
  },
  price: {
    type: Number,
    required: [true, 'Please add test price']
  },
  preparationInstructions: {
    type: String
  },
  reportDeliveryTime: {
    type: String,
    default: '24 hours'
  },
  isHomeCollectionAvailable: {
    type: Boolean,
    default: false
  },
  homeCollectionCharge: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  parameters: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Test', testSchema);
