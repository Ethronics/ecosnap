const axios = require("axios");
const History = require("../models/History");
const mongoose = require("mongoose");

const getLast24Data = async (companyId, domain, field) => {
  // Log for debugging
  console.log("Querying History with:", { CompanyId: companyId, domain });

  const histories = await History.find({
    CompanyId: new mongoose.Types.ObjectId(companyId),
    domain: { $regex: `^${domain}$`, $options: "i" }, // case-insensitive match
  })
    .sort({ timestamp: -1 })
    .limit(24)
    .select(field);

  return histories.reverse().map((h) => h[field]);
};

const predictTemperature = async (req, res) => {
  try {
    const { companyId, domain } = req.body;
    if (!companyId || !domain) {
      return res
        .status(400)
        .json({ message: "companyId and domain are required" });
    }
    const data = await getLast24Data(companyId, domain, "temperature");
    console.log(data);
    if (data.length < 24) {
      return res
        .status(400)
        .json({ message: "Not enough data for prediction" });
    }
    const response = await axios.post(
      "https://ai-models-production.up.railway.app/predict/temperature",
      { data }
    );
    const denorm = response.data.denorm;
    res.json({ prediction: Number(denorm.toFixed(2)) });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Prediction failed", error: error.message });
    console.log(error);
  }
};

const predictHumidity = async (req, res) => {
  try {
    const { companyId, domain } = req.body;
    if (!companyId || !domain) {
      return res
        .status(400)
        .json({ message: "companyId and domain are required" });
    }
    const data = await getLast24Data(companyId, domain, "humidity");
    if (data.length < 24) {
      return res
        .status(400)
        .json({ message: "Not enough data for prediction" });
    }
    const response = await axios.post(
      "https://ai-models-production.up.railway.app/predict/humidity",
      { data }
    );
    const denorm = response.data.denorm;
    res.json({ prediction: Number(denorm.toFixed(2)) });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Prediction failed", error: error.message });
  }
};

module.exports = {
  predictTemperature,
  predictHumidity,
};
