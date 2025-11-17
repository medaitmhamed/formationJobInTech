const express = require('express');
require('dotenv').config();
const logger = require('./middlewares/logger');
const resourcesRoutes = require('./routes/ressourcesRoute');
const timeLimiter = require('./middlewares/timeLimiter');
const auth = require('./middlewares/auth');
const { errorHandler } = require('../AppError');

const DOMAIN = process.env.DOMAIN || 'localhost';
const PORT = process.env.PORT || 3000;
const app = express();

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Middlewares
app.use(express.json());
app.use(logger);
app.use(errorHandler);

// Routes
app.use('/api/ressources', resourcesRoutes);
app.use("/api/private", auth, timeLimiter);


// ecouter sur le port 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://${DOMAIN}:${PORT}`);
});
