import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Thermometer, 
  Droplets, 
  Wifi, 
  WifiOff,
  Activity,
  Clock
} from "lucide-react";
import useSensorStore from "@/stores/sensorStore";

interface RealTimeSensorDataProps {
  showConnectionStatus?: boolean;
  showTimestamp?: boolean;
  className?: string;
}

export const RealTimeSensorData = ({ 
  showConnectionStatus = true, 
  showTimestamp = true,
  className = ""
}: RealTimeSensorDataProps) => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const {
    sensorData,
    connectionStatus,
    isConnected,
    connectWebSocket,
    disconnectWebSocket,
    fetchCurrentData,
    fetchConnectionStatus
  } = useSensorStore();

  // Connect to WebSocket when component mounts
  useEffect(() => {
    connectWebSocket();
    
    // Fetch initial data
    fetchCurrentData();
    fetchConnectionStatus();
    
    // Set up periodic status checks
    const statusInterval = setInterval(() => {
      fetchConnectionStatus();
    }, 10000); // Check every 10 seconds
    
    // Update last update time
    const updateInterval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);
    
    return () => {
      clearInterval(statusInterval);
      clearInterval(updateInterval);
      disconnectWebSocket();
    };
  }, [connectWebSocket, disconnectWebSocket, fetchCurrentData, fetchConnectionStatus]);

  // Get temperature status color
  const getTemperatureStatus = () => {
    const temp = parseFloat(sensorData.temperature as string);
    if (isNaN(temp)) return "default";
    if (temp < 18) return "cold";
    if (temp > 28) return "hot";
    return "normal";
  };

  // Get humidity status color
  const getHumidityStatus = () => {
    const hum = parseFloat(sensorData.humidity as string);
    if (isNaN(hum)) return "default";
    if (hum < 30) return "low";
    if (hum > 70) return "high";
    return "normal";
  };

  // Get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
      case "hot":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
      case "cold":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100";
      case "low":
        return "bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-100";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Connection Status */}
      {showConnectionStatus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
                Sensor Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge 
                  variant={connectionStatus.mqtt ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  <Activity className="h-3 w-3" />
                  MQTT: {connectionStatus.mqtt ? "Connected" : "Disconnected"}
                </Badge>
                <Badge 
                  variant={isConnected ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  <Wifi className="h-3 w-3" />
                  WebSocket: {isConnected ? "Connected" : "Disconnected"}
                </Badge>
                <Badge variant="outline">
                  Clients: {connectionStatus.websocket}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Sensor Data Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Temperature Card */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500 mb-2">
              {sensorData.temperature !== "N/A" 
                ? `${sensorData.temperature}°C` 
                : "N/A"
              }
            </div>
            <Badge 
              className={`${getStatusBadgeStyle(getTemperatureStatus())} font-medium`}
            >
              {getTemperatureStatus() === "normal" && "Optimal"}
              {getTemperatureStatus() === "hot" && "High"}
              {getTemperatureStatus() === "cold" && "Low"}
              {getTemperatureStatus() === "default" && "Unknown"}
            </Badge>
          </CardContent>
        </Card>

        {/* Humidity Card */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {sensorData.humidity !== "N/A" 
                ? `${sensorData.humidity}%` 
                : "N/A"
              }
            </div>
            <Badge 
              className={`${getStatusBadgeStyle(getHumidityStatus())} font-medium`}
            >
              {getHumidityStatus() === "normal" && "Optimal"}
              {getHumidityStatus() === "high" && "High"}
              {getHumidityStatus() === "low" && "Low"}
              {getHumidityStatus() === "default" && "Unknown"}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timestamp */}
      {showTimestamp && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last Sensor Update: {sensorData.lastUpdated}</span>
                <span>•</span>
                <span>UI Updated: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
