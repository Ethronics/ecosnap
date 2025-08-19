import { create } from "zustand";
import { API_URL } from "@/config/constant";

interface SensorData {
  temperature: string | number;
  humidity: string | number;
  lastUpdated: string;
  domain: string;
}

interface SensorStatus {
  mqtt: boolean;
  websocket: number;
}

interface SensorState {
  // Real-time sensor data
  sensorData: SensorData;
  
  // Connection status
  connectionStatus: SensorStatus;
  
  // WebSocket connection
  ws: WebSocket | null;
  isConnected: boolean;
  
  // Actions
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  updateSensorData: (data: SensorData) => void;
  updateConnectionStatus: (status: SensorStatus) => void;
  fetchCurrentData: () => Promise<void>;
  fetchConnectionStatus: () => Promise<void>;
}

const useSensorStore = create<SensorState>((set, get) => ({
  // Initial state
  sensorData: {
    temperature: "N/A",
    humidity: "N/A",
    lastUpdated: "N/A",
    domain: "default"
  },
  
  connectionStatus: {
    mqtt: false,
    websocket: 0
  },
  
  ws: null,
  isConnected: false,

  // Connect to WebSocket for real-time updates
  connectWebSocket: () => {
    const { ws } = get();
    
    // Close existing connection if any
    if (ws) {
      ws.close();
    }

    // Create new WebSocket connection
    const wsUrl = window.location.hostname === "localhost" 
      ? "ws://localhost:4040" 
      : `ws://${window.location.hostname}:4040`;
    
    const newWs = new WebSocket(wsUrl);

    newWs.onopen = () => {
      console.log("✅ Connected to sensor WebSocket");
      set({ ws: newWs, isConnected: true });
    };

    newWs.onmessage = (event) => {
      try {
        const data: SensorData = JSON.parse(event.data);
        console.log("📡 Received sensor data:", data);
        set({ sensorData: data });
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };

    newWs.onclose = () => {
      console.log("🔌 WebSocket connection closed");
      set({ ws: null, isConnected: false });
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        const { connectWebSocket } = get();
        connectWebSocket();
      }, 5000);
    };

    newWs.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      set({ ws: null, isConnected: false });
    };
  },

  // Disconnect WebSocket
  disconnectWebSocket: () => {
    const { ws } = get();
    if (ws) {
      ws.close();
      set({ ws: null, isConnected: false });
    }
  },

  // Update sensor data
  updateSensorData: (data: SensorData) => {
    set({ sensorData: data });
  },

  // Update connection status
  updateConnectionStatus: (status: SensorStatus) => {
    set({ connectionStatus: status });
  },

  // Fetch current sensor data via REST API
  fetchCurrentData: async () => {
    try {
      const response = await fetch(`${API_URL}/api/sensors/current`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          set({ sensorData: result.data });
        }
      }
    } catch (error) {
      console.error("❌ Failed to fetch sensor data:", error);
    }
  },

  // Fetch connection status via REST API
  fetchConnectionStatus: async () => {
    try {
      const response = await fetch(`${API_URL}/api/sensors/status`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          set({ connectionStatus: result.data });
        }
      }
    } catch (error) {
      console.error("❌ Failed to fetch connection status:", error);
    }
  }
}));

export default useSensorStore;
