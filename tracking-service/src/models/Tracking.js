const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true },
  status: { type: String, required: true },
  currentLocation: { type: String, required: true },
  altitude: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tracking', trackingSchema);