const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  sensor_data_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SensorData",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true },
  sent_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Alert", alertSchema);
