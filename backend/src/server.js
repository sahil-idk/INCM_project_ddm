require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const participantsRoutes = require('./routes/participants');
const trialsRoutes = require('./routes/trials');
const dataRoutes = require('./routes/data');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    dbConnected: require('mongoose').connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/participants', participantsRoutes);
app.use('/api/trials', trialsRoutes);
app.use('/api/data', dataRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'DDM Experiment API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      participants: '/api/participants',
      trials: '/api/trials',
      data: '/api/data'
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  DDM Experiment API Server`);
  console.log(`========================================`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Port: ${PORT}`);
  console.log(`  API URL: http://localhost:${PORT}`);
  console.log(`========================================\n`);
});

module.exports = app;
