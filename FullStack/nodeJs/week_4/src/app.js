const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { authLimiter, apiLimiter } = require('./middlewares/rateLimit');
const config = require('./config/config');

const authRouter = require('./routes/auth.routes')
const productsRouter = require('./routes/products.routes');
const ordersRouter = require('./routes/orders.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());


let morganFormat = 'tiny';
if (config.logLevel === 'debug') morganFormat = 'dev';
else if (config.logLevel === 'info') morganFormat = 'combined';

app.use(morgan(morganFormat));


app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});
app.use(errorHandler);

module.exports = app;