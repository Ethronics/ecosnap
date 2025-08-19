# 🔌 Sensor Integration Guide - EnvoInsight AI

This guide explains how to integrate your real DHT11 sensor data into the EnvoInsight AI application.

## 🎯 What's Been Integrated

Your existing MQTT + WebSocket sensor system has been seamlessly integrated into the EnvoInsight AI application:

- **Backend**: MQTT client + WebSocket server for real-time sensor data
- **Frontend**: Real-time sensor data display component
- **Database**: Ready for historical sensor data storage
- **UI**: Maintains your existing beautiful interface design

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install mqtt ws
```

### 2. Create Environment File

```bash
cd backend
node create-env.js
```

This creates a `.env` file with your MQTT credentials and sensor topics.

### 3. Start the Backend

```bash
cd backend
npm run dev
```

The backend will now:
- Connect to your HiveMQ broker
- Subscribe to `dht11/temperature` and `dht11/humidity` topics
- Start WebSocket server for real-time updates
- Expose sensor data via REST API

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

## 📡 How It Works

### Backend Flow
```
DHT11 Sensor → MQTT Broker (HiveMQ) → Backend MQTT Client → WebSocket Server → Frontend
```

### Frontend Flow
```
WebSocket Connection → Real-time Updates → UI Components → Beautiful Dashboards
```

## 🔧 Configuration

### MQTT Settings (in `.env`)
```env
MQTT_HOST=8b0ebbaf2e3a40928b4b20eb1449c114.s1.eu.hivemq.cloud
MQTT_PORT=8883
MQTT_PROTOCOL=mqtts
MQTT_USERNAME=solomon
MQTT_PASSWORD=Sol@0902305468
MQTT_TEMP_TOPIC=dht11/temperature
MQTT_HUM_TOPIC=dht11/humidity
```

### Sensor Topics
- **Temperature**: `dht11/temperature`
- **Humidity**: `dht11/humidity`

## 🎨 UI Components

### RealTimeSensorData Component
A reusable component that displays:
- Real-time temperature and humidity
- Connection status (MQTT + WebSocket)
- Timestamps
- Status indicators (optimal, high, low)

### Usage in Dashboards
```tsx
import { RealTimeSensorData } from '@/components/RealTimeSensorData';

// In your dashboard
<RealTimeSensorData 
  showConnectionStatus={true}
  showTimestamp={true}
  className="mb-8"
/>
```

## 📊 API Endpoints

### Sensor Data
- `GET /api/sensors/current` - Current sensor readings
- `GET /api/sensors/status` - Connection status
- `GET /api/sensors/history` - Historical data (future)

### WebSocket
- `ws://localhost:4040` - Real-time sensor updates

## 🔍 Monitoring & Debugging

### Backend Logs
```
✅ Connected to HiveMQ Cloud
📡 Subscribed to dht11/temperature and dht11/humidity
📨 Received 24.5 from dht11/temperature
📨 Received 65.2 from dht11/humidity
💾 Sensor data stored: { temperature: '24.5', humidity: '65.2', ... }
```

### Frontend Console
```
✅ Connected to sensor WebSocket
📡 Received sensor data: { temperature: '24.5', humidity: '65.2', ... }
```

## 🎯 Integration Points

### 1. Employee Dashboard
- Replaced dummy data with real sensor readings
- Added connection status monitoring
- Real-time updates every second

### 2. Other Dashboards
- Can easily add `RealTimeSensorData` component
- Maintains existing UI design
- Real-time sensor integration

### 3. Future Enhancements
- Historical data charts
- Alert thresholds based on sensor data
- Multi-domain sensor support
- Data export functionality

## 🚨 Troubleshooting

### MQTT Connection Issues
1. Check HiveMQ credentials in `.env`
2. Verify network connectivity
3. Check MQTT topic names

### WebSocket Issues
1. Ensure backend is running on port 4040
2. Check browser console for connection errors
3. Verify CORS settings

### Sensor Data Not Updating
1. Check MQTT subscription logs
2. Verify sensor is publishing to correct topics
3. Check WebSocket connection status

## 🔮 Future Enhancements

### Database Integration
- Store sensor data in MongoDB/InfluxDB
- Historical data analysis
- Trend detection

### Advanced Features
- Custom alert thresholds
- Email/SMS notifications
- Data visualization charts
- Multi-sensor support

### IoT Integration
- Support for multiple sensor types
- Device management
- Remote sensor configuration

## 📱 Testing

### Test Sensor Data
1. Ensure your DHT11 sensor is connected and publishing
2. Check MQTT broker for incoming messages
3. Verify WebSocket connections in browser
4. Monitor real-time updates in dashboard

### Test API Endpoints
```bash
# Test sensor data
curl http://localhost:4040/api/sensors/current

# Test connection status
curl http://localhost:4040/api/sensors/status
```

## 🎉 What You've Achieved

✅ **Real-time sensor integration** - No more dummy data!  
✅ **Maintained UI design** - Your beautiful interface stays intact  
✅ **WebSocket support** - Instant updates without page refresh  
✅ **MQTT integration** - Professional IoT communication  
✅ **Scalable architecture** - Easy to add more sensors  
✅ **Production ready** - Proper error handling and reconnection  

Your EnvoInsight AI application now displays **real environmental data** from your DHT11 sensors while maintaining the professional look and feel you've built! 🌡️💧✨
