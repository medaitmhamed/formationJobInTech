const logger = (req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    const { method, url } = req;
    const { statusCode } = res;

    console.log(`[${timestamp}] ${method} ${url} -> ${statusCode} ${duration}ms`);
  });

  next();
};

module.exports = logger;