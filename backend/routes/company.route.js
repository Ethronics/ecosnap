const express = require("express");
const router = express.Router();
const companyControllers = require("../controllers/company.controller.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const authAndRoleMiddleware = require("../middleware/authAndRoleMiddleware.js");

// Company CRUD operations
router.post("/create", companyControllers.createCompany);
router.get("/all", companyControllers.getAllCompanies);
router.get("/:id", companyControllers.getCompanyById);
router.put("/:id", companyControllers.updateCompany);
router.delete("/:id", companyControllers.deleteCompany);

// Employee management
router.post("/:companyId/employees", companyControllers.addEmployee);
router.delete(
  "/:companyId/employees/:employeeId",
  companyControllers.removeEmployee
);

module.exports = router;
