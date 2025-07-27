const mongoose = require("mongoose");
require("dotenv").config();

const fixDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get the database
    const db = mongoose.connection.db;

    // Drop problematic indexes
    const indexesToDrop = ["user_id_1", "phone_1"];

    for (const indexName of indexesToDrop) {
      try {
        await db.collection("users").dropIndex(indexName);
        console.log(`✅ Dropped ${indexName} index`);
      } catch (error) {
        console.log(`ℹ️ ${indexName} index doesn't exist or already dropped`);
      }
    }

    // List all indexes to verify
    const indexes = await db.collection("users").indexes();
    console.log(
      "📋 Current indexes:",
      indexes.map((idx) => idx.name)
    );

    console.log("✅ Database fixed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing database:", error);
    process.exit(1);
  }
};

fixDatabase();
