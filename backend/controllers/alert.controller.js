const Alert = require("../models/Alert");

exports.getCompanyAlerts = async(req, res) => {
    try {
        const { companyId } = req.params;
        const alerts = await Alert.find({ company_id: companyId })
            .sort({ sent_at: -1 })
            .lean();
        return res.status(200).json({ message: "Alerts fetched", data: alerts });
    } catch (error) {
        console.error("getCompanyAlerts error:", error);
        return res.status(500).json({ message: "Failed to fetch alerts" });
    }
};

exports.acknowledgeAlert = async(req, res) => {
    try {
        const { alertId } = req.params;
        const userId = req.user?.id || req.user?._id;
        const alert = await Alert.findByIdAndUpdate(
            alertId, { status: "acknowledged", acknowledged_by: userId, acknowledged_at: new Date() }, { new: true }
        ).lean();
        if (!alert) return res.status(404).json({ message: "Alert not found" });
        return res.status(200).json({ message: "Alert acknowledged", data: alert });
    } catch (error) {
        console.error("acknowledgeAlert error:", error);
        return res.status(500).json({ message: "Failed to acknowledge alert" });
    }
};

exports.resolveAlert = async(req, res) => {
    try {
        const { alertId } = req.params;
        const alert = await Alert.findByIdAndUpdate(
            alertId, { status: "resolved", resolved_at: new Date() }, { new: true }
        ).lean();
        if (!alert) return res.status(404).json({ message: "Alert not found" });
        return res.status(200).json({ message: "Alert resolved", data: alert });
    } catch (error) {
        console.error("resolveAlert error:", error);
        return res.status(500).json({ message: "Failed to resolve alert" });
    }
};
