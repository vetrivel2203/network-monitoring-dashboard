const mongoose = require('mongoose');
const pingEngine = require('../services/pingEngine');
const PingRecord = require('../models/PingRecord');
const { isInMemoryFallback, memoryStore } = require('../config/db');

function isDbReady() {
  return !isInMemoryFallback() && mongoose.connection.readyState === 1;
}

/**
 * Controller for ICMP probe operations
 */
exports.executePing = async (req, res) => {
  try {
    const { target, count, timeoutMs, isDemo } = req.body;

    if (!target) {
      return res.status(400).json({ success: false, message: 'Target hostname or IP is required.' });
    }

    const telemetry = await pingEngine.probe(target, count || 4, timeoutMs || 3000, Boolean(isDemo));

    // Save record to DB if connected, otherwise save to In-Memory store immediately
    let savedRecord = null;
    if (!isDbReady()) {
      const record = {
        _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        ...telemetry,
        timestamp: new Date()
      };
      memoryStore.pingRecords.unshift(record);
      if (memoryStore.pingRecords.length > 500) {
        memoryStore.pingRecords.pop();
      }
      savedRecord = record;
    } else {
      try {
        savedRecord = await PingRecord.create(telemetry);
      } catch (dbErr) {
        console.warn('[PingController] DB write failed, saving to memory:', dbErr.message);
        const record = {
          _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          ...telemetry,
          timestamp: new Date()
        };
        memoryStore.pingRecords.unshift(record);
        savedRecord = record;
      }
    }

    return res.status(200).json({
      success: true,
      data: telemetry,
      recordId: savedRecord ? savedRecord._id : null
    });
  } catch (error) {
    console.error('[PingController] Error:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get current system status & overview stats
 */
exports.getOverviewStats = async (req, res) => {
  try {
    let recentRecords = [];
    let totalRequests = 0;

    if (!isDbReady()) {
      recentRecords = memoryStore.pingRecords.slice(0, 50);
      totalRequests = memoryStore.pingRecords.length;
    } else {
      recentRecords = await PingRecord.find().sort({ timestamp: -1 }).limit(50).lean();
      totalRequests = await PingRecord.countDocuments();
    }

    if (recentRecords.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          currentLatency: 0,
          currentPacketLoss: 0,
          currentJitter: 0,
          availability: 100,
          status: 'ONLINE',
          totalRequests: 0,
          activeTarget: '8.8.8.8',
          isDemo: false,
          recentProbes: []
        }
      });
    }

    const latest = recentRecords[0];
    const avgLatency = Number((recentRecords.reduce((acc, r) => acc + (r.latencyMs || 0), 0) / recentRecords.length).toFixed(1));
    const avgLoss = Number((recentRecords.reduce((acc, r) => acc + (r.packetLossPercent || 0), 0) / recentRecords.length).toFixed(1));
    const avgJitter = Number((recentRecords.reduce((acc, r) => acc + (r.jitterMs || 0), 0) / recentRecords.length).toFixed(1));
    const availability = Number((recentRecords.reduce((acc, r) => acc + (r.availability || 100), 0) / recentRecords.length).toFixed(1));

    return res.status(200).json({
      success: true,
      data: {
        currentLatency: latest.latencyMs,
        currentPacketLoss: latest.packetLossPercent,
        currentJitter: latest.jitterMs,
        availability,
        avgLatency,
        avgLoss,
        avgJitter,
        status: latest.status,
        totalRequests,
        activeTarget: latest.target,
        isDemo: latest.isDemo,
        demoLabel: latest.demoLabel,
        recentProbes: recentRecords.slice(0, 10)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};