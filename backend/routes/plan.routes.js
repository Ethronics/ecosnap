const express = require("express");
const router = express.Router();
const {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  updateUserPlan,
  getUserPlan,
  initializeDefaultPlans,
} = require("../controllers/plan.controller");

// Middleware imports
const authMiddleware = require("../middleware/authMiddleware");
const authAndRoleMiddleware = require("../middleware/authAndRoleMiddleware");

// Public routes (no authentication required)
router.get("/", getAllPlans);
router.get("/:id", getPlanById);

// Admin routes (require authentication and admin role)
router.post("/", authAndRoleMiddleware("admin"), createPlan);
router.put("/:id", authAndRoleMiddleware("admin"), updatePlan);
router.delete("/:id", authAndRoleMiddleware("admin"), deletePlan);
router.post(
  "/initialize",
  authAndRoleMiddleware("admin"),
  initializeDefaultPlans
);

// User plan management routes (require authentication)
router.put("/user/:userId", authMiddleware, updateUserPlan);
router.get("/user/:userId", authMiddleware, getUserPlan);

module.exports = router;
