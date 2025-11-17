const express = require('express');
const router = express.Router();
const observationsController = require('../controllers/observationsController');

// GET /api/observations - Get all observations
router.get('/', observationsController.getAllObservations);

// GET /api/observations/:id - Get observation by ID
router.get('/:id', observationsController.getObservation);

// GET /api/observations/export/data - Export observations
router.get('/export/data', observationsController.exportData);

module.exports = router;