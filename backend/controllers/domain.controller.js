const Domain = require("../models/Domain.js");
const Config = require("../models/Config.js");

const createDomain = async (req, res) => {
  try {
    const { name, description } = req.body;
    const domain = await Domain.create({ name, description });

    // Create default config for the new domain
    const defaultConfig = {
      domain_id: domain._id,
      threshold_temp: 22,
      threshold_humidity: 55,
      parameters: {
        temperature: {
          min: 18,
          max: 28,
          optimal: 22,
        },
        humidity: {
          min: 40,
          max: 70,
          optimal: 55,
        },
      },
    };

    const config = await Config.create(defaultConfig);

    res.status(201).json({
      message: "Domain Created Successfully",
      data: {
        domain,
        config,
      },
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Failed to create domain",
    });
  }
};

const getAllDomains = async (req, res) => {
  try {
    const domains = await Domain.find({}).select("-__v");
    //include config
    const domainWithConfig = await Promise.all(
      domains.map(async (domain) => {
        const config = await Config.findOne({ domain_id: domain._id });
        return {
          ...domain._doc,
          config,
        };
      })
    );
    res.status(200).json({
      message: "Domains fetched successfully",
      data: domainWithConfig,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "error getting domains" });
  }
};

const domainControllers = {
  createDomain,
  getAllDomains,
};

module.exports = domainControllers;
