const express = require("express");
const domainControllers = require("../controllers/domain.controller");
const historyController = require("../controllers/history.controller");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const authAndRoleMiddleware = require("../middleware/authAndRoleMiddleware.js");

router.post(
  "/create",
  //   authAndRoleMiddleware("admin"),
  domainControllers.createDomain
);
router.get(
  "/all",
  //   authAndRoleMiddleware("admin"),
  domainControllers.getAllDomains
);
// New: Fetch history by companyId and domain
router.get("/history", historyController.getHistoryByCompanyAndDomain);

module.exports = router;
