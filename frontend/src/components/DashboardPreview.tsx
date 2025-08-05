import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Thermometer,
  Droplets,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Dummy data for the preview
const sensorData = [
  {
    name: "Temperature",
    value: "24.5°C",
    status: "normal",
    trend: "up",
    icon: Thermometer,
  },
  {
    name: "Humidity",
    value: "65%",
    status: "normal",
    trend: "down",
    icon: Droplets,
  },
  {
    name: "Air Quality",
    value: "Good",
    status: "good",
    trend: "up",
    icon: Activity,
  },
  {
    name: "Alerts",
    value: "0",
    status: "normal",
    trend: "stable",
    icon: AlertTriangle,
  },
];

const chartData = [
  { time: "00:00", temp: 22, humidity: 60 },
  { time: "04:00", temp: 21, humidity: 62 },
  { time: "08:00", temp: 23, humidity: 58 },
  { time: "12:00", temp: 25, humidity: 55 },
  { time: "16:00", temp: 26, humidity: 52 },
  { time: "20:00", temp: 24, humidity: 65 },
];

export const DashboardPreview = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-glass-primary/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            See Envoinsight Ai in Action
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Experience the power of real-time environmental monitoring with our
            intuitive dashboard
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                Live Monitoring Dashboard
              </h3>
              <p className="text-foreground/60">
                Real-time environmental data from Facility A
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-500/20 text-green-400 border-green-500/30"
            >
              All Systems Normal
            </Badge>
          </div>

          {/* Sensor Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {sensorData.map((sensor, index) => (
              <motion.div
                key={sensor.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <sensor.icon className="h-5 w-5 text-primary" />
                      {sensor.trend === "up" && (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      )}
                      {sensor.trend === "down" && (
                        <TrendingDown className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <CardTitle className="text-sm text-foreground/70">
                      {sensor.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold text-foreground">
                      {sensor.value}
                    </div>
                    <Badge
                      variant="outline"
                      className={`mt-2 ${
                        sensor.status === "good"
                          ? "border-green-500/30 text-green-400"
                          : sensor.status === "normal"
                          ? "border-blue-500/30 text-blue-400"
                          : "border-yellow-500/30 text-yellow-400"
                      }`}
                    >
                      {sensor.status}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Chart Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Temperature Chart */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-red-400" />
                  Temperature Trend (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-2">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-8 bg-gradient-to-t from-red-500/60 to-red-400/20 rounded-t-sm"
                        style={{ height: `${(data.temp / 30) * 100}%` }}
                      />
                      <span className="text-xs text-foreground/60 mt-2">
                        {data.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm text-foreground/60">
                    Current: 24.5°C | Range: 21-26°C
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Humidity Chart */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-400" />
                  Humidity Trend (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-2">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-8 bg-gradient-to-t from-blue-500/60 to-blue-400/20 rounded-t-sm"
                        style={{ height: `${(data.humidity / 100) * 100}%` }}
                      />
                      <span className="text-xs text-foreground/60 mt-2">
                        {data.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm text-foreground/60">
                    Current: 65% | Range: 52-65%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Prediction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">
                AI Safety Prediction
              </h4>
            </div>
            <p className="text-foreground/80">
              Based on current trends, environmental conditions are predicted to
              remain stable for the next 6 hours. No safety alerts expected.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
