const { loadWeatherData, filterObservations } = require('./weatherService');
const { convertTemperature } = require('../utils/converters');

function calculateStats(values) {
  if (values.length === 0) return { min: 0, max: 0, avg: 0 };
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  return {
    min: parseFloat(min.toFixed(2)),
    max: parseFloat(max.toFixed(2)),
    avg: parseFloat(avg.toFixed(2))
  };
}

function createConditionsHistogram(observations) {
  const histogram = {};
  
  observations.forEach(obs => {
    const condition = obs.conditions || 'unknown';
    histogram[condition] = (histogram[condition] || 0) + 1;
  });
  
  return histogram;
}

async function getCityStats(city, filters, units = 'metric') {
  const data = await loadWeatherData();
  let observations = data.observations || [];
  
  observations = observations.filter(obs => obs.city.toLowerCase() === city.toLowerCase());
  observations = filterObservations(observations, filters);
  
  if (observations.length === 0) {
    return null;
  }
  
  const temps = observations.map(obs => obs.tempC);
  const humidity = observations.map(obs => obs.humidity);
  const windSpeeds = observations.map(obs => obs.wind?.speed || 0);
  
  const tempStats = calculateStats(temps);
  const humidityStats = calculateStats(humidity);
  const windStats = calculateStats(windSpeeds);
  
  // Convert temperatures if needed
  if (units === 'imperial') {
    tempStats.min = convertTemperature(tempStats.min, units);
    tempStats.max = convertTemperature(tempStats.max, units);
    tempStats.avg = convertTemperature(tempStats.avg, units);
  }
  
  return {
    city,
    count: observations.length,
    temperature: tempStats,
    humidity: humidityStats,
    windSpeed: windStats,
    conditions: createConditionsHistogram(observations),
    units: units === 'imperial' ? '°F' : '°C'
  };
}

async function getCitiesRanking(metric = 'avgTemp', filters = {}, units = 'metric') {
  const data = await loadWeatherData();
  let observations = data.observations || [];
  
  observations = filterObservations(observations, filters);
  
  // Group by city
  const cityGroups = {};
  
  observations.forEach(obs => {
    if (!cityGroups[obs.city]) {
      cityGroups[obs.city] = [];
    }
    cityGroups[obs.city].push(obs);
  });
  
  // Calculate metrics for each city
  const rankings = Object.entries(cityGroups).map(([city, cityObs]) => {
    const temps = cityObs.map(o => o.tempC);
    const humidity = cityObs.map(o => o.humidity);
    const windSpeeds = cityObs.map(o => o.wind?.speed || 0);
    
    let value;
    switch(metric) {
      case 'avgTemp':
        value = temps.reduce((s, v) => s + v, 0) / temps.length;
        if (units === 'imperial') value = convertTemperature(value, units);
        break;
      case 'maxTemp':
        value = Math.max(...temps);
        if (units === 'imperial') value = convertTemperature(value, units);
        break;
      case 'minTemp':
        value = Math.min(...temps);
        if (units === 'imperial') value = convertTemperature(value, units);
        break;
      case 'avgHumidity':
        value = humidity.reduce((s, v) => s + v, 0) / humidity.length;
        break;
      case 'avgWindSpeed':
        value = windSpeeds.reduce((s, v) => s + v, 0) / windSpeeds.length;
        break;
      default:
        value = temps.reduce((s, v) => s + v, 0) / temps.length;
    }
    
    return {
      city,
      country: cityObs[0].country,
      value: parseFloat(value.toFixed(2)),
      count: cityObs.length
    };
  });
  
  // Sort by value descending
  rankings.sort((a, b) => b.value - a.value);
  
  return {
    metric,
    rankings,
    units: metric.includes('Temp') ? (units === 'imperial' ? '°F' : '°C') : (metric.includes('Humidity') ? '%' : 'm/s')
  };
}

async function getDailyStats(city, filters = {}, units = 'metric') {
  const data = await loadWeatherData();
  let observations = data.observations || [];
  
  observations = observations.filter(obs => obs.city.toLowerCase() === city.toLowerCase());
  observations = filterObservations(observations, filters);
  
  // Group by day
  const dailyGroups = {};
  
  observations.forEach(obs => {
    const date = new Date(obs.timestamp).toISOString().split('T')[0];
    if (!dailyGroups[date]) {
      dailyGroups[date] = [];
    }
    dailyGroups[date].push(obs);
  });
  
  // Calculate stats for each day
  const dailyStats = Object.entries(dailyGroups).map(([date, dayObs]) => {
    const temps = dayObs.map(o => o.tempC);
    const humidity = dayObs.map(o => o.humidity);
    const windSpeeds = dayObs.map(o => o.wind?.speed || 0);
    
    const tempStats = calculateStats(temps);
    const humidityStats = calculateStats(humidity);
    const windStats = calculateStats(windSpeeds);
    
    if (units === 'imperial') {
      tempStats.min = convertTemperature(tempStats.min, units);
      tempStats.max = convertTemperature(tempStats.max, units);
      tempStats.avg = convertTemperature(tempStats.avg, units);
    }
    
    return {
      date,
      count: dayObs.length,
      temperature: tempStats,
      humidity: humidityStats,
      windSpeed: windStats,
      conditions: createConditionsHistogram(dayObs)
    };
  });
  
  // Sort by date
  dailyStats.sort((a, b) => a.date.localeCompare(b.date));
  
  return {
    city,
    daily: dailyStats,
    units: units === 'imperial' ? '°F' : '°C'
  };
}

async function getGlobalSummary(filters = {}, units = 'metric') {
  const data = await loadWeatherData();
  let observations = data.observations || [];
  
  observations = filterObservations(observations, filters);
  
  if (observations.length === 0) {
    return {
      totalObservations: 0,
      cities: 0,
      countries: 0
    };
  }
  
  const temps = observations.map(obs => obs.tempC);
  const humidity = observations.map(obs => obs.humidity);
  const windSpeeds = observations.map(obs => obs.wind?.speed || 0);
  
  const tempStats = calculateStats(temps);
  const humidityStats = calculateStats(humidity);
  const windStats = calculateStats(windSpeeds);
  
  if (units === 'imperial') {
    tempStats.min = convertTemperature(tempStats.min, units);
    tempStats.max = convertTemperature(tempStats.max, units);
    tempStats.avg = convertTemperature(tempStats.avg, units);
  }
  
  const cities = new Set(observations.map(obs => obs.city)).size;
  const countries = new Set(observations.map(obs => obs.country)).size;
  
  return {
    totalObservations: observations.length,
    cities,
    countries,
    temperature: tempStats,
    humidity: humidityStats,
    windSpeed: windStats,
    conditions: createConditionsHistogram(observations),
    units: units === 'imperial' ? '°F' : '°C'
  };
}

module.exports = {
  getCityStats,
  getCitiesRanking,
  getDailyStats,
  getGlobalSummary
};