const mongoose = require('mongoose');

const AlertConfigSchema = new mongoose.Schema({
  latencyThresholdMs: {
    type: Number,
    default: 150,
    min: 1
  },
  packetLossThresholdPercent: {
    type: Number,
    default: 5,
    min: 0,
    max: 100
  },
  jitterThresholdMs: {
    type: Number,
    default: 30,
    min: 0
  },
  notificationSound: {
    type: Boolean,
    default: true
  },
  emailAlert: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AlertConfig', AlertConfigSchema);