const mongoose = require('mongoose');
const AlertConfig = require('../models/AlertConfig');
const PingRecord = require('../models/PingRecord');
const { isInMemoryFallback, memoryStore } = require('../config/db');

function isDbReady() {
  return !isInMemoryFallback() && mongoose.connection.readyState === 1;
}

async function getEffectiveConfig() {
  if (!isDbReady()) {
    return memoryStore.alertConfigs;
  }
  let config = await AlertConfig.findOne();
  if (!config) {
    config = await AlertConfig.create({
      latencyThresholdMs: 150,
      packetLossThresholdPercent: 5,
      jitterThresholdMs: 30,
      notificationSound: true,
      emailAlert: false
    });
  }
  return config;
}

exports.getSettings = async (req, res) => {
  try {
    const config = await getEffectiveConfig();
    return res.status(200).json({ success: true, data: config });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { latencyThresholdMs, packetLossThresholdPercent, jitterThresholdMs, notificationSound, emailAlert } = req.body;

    const updates = {
      latencyThresholdMs: Number(latencyThresholdMs) || 150,
      packetLossThresholdPercent: Number(packetLossThresholdPercent) || 5,
      jitterThresholdMs: Number(jitterThresholdMs) || 30,
      notificationSound: Boolean(notificationSound),
      emailAlert: Boolean(emailAlert),
      updatedAt: new Date()
    };

    if (!isDbReady()) {
      memoryStore.alertConfigs = { ...memoryStore.alertConfigs, ...updates };
      return res.status(200).json({ success: true, data: memoryStore.alertConfigs, message: 'Settings updated successfully.' });
    }

    let config = await AlertConfig.findOne();
    if (!config) {
      config = await AlertConfig.create(updates);
    } else {
      Object.assign(config, updates);
      await config.save();
    }

    return res.status(200).json({ success: true, data: config, message: 'Settings updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getActiveAlerts = async (req, res) => {
  try {
    const config = await getEffectiveConfig();

    let recentProbes = [];
    if (!isDbReady()) {
      recentProbes = memoryStore.pingRecords.slice(0, 10);
    } else {
      recentProbes = await PingRecord.find().sort({ timestamp: -1 }).limit(10).lean();
    }

    const alerts = [];

    if (recentProbes.length > 0) {
      const latest = recentProbes[0];

      if (latest.status === 'OFFLINE') {
        alerts.push({
          id: 'alert_offline_' + Date.now(),
          type: 'CRITICAL',
          title: 'Target Unreachable (100% Packet Loss)',
          message: `Host ${latest.target} (${latest.ip}) failed to respond to ICMP probes.`,
          timestamp: latest.timestamp,
          metric: 'Packet Loss',
          value: '100%'
        });
      } else {
        if (latest.latencyMs > config.latencyThresholdMs) {
          alerts.push({
            id: 'alert_lat_' + Date.now(),
            type: 'WARNING',
            title: 'High Latency Detected',
            message: `Current latency ${latest.latencyMs}ms exceeds configured threshold of ${config.latencyThresholdMs}ms.`,
            timestamp: latest.timestamp,
            metric: 'Latency',
            value: `${latest.latencyMs}ms`
          });
        }

        if (latest.packetLossPercent > config.packetLossThresholdPercent) {
          alerts.push({
            id: 'alert_loss_' + Date.now(),
            type: 'WARNING',
            title: 'Packet Loss Threshold Exceeded',
            message: `Current packet loss is ${latest.packetLossPercent}%, exceeding threshold of ${config.packetLossThresholdPercent}%.`,
            timestamp: latest.timestamp,
            metric: 'Packet Loss',
            value: `${latest.packetLossPercent}%`
          });
        }

        if (latest.jitterMs > config.jitterThresholdMs) {
          alerts.push({
            id: 'alert_jit_' + Date.now(),
            type: 'INFO',
            title: 'Elevated Network Jitter',
            message: `RFC 3550 Jitter variance is ${latest.jitterMs}ms, exceeding threshold of ${config.jitterThresholdMs}ms.`,
            timestamp: latest.timestamp,
            metric: 'Jitter',
            value: `${latest.jitterMs}ms`
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        activeAlerts: alerts,
        thresholds: config,
        alertCount: alerts.length
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};