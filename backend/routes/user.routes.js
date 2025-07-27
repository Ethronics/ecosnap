const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.controller.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const authAndRoleMiddleware = require("../middleware/authAndRoleMiddleware.js");

router.get("/all", userControllers.getAllUsers);
router.delete(
  "/clear",
  //   authAndRoleMiddleware("admin"),
  userControllers.clearAllUsers
);

module.exports = router;
