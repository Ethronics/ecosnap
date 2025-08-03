const Plan = require("../models/Plan");
const User = require("../models/User");

// Get all plans
const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });

    res.status(200).json({
      success: true,
      data: plans,
      message: "Plans retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting plans:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get plan by ID
const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    res.status(200).json({
      success: true,
      data: plan,
      message: "Plan retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create new plan
const createPlan = async (req, res) => {
  try {
    const {
      name,
      price,
      currency,
      period,
      description,
      features,
      limits,
      isPopular,
    } = req.body;

    // Check if plan with same name already exists
    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: "Plan with this name already exists",
      });
    }

    const newPlan = new Plan({
      name,
      price,
      currency,
      period,
      description,
      features,
      limits,
      isPopular,
    });

    const savedPlan = await newPlan.save();

    res.status(201).json({
      success: true,
      data: savedPlan,
      message: "Plan created successfully",
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update plan
const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.created_at;
    updateData.updated_at = Date.now();

    const updatedPlan = await Plan.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedPlan,
      message: "Plan updated successfully",
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete plan (soft delete)
const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // Soft delete by setting isActive to false
    plan.isActive = false;
    plan.updated_at = Date.now();
    await plan.save();

    res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update user's plan
const updateUserPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { planName } = req.body;

    // Validate plan name
    const validPlans = ["Free", "Pro", "Premium"];
    if (!validPlans.includes(planName)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan name. Must be one of: Free, Pro, Premium",
      });
    }

    // Check if plan exists
    const plan = await Plan.findOne({ name: planName, isActive: true });
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // Update user's plan
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { plan: planName },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: updatedUser,
        plan: plan,
      },
      message: "User plan updated successfully",
    });
  } catch (error) {
    console.error("Error updating user plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get user's current plan
const getUserPlan = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const plan = await Plan.findOne({ name: user.plan, isActive: true });

    res.status(200).json({
      success: true,
      data: {
        userPlan: user.plan,
        planDetails: plan,
      },
      message: "User plan retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting user plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Initialize default plans (for seeding)
const initializeDefaultPlans = async (req, res) => {
  try {
    const defaultPlans = [
      {
        name: "Free",
        price: 0,
        currency: "Birr",
        period: "month",
        description: "Perfect for small teams getting started",
        features: [
          "1 domain",
          "5 requests per day",
          "Up to 4 employees",
          "Basic temperature & humidity monitoring",
          "24-hour data retention",
          "Email alerts",
          "Basic dashboard",
          "Community support",
          "AI safety predictions",
        ],
        limits: {
          domains: 1,
          employees: 4,
          requestsPerDay: 5,
          dataRetention: 1,
        },
        isPopular: false,
      },
      {
        name: "Pro",
        price: 9999,
        currency: "Birr",
        period: "month",
        description: "Ideal for growing businesses",
        features: [
          "Up to 3 domains",
          "Up to 10 employees",
          "50 requests per day",
          "Advanced environmental monitoring",
          "30-day data retention",
          "Real-time alerts & notifications",
          "Advanced analytics & reporting",
          "AI safety predictions",
          "Priority support",
          "Custom alert thresholds",
          "Export data & reports",
        ],
        limits: {
          domains: 3,
          employees: 10,
          requestsPerDay: 50,
          dataRetention: 30,
        },
        isPopular: true,
      },
      {
        name: "Premium",
        price: 29999,
        currency: "Birr",
        period: "month",
        description: "Enterprise-grade monitoring solution",
        features: [
          "Up to 10 domains",
          "Up to 100 employees",
          "unlimited daily requests",
          "Domain requests",
          "Multi-domain monitoring",
          "1-year data retention",
          "Custom alert thresholds",
          "Export data & reports",
          "Advanced AI predictions",
          "Custom integrations",
          "API access",
          "Custom compliance reporting",
          "24/7 phone support",
          "On-site training",
        ],
        limits: {
          domains: 10,
          employees: 100,
          requestsPerDay: -1, // unlimited
          dataRetention: 365,
        },
        isPopular: false,
      },
    ];

    // Clear existing plans and create new ones
    await Plan.deleteMany({});

    const createdPlans = await Plan.insertMany(defaultPlans);

    res.status(201).json({
      success: true,
      data: createdPlans,
      message: "Default plans initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing default plans:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  updateUserPlan,
  getUserPlan,
  initializeDefaultPlans,
};
