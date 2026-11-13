const mongoose = require('mongoose');

const PingRecordSchema = new mongoose.Schema({
  target: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  ip: {
    type: String,
    default: 'N/A'
  },
  latencyMs: {
    type: Number,
    required: true
  },
  minLatency: {
    type: Number,
    default: 0
  },
  maxLatency: {
    type: Number,
    default: 0
  },
  packetLossPercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  packetsSent: {
    type: Number,
    default: 4
  },
  packetsReceived: {
    type: Number,
    default: 4
  },
  packetsLost: {
    type: Number,
    default: 0
  },
  jitterMs: {
    type: Number,
    default: 0
  },
  availability: {
    type: Number,
    default: 100
  },
  status: {
    type: String,
    enum: ['ONLINE', 'DEGRADED', 'OFFLINE'],
    default: 'ONLINE',
    index: true
  },
  rttList: [{
    type: Number
  }],
  isDemo: {
    type: Boolean,
    default: false
  },
  demoLabel: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('PingRecord', PingRecordSchema);