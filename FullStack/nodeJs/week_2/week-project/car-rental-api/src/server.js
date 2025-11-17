const express = require('express');
require('dotenv').config();
const carsRoutes = require('./routes/route.cars');
const rentalsRoutes = require('./routes/route.cars');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(express.json());
app.use(express.static('public'))
app.use(logger);

// Routes
app.use('/health', (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api/cars', carsRoutes);
app.use('/api/rentals', rentalsRoutes);


// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});