const fs = require("fs");
const path = require("path");

const envContent = `# MongoDB Connection String
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/envoinsight

# For MongoDB Atlas (replace with your connection string):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/envoinsight

# JWT Secret for token signing (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=development

# Server Port (optional)
PORT=4040

# MQTT Configuration
MQTT_HOST=8b0ebbaf2e3a40928b4b20eb1449c114.s1.eu.hivemq.cloud
MQTT_PORT=8883
MQTT_PROTOCOL=mqtts
MQTT_USERNAME=solomon
MQTT_PASSWORD=Sol@0902305468
MQTT_TEMP_TOPIC=dht11/temperature
MQTT_HUM_TOPIC=dht11/humidity
`;

const envPath = path.join(__dirname, ".env");
try {
  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env file created successfully!");
  console.log("📝 Please update the MONGO_URI with your actual MongoDB connection string");
  console.log("🔑 Please change the JWT_SECRET to a secure random string");
  console.log("📡 MQTT configuration has been added for sensor data");
} catch (error) {
  console.error("❌ Error creating .env file:", error.message);
}
