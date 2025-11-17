const { LRUCache } = require('lru-cache');

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
  updateAgeOnGet: true
});

function getCacheKey(params) {
  const { city, country, from, to, sort, page, limit, conditions, minTemp, maxTemp } = params;
  return JSON.stringify({ city, country, from, to, sort, page, limit, conditions, minTemp, maxTemp });
}

module.exports = {
  cache,
  getCacheKey
};