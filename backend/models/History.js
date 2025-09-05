const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  CompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  timestamp: { type: Date, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  domain: { type: String, required: true, ref: "Domain" },
});

module.exports = mongoose.model("History", HistorySchema);
