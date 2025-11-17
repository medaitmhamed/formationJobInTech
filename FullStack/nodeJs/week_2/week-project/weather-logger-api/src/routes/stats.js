const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// GET /api/stats/city/:city - Get city statistics
router.get('/city/:city', statsController.getCityStatistics);

// GET /api/stats/cities - Get cities rankings
router.get('/cities', statsController.getCitiesRankings);

// GET /api/stats/daily/:city - Get daily statistics for a city
router.get('/daily/:city', statsController.getDailyStatistics);

// GET /api/stats/summary - Get global summary
router.get('/summary', statsController.getSummary);

module.exports = router;