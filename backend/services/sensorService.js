const mqtt = require("mqtt");
const WebSocket = require("ws");

class SensorService {
  constructor() {
    this.sensorData = {
      temperature: "N/A",
      humidity: "N/A",
      lastUpdated: "N/A",
      domain: "default",
    };

    this.wss = null;
    this.mqttClient = null;
    this.isConnected = false;
  }

  // Initialize WebSocket server
  initializeWebSocket(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on("connection", (ws) => {
      console.log("Client connected via WebSocket");
      // Send current data to new client
      ws.send(JSON.stringify(this.sensorData));

      ws.on("error", (err) => {
        console.error("WebSocket client error:", err);
      });

      ws.on("close", () => {
        console.log("WebSocket client disconnected");
      });
    });

    this.wss.on("error", (err) => {
      console.error("WebSocket server error:", err);
    });

    console.log("WebSocket server initialized");
  }

  // Connect to MQTT broker
  connectToMQTT() {
    const mqttOptions = {
      host: process.env.MQTT_HOST,
      port: process.env.MQTT_PORT,
      protocol: process.env.MQTT_PROTOCOL,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      clientId: `EnvoInsight_Client_${Math.random().toString(16).slice(3)}`,
      reconnectPeriod: 1000,
    };

    this.mqttClient = mqtt.connect(mqttOptions);

    this.mqttClient.on("connect", () => {
      console.log("✅ Connected to HiveMQ Cloud");
      this.isConnected = true;

      // Subscribe to sensor topics
      const tempTopic = process.env.MQTT_TEMP_TOPIC || "dht11/temperature";
      const humTopic = process.env.MQTT_HUM_TOPIC || "dht11/humidity";

      this.mqttClient.subscribe([tempTopic, humTopic], { qos: 0 }, (err) => {
        if (!err) {
          console.log(`📡 Subscribed to ${tempTopic} and ${humTopic}`);
        } else {
          console.error("❌ MQTT subscription error:", err);
        }
      });
    });

    this.mqttClient.on("message", (topic, message) => {
      const payload = message.toString();
      console.log(`📨 Received ${payload} from ${topic}`);

      try {
        const now = new Date().toLocaleString();
        if (topic.includes("temperature")) {
          this.sensorData.temperature = parseFloat(payload).toFixed(2);
        } else if (topic.includes("humidity")) {
          this.sensorData.humidity = parseFloat(payload).toFixed(2);
        }
        this.sensorData.lastUpdated = now;

        // Broadcast to all WebSocket clients
        this.broadcastSensorData();

        // Store in database (you can add this later)
        this.storeSensorData();
      } catch (err) {
        console.error("❌ Error processing MQTT message:", err);
      }
    });

    this.mqttClient.on("error", (err) => {
      console.error("❌ MQTT error:", err);
      this.isConnected = false;
    });

    this.mqttClient.on("close", () => {
      console.log("🔌 Disconnected from MQTT broker. Reconnecting...");
      this.isConnected = false;
    });
  }

  // Broadcast sensor data to all connected WebSocket clients
  broadcastSensorData() {
    if (this.wss) {
      this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(this.sensorData));
        }
      });
    }
  }

  // Store sensor data in database (placeholder for future implementation)
  async storeSensorData() {
    try {
      // TODO: Implement database storage
      // This could store data in MongoDB or InfluxDB for historical analysis
      console.log("💾 Sensor data stored:", this.sensorData);
    } catch (error) {
      console.error("❌ Error storing sensor data:", error);
    }
  }

  // Get current sensor data
  getCurrentData() {
    return this.sensorData;
  }

  // Get connection status
  getConnectionStatus() {
    return {
      mqtt: this.isConnected,
      websocket: this.wss ? this.wss.clients.size : 0,
    };
  }

  // Disconnect services
  disconnect() {
    if (this.mqttClient) {
      this.mqttClient.end();
    }
    if (this.wss) {
      this.wss.close();
    }
  }
}

module.exports = new SensorService();
