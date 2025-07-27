// const fs = require("fs");
// const path = require("path");

// const envContent = `# MongoDB Connection String
// # For local MongoDB:
// MONGO_URI=mongodb://localhost:27017/envosnap

// # For MongoDB Atlas (replace with your connection string):
// # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/envosnap

// # JWT Secret for token signing (change this in production)
// JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

// # Node Environment
// NODE_ENV=development

// # Server Port (optional)
// PORT=3000
// `;

// const envPath = path.join(__dirname, ".env");

// try {
//   fs.writeFileSync(envPath, envContent);
//   console.log("✅ .env file created successfully!");
//   console.log(
//     "📝 Please update the MONGO_URI with your actual MongoDB connection string"
//   );
//   console.log("🔑 Please change the JWT_SECRET to a secure random string");
// } catch (error) {
//   console.error("❌ Error creating .env file:", error.message);
// }
