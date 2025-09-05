const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const History = require("../models/History");

dotenv.config();

async function run() {
  try {
    await connectDB();

    const companyIdHex = "68908eef7396b9b202b7e50c";
    const companyObjectId = new mongoose.Types.ObjectId(companyIdHex);

    const domains = ["office", "agricalture"]; // as requested

    const now = new Date();
    const oneHourMs = 60 * 60 * 1000;

    const minTemp = 24;
    const maxTemp = 30;
    const minHumidity = 63;
    const maxHumidity = 70;

    const randomInRange = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const docs = [];

    for (const domain of domains) {
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now.getTime() - (23 - i) * oneHourMs);
        docs.push({
          CompanyId: companyObjectId,
          timestamp,
          temperature: randomInRange(minTemp, maxTemp),
          humidity: randomInRange(minHumidity, maxHumidity),
          domain,
        });
      }
    }

    if (docs.length !== 48) {
      throw new Error(`Expected 48 docs, got ${docs.length}`);
    }

    const result = await History.insertMany(docs);
    console.log(`Inserted ${result.length} history records.`);
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
