const express = require('express');
require('dotenv').config();
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const resourcesRoutes = require('./routes/ressourcesRoute');

const DOMAIN = process.env.DOMAIN || 'localhost';
const PORT = process.env.PORT || 3000;
const app = express();


// Middlewares
app.use(express.json());
app.use(logger);
app.use(errorHandler);

// Routes
app.use('/api/ressources', resourcesRoutes);

// ecouter sur le port 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://${DOMAIN}:${PORT}`);
});
