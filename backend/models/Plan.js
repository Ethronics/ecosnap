const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Free", "Pro", "Premium"],
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  currency: {
    type: String,
    default: "Birr",
  },
  period: {
    type: String,
    default: "month",
  },
  description: {
    type: String,
    required: true,
  },
  features: [
    {
      type: String,
      required: true,
    },
  ],
  limits: {
    domains: { type: Number, default: 1 },
    employees: { type: Number, default: 4 },
    requestsPerDay: { type: Number, default: 5 },
    dataRetention: { type: Number, default: 1 }, // in days
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update the updated_at field before saving
planSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Plan", planSchema);
