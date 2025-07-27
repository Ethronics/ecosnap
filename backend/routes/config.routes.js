const express = require("express");
const configControllers = require("../controllers/config.controller");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const authAndRoleMiddleware = require("../middleware/authAndRoleMiddleware.js");

router.put(
  "/update",
  //   authAndRoleMiddleware("admin"),
  configControllers.UpdateConfig
);

module.exports = router;
