const express = require("express");
const router = express.Router();
const paymentControllers = require("../controllers/payment.controller.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const authAndRoleMiddleware = require("../middleware/authAndRoleMiddleware.js");

// Create a new payment (manager)
router.post(
  "/create",
  authAndRoleMiddleware("manager"),
  paymentControllers.createPayment
);

// Get all payments (admin)
router.get(
  "/",
  authAndRoleMiddleware("admin"),
  paymentControllers.getAllPayments
);

// Get payments for a specific company (manager or admin)
router.get(
  "/company/:companyId",
  authAndRoleMiddleware("admin", "manager"),
  paymentControllers.getCompanyPayments
);

module.exports = router;
