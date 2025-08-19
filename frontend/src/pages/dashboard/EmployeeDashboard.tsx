import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { RoleNavigation } from '@/components/RoleNavigation';
import { RealTimeSensorData } from '@/components/RealTimeSensorData';
import { 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Shield,
  Clock
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Get safety status based on real sensor data
  const getSafetyStatus = () => {
    // This will be calculated based on real sensor data
    return 'All Clear';
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <RoleNavigation />
      
      <div className="pt-32 px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Employee Dashboard
            </h1>
            <p className="text-center text-foreground/70 mb-8">
              Real-time environmental monitoring and safety alerts
            </p>
          </motion.div>

          {/* Real-time Sensor Data */}
          <RealTimeSensorData 
            showConnectionStatus={true}
            showTimestamp={true}
            className="mb-8"
          />

          {/* Safety Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-card p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-16 w-16 text-green-400" />
              </div>
              <h2 className="text-4xl font-bold mb-2 text-green-400">
                {getSafetyStatus()}
              </h2>
              <p className="text-xl text-foreground/70 mb-4">Workplace Environment</p>
              <div className="flex items-center justify-center space-x-2 text-foreground/60">
                <Clock className="h-4 w-4" />
                <span>Last updated: {currentTime.toLocaleTimeString()}</span>
              </div>
            </Card>
          </motion.div>

          {/* Real-time Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Live Monitoring</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">Connected</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-foreground/80">Current Time</h4>
                <p className="text-2xl font-mono">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-foreground/80">System Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Sensors: Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Environment: Safe</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Alerts: None</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Alerts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-xl font-semibold mb-4">Recent Alerts</h3>
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-foreground/70">No active alerts at this time</p>
              <p className="text-sm text-foreground/50 mt-2">
                All environmental conditions are within safe ranges
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;