const mongoose = require("mongoose");
const Plan = require("./models/Plan");
require("dotenv").config();

const initializePlans = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

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

    // Clear existing plans
    await Plan.deleteMany({});
    console.log("✅ Cleared existing plans");

    // Create new plans
    const createdPlans = await Plan.insertMany(defaultPlans);
    console.log(`✅ Created ${createdPlans.length} plans:`);

    createdPlans.forEach((plan) => {
      console.log(
        `   - ${plan.name}: ${plan.price} ${plan.currency}/${plan.period}`
      );
    });

    console.log("✅ Plans initialized successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing plans:", error);
    process.exit(1);
  }
};

initializePlans();
