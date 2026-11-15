const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const pingRoutes = require('./routes/pingRoutes');
const historyRoutes = require('./routes/historyRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const alertRoutes = require('./routes/alertRoutes');
const flatRoutes = require('./routes/flatRoutes');

const app = express();

// Security and standard middlewares: Dynamic CORS reflector (supports localhost, Vercel, Render)
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Controlled rate limiter: 300 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api/', limiter);

// Welcome root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'NetPulse Telemetry & FLAT Monitoring API',
    version: '1.0.0',
    documentation: 'https://github.com/vetrivel2203/network-monitoring-dashboard#api-documentation',
    endpoints: {
      health: '/api/health',
      overview: '/api/ping/overview',
      probe: 'POST /api/ping/probe',
      analytics: '/api/analytics',
      history: '/api/history',
      alerts: '/api/alerts/active',
      flat: '/api/flat/(dfa|nfa|regex|cfg|pda|turing)'
    }
  });
});

// Health check endpoint (accessible at both /api/health and /health)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Network Monitoring & FLAT Telemetry API',
    version: '1.0.0'
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Mount API routes
app.use('/api/ping', pingRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/flat', flatRoutes);

// 404 handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;