const History = require("../models/History");
const mongoose = require("mongoose");

// GET /api/history?companyId=...&domain=...
const getHistoryByCompanyAndDomain = async (req, res) => {
  try {
    const { companyId, domain } = req.query;
    if (!companyId || !domain) {
      return res
        .status(400)
        .json({ message: "companyId and domain are required" });
    }
    const histories = await History.find({
      CompanyId: new mongoose.Types.ObjectId(companyId),
      domain: { $regex: `^${domain}$`, $options: "i" },
    }).sort({ timestamp: -1 });
    res.json({ data: histories });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch history", error: error.message });
  }
};

module.exports = {
  getHistoryByCompanyAndDomain,
};
