const Company = require("../models/Company.js");
const User = require("../models/User.js");
const Domain = require("../models/Domain.js");
const bcrypt = require("bcrypt");

// Create a new company
const createCompany = async (req, res) => {
  try {
    const { companyName, managerData, domainId, domains, planId } = req.body;

    // Validate required fields
    if (!companyName || !managerData || !domainId || !planId) {
      return res.status(400).json({
        message:
          "Company name, manager data, domain ID, and plan ID are required",
      });
    }

    // First, create the manager user
    const { name, email, password } = managerData;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Manager name, email, and password are required",
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create the manager user
    const manager = new User({
      name,
      email,
      password_hash,
      role: "manager",
    });

    const savedManager = await manager.save();

    // Verify domain exists
    const domain = await Domain.findById(domainId);
    if (!domain) {
      // Clean up the created manager if domain doesn't exist
      await User.findByIdAndDelete(savedManager._id);
      return res.status(400).json({
        message: "Domain not found",
      });
    }

    // Verify plan exists
    const Plan = require("../models/Plan");
    const plan = await Plan.findById(planId);
    if (!plan) {
      // Clean up the created manager if plan doesn't exist
      await User.findByIdAndDelete(savedManager._id);
      return res.status(400).json({
        message: "Plan not found",
      });
    }

    // Create the company
    const company = new Company({
      companyName,
      manager: {
        reference: savedManager._id,
      },
      employees: [],
      domain: {
        reference: domainId,
      },
      domains: [
        {
          domainId: domainId,
          place: domain.name,
        },
        ...(domains || []),
      ],
      plan: planId,
    });

    const savedCompany = await company.save();

    // Populate the references for response
    const populatedCompany = await Company.findById(savedCompany._id)
      .populate("manager.reference", "name email role")
      .populate("domain.reference", "name description")
      .populate(
        "plan",
        "name price currency period description features limits isPopular"
      );

    res.status(201).json({
      message: "Company created successfully",
      data: populatedCompany,
    });
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({
      message: "Failed to create company",
      error: error.message,
    });
  }
};

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({})
      .populate("manager.reference", "name email role")
      .populate("domain.reference", "name description")
      .populate(
        "plan",
        "name price currency period description features limits isPopular"
      );

    res.status(200).json({
      message: "Companies fetched successfully",
      data: companies,
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({
      message: "Failed to fetch companies",
      error: error.message,
    });
  }
};

// Get company by ID
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id)
      .populate("manager.reference", "name email role")
      .populate("domain.reference", "name description");

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json({
      message: "Company fetched successfully",
      data: company,
    });
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({
      message: "Failed to fetch company",
      error: error.message,
    });
  }
};

// Update company
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const company = await Company.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("manager.reference", "name email role")
      .populate("domain.reference", "name description");

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json({
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({
      message: "Failed to update company",
      error: error.message,
    });
  }
};

// Delete company
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // Delete the manager user as well
    if (company.manager.reference) {
      await User.findByIdAndDelete(company.manager.reference);
    }

    // Delete the company
    await Company.findByIdAndDelete(id);

    res.status(200).json({
      message: "Company and manager deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({
      message: "Failed to delete company",
      error: error.message,
    });
  }
};

// Add employee to company
const addEmployee = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { employeeId } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // Check if employee exists
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    // Add employee to company if not already present
    if (!company.employees.includes(employeeId)) {
      company.employees.push(employeeId);
      await company.save();
    }

    const updatedCompany = await Company.findById(companyId)
      .populate("manager.reference", "name email role")
      .populate("domain.reference", "name description")
      .populate("employees", "name email role");

    res.status(200).json({
      message: "Employee added to company successfully",
      data: updatedCompany,
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({
      message: "Failed to add employee",
      error: error.message,
    });
  }
};

// Remove employee from company
const removeEmployee = async (req, res) => {
  try {
    const { companyId, employeeId } = req.params;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // Remove employee from company
    company.employees = company.employees.filter(
      (emp) => emp.toString() !== employeeId
    );
    await company.save();

    const updatedCompany = await Company.findById(companyId)
      .populate("manager.reference", "name email role")
      .populate("domain.reference", "name description")
      .populate("employees", "name email role");

    res.status(200).json({
      message: "Employee removed from company successfully",
      data: updatedCompany,
    });
  } catch (error) {
    console.error("Error removing employee:", error);
    res.status(500).json({
      message: "Failed to remove employee",
      error: error.message,
    });
  }
};

// Add domain to company
const addDomain = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { domainId, placeName } = req.body;

    if (!domainId || !placeName) {
      return res.status(400).json({
        message: "Domain ID and place name are required",
      });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // Verify domain exists
    const domain = await Domain.findById(domainId);
    if (!domain) {
      return res.status(404).json({
        message: "Domain not found",
      });
    }

    // Check if domain already exists in company's domains array
    const existingDomain = company.domains.find(
      (d) => d.domainId.toString() === domainId
    );
    if (existingDomain) {
      return res.status(400).json({
        message: "Domain already exists in this company",
      });
    }

    // Add domain to company's domains array
    company.domains.push({
      domainId: domainId,
      place: placeName,
    });

    await company.save();

    const updatedCompany = await Company.findById(companyId)
      .populate("manager.reference", "name email role")
      .populate("domain.reference", "name description")
      .populate(
        "plan",
        "name price currency period description features limits isPopular"
      );

    res.status(200).json({
      message: "Domain added to company successfully",
      data: updatedCompany,
    });
  } catch (error) {
    console.error("Error adding domain:", error);
    res.status(500).json({
      message: "Failed to add domain",
      error: error.message,
    });
  }
};

const companyControllers = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  addEmployee,
  removeEmployee,
  addDomain,
};

module.exports = companyControllers;
