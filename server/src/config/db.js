const mongoose = require('mongoose');

let isConnected = false;
let isInMemoryFallback = false;

// In-Memory store for when MongoDB Atlas URI is not configured or offline
const memoryStore = {
  pingRecords: [],
  alertConfigs: {
    latencyThresholdMs: 150,
    packetLossThresholdPercent: 5,
    jitterThresholdMs: 30,
    notificationSound: true,
    emailAlert: false,
    updatedAt: new Date()
  },
  flatSessions: []
};

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('cluster0.mongodb.net/network_monitor') && !process.env.MONGODB_URI_REAL) {
    console.log('[Database] No active MongoDB Atlas URI provided in MONGODB_URI.');
    console.log('[Database] Active fallback mode: In-Memory Storage enabled. All telemetry & history will work.');
    isInMemoryFallback = true;
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    isInMemoryFallback = false;
    console.log(`[Database] MongoDB Atlas Connected successfully: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[Database] MongoDB connection error: ${err.message}. Switching to In-Memory Fallback store.`);
    isInMemoryFallback = true;
  }
}

module.exports = {
  connectDB,
  isConnected: () => isConnected,
  isInMemoryFallback: () => isInMemoryFallback,
  memoryStore
};