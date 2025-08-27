const Payment = require("../models/Payment");
const Company = require("../models/Company");
const Plan = require("../models/Plan");
const User = require("../models/User");

// Create a new payment
const createPayment = async (req, res) => {
  try {
    const {
      companyId,
      planId,
      managerId,
      amount,
      paymentMethod,
      transactionId,
      status,
    } = req.body;

    // Basic validation
    if (
      !companyId ||
      !planId ||
      !managerId ||
      !amount ||
      !paymentMethod ||
      !transactionId ||
      !status
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify existence of related documents
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return res.status(404).json({ message: "Manager not found" });
    }

    const newPayment = new Payment({
      companyId,
      planId,
      managerId,
      amount,
      paymentMethod,
      transactionId,
      status,
    });

    const savedPayment = await newPayment.save();

    // If payment is successful, update the company's plan
    if (status === "completed") {
      company.plan = planId;
      await company.save();
    }

    res.status(201).json({
      message: "Payment created successfully",
      data: savedPayment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

// Get all payments (for admin)
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate("companyId", "companyName")
      .populate("planId", "name price")
      .populate("managerId", "name email");

    res.status(200).json({
      message: "Payments fetched successfully",
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

// Get payments for a specific company
const getCompanyPayments = async (req, res) => {
  try {
    const { companyId } = req.params;
    const payments = await Payment.find({ companyId })
      .populate("planId", "name price")
      .populate("managerId", "name email");

    if (!payments) {
      return res
        .status(404)
        .json({ message: "No payments found for this company" });
    }

    res.status(200).json({
      message: "Company payments fetched successfully",
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching company payments:", error);
    res.status(500).json({
      message: "Failed to fetch company payments",
      error: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getCompanyPayments,
};
