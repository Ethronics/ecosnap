import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { RoleNavigation } from '@/components/RoleNavigation';
import { 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Thermometer,
  Droplets,
  Shield,
  Clock
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Simulate real-time data
  const [data] = useState({
    condition: 'Safe',
    temperature: 23.7,
    humidity: 61,
    domain: 'Workplace Environment',
    lastUpdate: 'Just now',
    safetyStatus: 'All Clear',
    alerts: []
  });

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

          {/* Current Status - Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glass-card p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                {data.condition === 'Safe' ? (
                  <CheckCircle className="h-16 w-16 text-green-400" />
                ) : (
                  <AlertTriangle className="h-16 w-16 text-yellow-400" />
                )}
              </div>
              <h2 className={`text-4xl font-bold mb-2 ${
                data.condition === 'Safe' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {data.condition}
              </h2>
              <p className="text-xl text-foreground/70 mb-4">{data.domain}</p>
              <div className="flex items-center justify-center space-x-2 text-foreground/60">
                <Clock className="h-4 w-4" />
                <span>Last updated: {data.lastUpdate}</span>
              </div>
            </Card>
          </motion.div>

          {/* Environmental Data Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <Card className="glass-card p-6 text-center">
              <Thermometer className="h-8 w-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Temperature</h3>
              <p className="text-3xl font-bold text-red-400">{data.temperature}°C</p>
              <p className="text-sm text-foreground/60 mt-2">Optimal Range</p>
            </Card>

            <Card className="glass-card p-6 text-center">
              <Droplets className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Humidity</h3>
              <p className="text-3xl font-bold text-blue-400">{data.humidity}%</p>
              <p className="text-sm text-foreground/60 mt-2">Normal Levels</p>
            </Card>

            <Card className="glass-card p-6 text-center">
              <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Safety Status</h3>
              <p className="text-lg font-bold text-green-400">{data.safetyStatus}</p>
              <p className="text-sm text-foreground/60 mt-2">No Actions Required</p>
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
                    <Activity className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Data Flow: Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Alerts: Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Safety Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-xl font-semibold mb-4">Safety Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-foreground/70">
              <div>
                <h4 className="font-medium text-foreground mb-2">If Temperature Rises:</h4>
                <ul className="space-y-1">
                  <li>• Move to a cooler area</li>
                  <li>• Increase ventilation</li>
                  <li>• Report to supervisor</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">If Alerts Appear:</h4>
                <ul className="space-y-1">
                  <li>• Follow safety protocols</li>
                  <li>• Evacuate if necessary</li>
                  <li>• Contact emergency services</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;