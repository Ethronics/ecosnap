const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  domain_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },
  threshold_temp: { type: Number, required: true },
  threshold_humidity: { type: Number, required: true },
  parameters: { type: mongoose.Schema.Types.Mixed },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Config", configSchema);
