require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize Database connection then start server
connectDB().finally(() => {
  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`[NETPULSE-SERVER] Active on http://localhost:${PORT}`);
    console.log(`[NETPULSE-SERVER] Health Check: http://localhost:${PORT}/api/health`);
    console.log(`[NETPULSE-SERVER] ICMP Probe:   POST http://localhost:${PORT}/api/ping/probe`);
    console.log(`[NETPULSE-SERVER] FLAT Labs:    http://localhost:${PORT}/api/flat/*`);
    console.log(`=======================================================`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('[NETPULSE-SERVER] Shutting down gracefully...');
    server.close(() => {
      console.log('[NETPULSE-SERVER] Closed out remaining connections.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
});