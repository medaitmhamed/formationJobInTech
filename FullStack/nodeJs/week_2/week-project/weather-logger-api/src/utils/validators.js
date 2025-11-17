const VALID_CONDITIONS = ['clear', 'clouds', 'rain', 'storm', 'snow'];
const VALID_SORT_FIELDS = ['timestamp', 'tempC', 'humidity', 'windSpeed', 'city', 'country'];
const VALID_UNITS = ['metric', 'imperial'];

function validateDateRange(from, to) {
  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new Error('Invalid date format. Use ISO 8601 format.');
    }
    
    if (fromDate >= toDate) {
      throw new Error('from date must be before to date');
    }
  }
  return true;
}

function validatePagination(page, limit) {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  
  if (pageNum < 1) {
    throw new Error('page must be >= 1');
  }
  
  if (limitNum < 1 || limitNum > 200) {
    throw new Error('limit must be between 1 and 200');
  }
  
  return { page: pageNum, limit: limitNum };
}

function validateSort(sort) {
  if (!sort) return null;
  
  const sortFields = sort.split(',').map(s => s.trim());
  const parsed = [];
  
  for (const field of sortFields) {
    const [fieldName, order = 'asc'] = field.split(':');
    
    if (!VALID_SORT_FIELDS.includes(fieldName)) {
      throw new Error(`Invalid sort field: ${fieldName}. Valid fields: ${VALID_SORT_FIELDS.join(', ')}`);
    }
    
    if (!['asc', 'desc'].includes(order)) {
      throw new Error(`Invalid sort order: ${order}. Use asc or desc`);
    }
    
    parsed.push({ field: fieldName, order });
  }
  
  return parsed;
}

function validateConditions(conditions) {
  if (!conditions) return null;
  
  const conditionList = Array.isArray(conditions) ? conditions : [conditions];
  
  for (const condition of conditionList) {
    if (!VALID_CONDITIONS.includes(condition)) {
      throw new Error(`Invalid condition: ${condition}. Valid conditions: ${VALID_CONDITIONS.join(', ')}`);
    }
  }
  
  return conditionList;
}

function validateUnits(units) {
  if (!units) return 'metric';
  
  if (!VALID_UNITS.includes(units)) {
    throw new Error(`Invalid units: ${units}. Valid units: ${VALID_UNITS.join(', ')}`);
  }
  
  return units;
}

function validateTemperature(temp, label) {
  if (temp === undefined || temp === null) return null;
  const num = parseFloat(temp);
  if (isNaN(num)) {
    throw new Error(`Invalid ${label}: must be a number`);
  }
  return num;
}

module.exports = {
  VALID_CONDITIONS,
  VALID_SORT_FIELDS,
  VALID_UNITS,
  validateDateRange,
  validatePagination,
  validateSort,
  validateConditions,
  validateUnits,
  validateTemperature
};