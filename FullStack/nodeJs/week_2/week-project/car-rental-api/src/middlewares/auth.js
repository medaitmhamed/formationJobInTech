const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({
      status: 'error',
      message: 'Authorization token required',
      code: 401,
      timestamp: new Date().toISOString()
    });
  }

  const token = authHeader.split(' ')[1];
  
  if (token !== process.env.API_TOKEN) {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid authorization token',
      code: 403,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

module.exports = auth;