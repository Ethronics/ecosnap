const express = require("express");
const router = express.Router();
const predictController = require("../controllers/predict.controller");

// POST /api/predict/temperature
router.post("/temperature", predictController.predictTemperature);

// POST /api/predict/humidity
router.post("/humidity", predictController.predictHumidity);

module.exports = router;
