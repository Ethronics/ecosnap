const express = require("express");
const router = express.Router();
const sensorService = require("../services/sensorService");

// Get current sensor data
router.get("/current", (req, res) => {
  try {
    const data = sensorService.getCurrentData();
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get sensor data",
      error: error.message
    });
  }
});

// Get sensor connection status
router.get("/status", (req, res) => {
  try {
    const status = sensorService.getConnectionStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get sensor status",
      error: error.message
    });
  }
});

// Get historical sensor data (placeholder for future implementation)
router.get("/history", (req, res) => {
  try {
    // TODO: Implement historical data retrieval from database
    res.json({
      success: true,
      message: "Historical data endpoint - to be implemented",
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get historical data",
      error: error.message
    });
  }
});

module.exports = router;
