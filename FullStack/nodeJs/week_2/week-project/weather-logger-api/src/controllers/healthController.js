const { loadWeatherData } = require('../services/weatherService');

/**
 * Check API health status
 */
async function checkHealth(req, res) {
  try {
    const data = await loadWeatherData();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      dataLoaded: !!data,
      observationsCount: data?.observations?.length || 0,
      memoryUsage: {
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}

/**
 * Simple ping endpoint
 */
function ping(req, res) {
  res.json({ 
    status: 'pong', 
    timestamp: new Date().toISOString() 
  });
}

module.exports = {
  checkHealth,
  ping
};