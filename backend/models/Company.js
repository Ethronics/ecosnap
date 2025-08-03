const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  manager: {
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  employees: { type: Array, required: true },
  domain: {
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain",
      required: true,
    },
  },
  domains: [
    {
      domainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Domain",
        required: true,
      },
      place: {
        type: String,
        required: true,
      },
    },
  ],
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Company", companySchema);
