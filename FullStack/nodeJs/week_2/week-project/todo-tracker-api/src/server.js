const express = require('express');
require('dotenv').config();
const todoRoutes = require('./routes/todos');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/todos', todoRoutes);


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});