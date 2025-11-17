const fs = require("fs").promises;
const path = require("path");
const { cache, getCacheKey } = require("../utils/cache");

let weatherData = null;
let lastLoadTime = null;

async function loadWeatherData(forceReload = false) {
  const now = Date.now();

  // Cache for 5 minutes
  if (
    !forceReload &&
    weatherData &&
    lastLoadTime &&
    now - lastLoadTime < 300000
  ) {
    return weatherData;
  }

  const dataPath =
    process.env.DATA_FILE || path.join(__dirname, "../../data/weather.json");

  try {
    const data = await fs.readFile(dataPath, "utf-8");
    weatherData = JSON.parse(data);
    lastLoadTime = now;
    return weatherData;
  } catch (error) {
    throw new Error(`Failed to load weather data: ${error.message}`);
  }
}

function filterObservations(observations, filters) {
  return observations.filter((obs) => {
    if (filters.city && obs.city.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }

    if (
      filters.country &&
      obs.country.toLowerCase() !== filters.country.toLowerCase()
    ) {
      return false;
    }

    if (filters.from && new Date(obs.timestamp) < new Date(filters.from)) {
      return false;
    }

    if (filters.to && new Date(obs.timestamp) > new Date(filters.to)) {
      return false;
    }

    if (filters.conditions && filters.conditions.length > 0) {
      if (!filters.conditions.includes(obs.conditions)) {
        return false;
      }
    }

    if (filters.minTemp !== null && obs.tempC < filters.minTemp) {
      return false;
    }

    if (filters.maxTemp !== null && obs.tempC > filters.maxTemp) {
      return false;
    }

    return true;
  });
}

function sortObservations(observations, sortFields) {
  if (!sortFields || sortFields.length === 0) {
    return observations;
  }

  return observations.sort((a, b) => {
    for (const { field, order } of sortFields) {
      let aVal = a[field];
      let bVal = b[field];

      // Handle nested field for wind speed
      if (field === "windSpeed") {
        aVal = a.wind?.speed || 0;
        bVal = b.wind?.speed || 0;
      }

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
    }
    return 0;
  });
}

function paginateObservations(observations, page, limit) {
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = observations.slice(start, end);

  return {
    data,
    pagination: {
      total: observations.length,
      page,
      limit,
      pages: Math.ceil(observations.length / limit),
    },
  };
}

async function getObservations(filters, sortFields, page, limit) {
  const cacheKey = getCacheKey({ ...filters, sort: sortFields, page, limit });
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const data = await loadWeatherData();
  let observations = data.observations || [];

  observations = filterObservations(observations, filters);
  observations = sortObservations(observations, sortFields);

  const result = paginateObservations(observations, page, limit);

  cache.set(cacheKey, result);
  return result;
}

async function getObservationById(id) {
  const data = await loadWeatherData();
  return (data.observations || []).find((obs) => obs.id === id);
}

module.exports = {
  loadWeatherData,
  getObservations,
  getObservationById,
  filterObservations,
  sortObservations,
};