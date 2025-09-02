const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.controller.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const authAndRoleMiddleware = require("../middleware/authAndRoleMiddleware.js");

// Get all users
router.get("/all", userControllers.getAllUsers);

// Create new user
router.post("/create", userControllers.createUser);

// Get user by ID
router.get("/:id", userControllers.getUserById);

// Update user
router.put("/:id", userControllers.updateUser);

// Delete user
router.delete("/:id", userControllers.deleteUser);

// Clear all users (admin only)
router.delete(
    "/clear",
    //   authAndRoleMiddleware("admin"),
    userControllers.clearAllUsers
);

module.exports = router;