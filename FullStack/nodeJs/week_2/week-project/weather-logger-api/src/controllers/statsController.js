const {
  getCityStats,
  getCitiesRanking,
  getDailyStats,
  getGlobalSummary
} = require('../services/statsService');
const {
  validateDateRange,
  validateConditions,
  validateUnits,
  validateTemperature
} = require('../utils/validators');

/**
 * Get statistics for a specific city
 */
async function getCityStatistics(req, res, next) {
  try {
    const { city } = req.params;
    const { from, to, conditions, minTemp, maxTemp, units } = req.query;
    
    validateDateRange(from, to);
    const validConditions = validateConditions(conditions);
    const validUnits = validateUnits(units);
    const validMinTemp = validateTemperature(minTemp, 'minTemp');
    const validMaxTemp = validateTemperature(maxTemp, 'maxTemp');
    
    const filters = {
      from,
      to,
      conditions: validConditions,
      minTemp: validMinTemp,
      maxTemp: validMaxTemp
    };
    
    const stats = await getCityStats(city, filters, validUnits);
    
    if (!stats) {
      const error = new Error(`No data found for city: ${city}`);
      error.statusCode = 404;
      throw error;
    }
    
    res.set({
      'Cache-Control': 'public, max-age=300',
      'ETag': `"${city}-${Date.now()}"`
    });
    
    res.json(stats);
  } catch (error) {
    if (!error.statusCode) error.statusCode = 400;
    next(error);
  }
}

/**
 * Get rankings of cities by metric
 */
async function getCitiesRankings(req, res, next) {
  try {
    const { metric = 'avgTemp', from, to, conditions, minTemp, maxTemp, units } = req.query;
    
    const validMetrics = ['avgTemp', 'maxTemp', 'minTemp', 'avgHumidity', 'avgWindSpeed'];
    if (!validMetrics.includes(metric)) {
      throw new Error(`Invalid metric. Valid options: ${validMetrics.join(', ')}`);
    }
    
    validateDateRange(from, to);
    const validConditions = validateConditions(conditions);
    const validUnits = validateUnits(units);
    const validMinTemp = validateTemperature(minTemp, 'minTemp');
    const validMaxTemp = validateTemperature(maxTemp, 'maxTemp');
    
    const filters = {
      from,
      to,
      conditions: validConditions,
      minTemp: validMinTemp,
      maxTemp: validMaxTemp
    };
    
    const ranking = await getCitiesRanking(metric, filters, validUnits);
    
    res.set({
      'Cache-Control': 'public, max-age=300',
      'ETag': `"cities-${metric}-${Date.now()}"`
    });
    
    res.json(ranking);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
}

/**
 * Get daily statistics for a city
 */
async function getDailyStatistics(req, res, next) {
  try {
    const { city } = req.params;
    const { from, to, conditions, minTemp, maxTemp, units } = req.query;
    
    validateDateRange(from, to);
    const validConditions = validateConditions(conditions);
    const validUnits = validateUnits(units);
    const validMinTemp = validateTemperature(minTemp, 'minTemp');
    const validMaxTemp = validateTemperature(maxTemp, 'maxTemp');
    
    const filters = {
      from,
      to,
      conditions: validConditions,
      minTemp: validMinTemp,
      maxTemp: validMaxTemp
    };
    
    const dailyStats = await getDailyStats(city, filters, validUnits);
    
    if (dailyStats.daily.length === 0) {
      const error = new Error(`No data found for city: ${city}`);
      error.statusCode = 404;
      throw error;
    }
    
    res.set({
      'Cache-Control': 'public, max-age=300',
      'ETag': `"daily-${city}-${Date.now()}"`
    });
    
    res.json(dailyStats);
  } catch (error) {
    if (!error.statusCode) error.statusCode = 400;
    next(error);
  }
}

/**
 * Get global summary statistics
 */
async function getSummary(req, res, next) {
  try {
    const { from, to, conditions, minTemp, maxTemp, units } = req.query;
    
    validateDateRange(from, to);
    const validConditions = validateConditions(conditions);
    const validUnits = validateUnits(units);
    const validMinTemp = validateTemperature(minTemp, 'minTemp');
    const validMaxTemp = validateTemperature(maxTemp, 'maxTemp');
    
    const filters = {
      from,
      to,
      conditions: validConditions,
      minTemp: validMinTemp,
      maxTemp: validMaxTemp
    };
    
    const summary = await getGlobalSummary(filters, validUnits);
    
    res.set({
      'Cache-Control': 'public, max-age=300',
      'ETag': `"summary-${Date.now()}"`
    });
    
    res.json(summary);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
}

module.exports = {
  getCityStatistics,
  getCitiesRankings,
  getDailyStatistics,
  getSummary
};