const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    // Source context
    sensor_data_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SensorData",
        required: true,
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    // Optional specific user that triggered/owns this alert (e.g., creator)
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },

    // What happened
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ["threshold_breach", "anomaly", "info", "warning", "critical"],
        default: "threshold_breach",
    },
    metric: {
        type: String, // e.g., temperature, humidity
        required: true,
    },
    value: {
        type: Number, // current sensor reading
    },
    threshold: {
        type: Number, // configured threshold from company.config
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium",
    },

    // Who should see this alert
    audience_roles: {
        type: [String], // ["manager", "staff", "employee"]
        default: ["manager", "staff", "employee"],
    },
    // Optional explicit recipients
    recipient_user_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, ],

    // Lifecycle
    status: {
        type: String,
        enum: ["new", "acknowledged", "resolved"],
        default: "new",
    },
    acknowledged_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    acknowledged_at: { type: Date },
    resolved_at: { type: Date },

    sent_at: { type: Date, default: Date.now },
});

// Helpful indexes for querying alerts per company and by freshness
alertSchema.index({ company_id: 1, sent_at: -1 });
alertSchema.index({ company_id: 1, status: 1 });

module.exports = mongoose.model("Alert", alertSchema);