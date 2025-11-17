const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const observationRoutes = require('./routes/observations');
const statsRoutes = require('./routes/stats');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middlewares
app.use(helmet());
app.use(cors());

// Compression
app.use(compression());

// Body parser
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Request logging middleware
app.use(requestLogger);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/observations', observationRoutes);
app.use('/api/stats', statsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Weather Logger API',
    version: '1.0.0',
    endpoints: {
      observations: '/api/observations',
      stats: '/api/stats',
      health: '/api/health'
    }
  });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});