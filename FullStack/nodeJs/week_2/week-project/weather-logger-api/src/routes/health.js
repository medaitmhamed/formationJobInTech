const express = require("express");
const router = express.Router();
const healthController = require("../controllers/healthController");

// GET /api/health - Check API health
router.get("/", healthController.checkHealth);

// GET /api/health/ping - Simple ping
router.get("/ping", healthController.ping);

module.exports = router;
