const mongoose = require("mongoose");
require("dotenv").config();
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const connectDB = async() => {
    try {
        console.log("Attempting to connect with URI:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
            tls: true,
            retryWrites: true,
        });
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.error("❌ Failed to connect:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;