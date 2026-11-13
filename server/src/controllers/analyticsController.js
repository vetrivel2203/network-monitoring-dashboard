const mongoose = require('mongoose');
const PingRecord = require('../models/PingRecord');
const { isInMemoryFallback, memoryStore } = require('../config/db');

function isDbReady() {
  return !isInMemoryFallback() && mongoose.connection.readyState === 1;
}

exports.getAnalytics = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);

    let records = [];
    if (!isDbReady()) {
      records = memoryStore.pingRecords.slice(0, limit).reverse();
    } else {
      records = await PingRecord.find().sort({ timestamp: -1 }).limit(limit).lean();
      records.reverse(); // Chronological order for charts
    }

    if (records.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          metrics: {
            avgLatency: 0,
            minLatency: 0,
            maxLatency: 0,
            avgPacketLoss: 0,
            avgJitter: 0,
            availability: 100,
            healthScore: 100,
            totalSamples: 0
          },
          chartData: {
            labels: [],
            latency: [],
            packetLoss: [],
            jitter: []
          },
          statusDistribution: {
            ONLINE: 0,
            DEGRADED: 0,
            OFFLINE: 0
          }
        }
      });
    }

    const latencies = records.map(r => r.latencyMs || 0);
    const packetLosses = records.map(r => r.packetLossPercent || 0);
    const jitters = records.map(r => r.jitterMs || 0);
    const labels = records.map(r => {
      const d = new Date(r.timestamp);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    });

    const sumLatency = latencies.reduce((a, b) => a + b, 0);
    const avgLatency = Number((sumLatency / latencies.length).toFixed(1));
    const minLatency = Math.min(...latencies);
    const maxLatency = Math.max(...latencies);

    const avgPacketLoss = Number((packetLosses.reduce((a, b) => a + b, 0) / packetLosses.length).toFixed(1));
    const avgJitter = Number((jitters.reduce((a, b) => a + b, 0) / jitters.length).toFixed(1));

    const statusCounts = { ONLINE: 0, DEGRADED: 0, OFFLINE: 0 };
    records.forEach(r => {
      if (statusCounts[r.status] !== undefined) {
        statusCounts[r.status]++;
      }
    });

    const availability = Number(((statusCounts.ONLINE + (statusCounts.DEGRADED * 0.5)) / records.length * 100).toFixed(1));

    let healthScore = 100 - (avgPacketLoss * 3) - (Math.min(avgLatency, 200) * 0.15) - (Math.min(avgJitter, 50) * 0.4);
    healthScore = Math.max(Math.min(Math.round(healthScore), 100), 0);

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          avgLatency,
          minLatency,
          maxLatency,
          avgPacketLoss,
          avgJitter,
          availability,
          healthScore,
          totalSamples: records.length
        },
        chartData: {
          labels,
          latency: latencies,
          packetLoss: packetLosses,
          jitter: jitters
        },
        statusDistribution: statusCounts
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};