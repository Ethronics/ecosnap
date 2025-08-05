import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { RoleNavigation } from "@/components/RoleNavigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Thermometer,
  Droplets,
  Wind,
  Globe,
} from "lucide-react";

const Insights = () => {
  // Mock data for insights
  const insights = {
    trends: [
      {
        metric: "Temperature",
        change: "+2.3°C",
        status: "rising",
        period: "7 days",
      },
      {
        metric: "Humidity",
        change: "-5%",
        status: "falling",
        period: "7 days",
      },
      {
        metric: "Safety",
        change: "+15%",
        status: "improving",
        period: "30 days",
      },
    ],
    alerts: [
      {
        type: "warning",
        message: "High Temperature detected evacuate the area",
        time: "2 hours ago",
      },
      {
        type: "info",
        message: "Low humidity detected in the area",
        time: "1 day ago",
      },
      {
        type: "success",
        message: "Changes made in the domain's settings",
        time: "3 days ago",
      },
    ],
    efficiency: {
      overall: 87,
      temperature: 92,
      humidity: 85,
      safety: 88,
    },
  };

  return (
    <ProtectedRoute allowedRoles={["manager", "staff"]}>
      <div className="min-h-screen">
        <RoleNavigation />

        <div className="pt-32 px-4 pb-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Environmental Insights
              </h1>
              <p className="text-center text-foreground/70 mb-8">
                Advanced analytics and environmental monitoring insights
              </p>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid md:grid-cols-4 gap-6"
            >
              <Card className="glass-card p-6 text-center">
                <Activity className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Domain Safety Score</h3>
                <p className="text-3xl font-bold text-green-400">
                  {insights.efficiency.overall}%
                </p>
              </Card>

              <Card className="glass-card p-6 text-center">
                <Thermometer className="h-8 w-8 text-red-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Temperature Control</h3>
                <p className="text-3xl font-bold text-red-400">
                  {insights.efficiency.temperature}%
                </p>
              </Card>

              <Card className="glass-card p-6 text-center">
                <Droplets className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Humidity Control</h3>
                <p className="text-3xl font-bold text-blue-400">
                  {insights.efficiency.humidity}%
                </p>
              </Card>

              <Card className="glass-card p-6 text-center">
                {/* <Wind className="h-8 w-8 text-purple-400 mx-auto mb-3" /> */}
                <Globe className="h-8 w-8 text-purple-400 mx-auto mb-3 " />
                <h3 className="font-semibold mb-2">Domain</h3>
                <p className="text-3xl font-bold text-purple-400">
                  Agricalutre
                </p>
              </Card>
            </motion.div>

            {/* Trends Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Trend Analysis</h3>
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div className="space-y-4">
                  {insights.trends.map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{trend.metric}</p>
                        <p className="text-sm text-foreground/60">
                          {trend.period}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            trend.status === "rising"
                              ? "text-orange-400"
                              : trend.status === "falling"
                              ? "text-blue-400"
                              : "text-green-400"
                          }`}
                        >
                          {trend.change}
                        </p>
                        <p className="text-sm text-foreground/60 capitalize">
                          {trend.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Recent Alerts</h3>
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="space-y-4">
                  {insights.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg"
                    >
                      {alert.type === "warning" ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                      ) : alert.type === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      ) : (
                        <Activity className="h-5 w-5 text-blue-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-foreground/60">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Charts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Temperature Trends</h3>
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg">
                  <p className="text-foreground/60">
                    Temperature Chart Placeholder
                  </p>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Humidity Trends</h3>
                  <PieChart className="h-6 w-6 text-purple-400" />
                </div>
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg">
                  <p className="text-foreground/60">
                    Humidity Chart Placeholder
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card p-6 rounded-2xl"
            >
              <h3 className="text-xl font-semibold mb-4">
                AI-Powered Recommendations
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-400">
                    Optimization Opportunities
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li>• Reduce temperature by 2°C to improve efficiency</li>
                    <li>• Implement humidity cycling for better air quality</li>
                    <li>• Schedule maintenance on the area in 48 hours</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-blue-400">
                    Preventive Actions
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li>• Monitor the area for potential temperature spikes</li>
                    <li>• Check ventilation system in 48 hours</li>
                    <li>• Review air filter replacement schedule</li>
                    <li>• Check the safety of the area</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Insights;
