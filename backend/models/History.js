const mongoose = require("mongoose");

const AiPredictionSchema = new mongoose.Schema(
  {
    condition: { type: String, required: true },
    confidence: { type: Number, required: true },
    recommended_action: { type: String, default: null },
  },
  { _id: false }
);

const HistorySchema = new mongoose.Schema({
  UserId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  device_id: { type: String, required: true },
  timestamp: { type: Date, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  domain: { type: String, required: true, ref: "Domain" },
  ai_prediction: { type: AiPredictionSchema, required: true },
  source: { type: String, required: true },
});

module.exports = mongoose.model("History", HistorySchema);
