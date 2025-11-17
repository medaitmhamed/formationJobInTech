const { getObservations, getObservationById, filterObservations, loadWeatherData } = require('../services/weatherService');
const { exportObservations } = require('../services/exportService');
const { convertObservation } = require('../utils/converters');
const {
  validateDateRange,
  validatePagination,
  validateSort,
  validateConditions,
  validateUnits,
  validateTemperature
} = require('../utils/validators');

/**
 * Get all observations with filters, sorting, and pagination
 */
async function getAllObservations(req, res, next) {
  try {
    const { city, country, from, to, sort, page = 1, limit = 20, conditions, minTemp, maxTemp, units } = req.query;
    
    // Validate inputs
    validateDateRange(from, to);
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);
    const sortFields = validateSort(sort);
    const validConditions = validateConditions(conditions);
    const validUnits = validateUnits(units);
    const validMinTemp = validateTemperature(minTemp, 'minTemp');
    const validMaxTemp = validateTemperature(maxTemp, 'maxTemp');
    
    const filters = {
      city,
      country,
      from,
      to,
      conditions: validConditions,
      minTemp: validMinTemp,
      maxTemp: validMaxTemp
    };
    
    const result = await getObservations(filters, sortFields, validPage, validLimit);
    
    // Convert units if needed
    if (validUnits === 'imperial') {
      result.data = result.data.map(obs => convertObservation(obs, validUnits));
    }
    
    // Set cache headers
    res.set({
      'Cache-Control': 'public, max-age=300',
      'ETag': `"${Date.now()}"`,
      'X-Total-Count': result.pagination.total
    });
    
    res.json(result);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
}

/**
 * Get observation by ID
 */
async function getObservation(req, res, next) {
  try {
    const { id } = req.params;
    const { units } = req.query;
    
    const validUnits = validateUnits(units);
    const observation = await getObservationById(id);
    
    if (!observation) {
      const error = new Error('Observation not found');
      error.statusCode = 404;
      throw error;
    }
    
    const result = validUnits === 'imperial' ? convertObservation(observation, validUnits) : observation;
    
    res.set({
      'Cache-Control': 'public, max-age=600',
      'ETag': `"${id}"`
    });
    
    res.json(result);
  } catch (error) {
    if (!error.statusCode) error.statusCode = 400;
    next(error);
  }
}

/**
 * Export observations to file
 */
async function exportData(req, res, next) {
  try {
    const { city, country, from, to, conditions, minTemp, maxTemp, format = 'json', compress = 'false' } = req.query;
    
    validateDateRange(from, to);
    const validConditions = validateConditions(conditions);
    const validMinTemp = validateTemperature(minTemp, 'minTemp');
    const validMaxTemp = validateTemperature(maxTemp, 'maxTemp');
    
    const filters = {
      city,
      country,
      from,
      to,
      conditions: validConditions,
      minTemp: validMinTemp,
      maxTemp: validMaxTemp
    };
    
    const data = await loadWeatherData();
    const filtered = filterObservations(data.observations || [], filters);
    
    const shouldCompress = compress === 'true' || compress === '1';
    const exportFormat = format === 'ndjson' ? 'ndjson' : 'json';
    
    const exported = await exportObservations(filtered, exportFormat, shouldCompress);
    
    const filename = `weather-export-${Date.now()}.${shouldCompress ? 'gz' : exportFormat}`;
    
    res.set({
      'Content-Type': exported.contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': exported.bytes,
      'X-Export-Count': exported.count,
      'X-Export-Bytes': exported.bytes
    });
    
    if (exported.signature) {
      res.set('X-Signature', exported.signature);
    }
    
    res.send(exported.buffer);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
}

module.exports = {
  getAllObservations,
  getObservation,
  exportData
};