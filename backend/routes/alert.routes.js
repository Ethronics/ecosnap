const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const AlertController = require("../controllers/alert.controller");

// Get alerts for a company
router.get("/company/:companyId", auth, AlertController.getCompanyAlerts);

// Acknowledge an alert
router.post("/:alertId/acknowledge", auth, AlertController.acknowledgeAlert);

// Resolve an alert
router.post("/:alertId/resolve", auth, AlertController.resolveAlert);

module.exports = router;