const Config = require("../models/Config.js");

// threshold_temp: 22,
// threshold_humidity: 55,
// parameters: {
//   temperature: {
//     min: 18,
//     max: 28,
//     optimal: 22,
//   },
//   humidity: {
//     min: 40,
//     max: 70,
//     optimal: 55,
//   },

const UpdateConfig = async (req, res) => {
  try {
    const { domain_id, threshold_temp, threshold_humidity, parameters } =
      req.body;
    const config = await Config.findOneAndUpdate(
      { domain_id },
      {
        threshold_temp,
        threshold_humidity,
        parameters,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Config updated successfully",
      data: config,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Failed to update config",
    });
  }
};

const configControllers = {
  UpdateConfig,
};

module.exports = configControllers;
