const mongoose = require('mongoose');
const PingRecord = require('../models/PingRecord');
const { isInMemoryFallback, memoryStore } = require('../config/db');

function isDbReady() {
  return !isInMemoryFallback() && mongoose.connection.readyState === 1;
}

exports.getHistory = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const search = (req.query.search || '').trim().toLowerCase();
    const status = (req.query.status || '').trim().toUpperCase();

    if (!isDbReady()) {
      let filtered = [...memoryStore.pingRecords];

      if (search) {
        filtered = filtered.filter(r => 
          (r.target && r.target.toLowerCase().includes(search)) ||
          (r.ip && r.ip.toLowerCase().includes(search))
        );
      }

      if (status && ['ONLINE', 'DEGRADED', 'OFFLINE'].includes(status)) {
        filtered = filtered.filter(r => r.status === status);
      }

      const total = filtered.length;
      const startIndex = (page - 1) * limit;
      const records = filtered.slice(startIndex, startIndex + limit);

      return res.status(200).json({
        success: true,
        data: records,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1
        }
      });
    }

    // MongoDB query
    const query = {};
    if (search) {
      query.$or = [
        { target: { $regex: search, $options: 'i' } },
        { ip: { $regex: search, $options: 'i' } }
      ];
    }
    if (status && ['ONLINE', 'DEGRADED', 'OFFLINE'].includes(status)) {
      query.status = status;
    }

    const total = await PingRecord.countDocuments(query);
    const records = await PingRecord.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: records,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportCsv = async (req, res) => {
  try {
    let records = [];
    if (!isDbReady()) {
      records = memoryStore.pingRecords.slice(0, 500);
    } else {
      records = await PingRecord.find().sort({ timestamp: -1 }).limit(1000).lean();
    }

    const headers = [
      'Timestamp',
      'Target',
      'IP',
      'Latency (ms)',
      'Min Latency (ms)',
      'Max Latency (ms)',
      'Packet Loss (%)',
      'Packets Sent',
      'Packets Received',
      'Jitter (ms)',
      'Availability (%)',
      'Status',
      'Is Demo'
    ];

    const rows = records.map(r => [
      `"${new Date(r.timestamp).toISOString()}"`,
      `"${r.target}"`,
      `"${r.ip}"`,
      r.latencyMs,
      r.minLatency,
      r.maxLatency,
      r.packetLossPercent,
      r.packetsSent,
      r.packetsReceived,
      r.jitterMs,
      r.availability,
      `"${r.status}"`,
      r.isDemo ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="network_telemetry_${Date.now()}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    if (!isDbReady()) {
      memoryStore.pingRecords = [];
    } else {
      await PingRecord.deleteMany({});
    }
    return res.status(200).json({ success: true, message: 'History cleared successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};