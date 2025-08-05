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
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  domains: [
    {
      domainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Domain",
        required: true,
      },
      // Domain information saved directly in company
      name: { type: String, required: true },
      description: { type: String },
      place: {
        type: String,
        required: true,
      },
      config: {
        threshold_temp: { type: Number, required: true },
        threshold_humidity: { type: Number, required: true },
        parameters: { type: mongoose.Schema.Types.Mixed },
        updated_at: { type: Date, default: Date.now },
      },
    },
  ],
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Company", companySchema);
