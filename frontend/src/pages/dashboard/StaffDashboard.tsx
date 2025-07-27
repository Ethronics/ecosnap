import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RoleNavigation } from "@/components/RoleNavigation";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Link as LinkIcon,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Eye,
  Activity,
  Thermometer,
  Droplets,
} from "lucide-react";

const StaffDashboard = () => {
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedDomain, setSelectedDomain] = useState("");
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!apiEndpoint) return;

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsConnected(true);
    setData({
      condition: "Safe",
      temperature: 24.5,
      humidity: 65,
      domain: selectedDomain || "Office Environment",
      recommendations: [
        "Temperature levels are optimal",
        "Humidity within acceptable range",
        "No immediate action required",
      ],
    });

    toast({
      title: "Connected Successfully",
      description: "Sensor data is now being monitored.",
    });

    setIsProcessing(false);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setData({
      condition: "Moderate Risk",
      temperature: 28.3,
      humidity: 78,
      domain: selectedDomain || "Agricultural Field",
      recommendations: [
        "Temperature slightly elevated",
        "Consider increasing ventilation",
        "Monitor air quality closely",
      ],
    });

    toast({
      title: "CSV Processed",
      description: "Environmental data has been analyzed.",
    });

    setIsProcessing(false);
  };

  const getDomainGlow = () => {
    switch (selectedDomain) {
      case "Agriculture":
        return "bg-gradient-to-tr from-green-900/40 via-green-600/10 to-green-900/40 shadow-green-500/10";
      case "Office":
        return "bg-gradient-to-tr from-blue-900/40 via-blue-600/10 to-blue-900/40 shadow-blue-500/10";
      case "School":
        return "bg-gradient-to-tr from-purple-900/40 via-purple-600/10 to-purple-900/40 shadow-purple-500/10";
      case "Medical":
        return "bg-gradient-to-tr from-pink-900/40 via-pink-600/10 to-pink-900/40 shadow-pink-500/10";
      case "Factory":
        return "bg-gradient-to-tr from-yellow-900/40 via-yellow-600/10 to-yellow-900/40 shadow-yellow-500/10";
      case "Lab":
        return "bg-gradient-to-tr from-cyan-900/40 via-cyan-600/10 to-cyan-900/40 shadow-cyan-500/10";
      default:
        return "";
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ease-in-out ${getDomainGlow()}`}
    >
      <RoleNavigation />
      <div className="pt-32 px-4 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Staff Dashboard
            </h1>
            <p className="text-center text-foreground/70 mb-8">
              Access to domain selection and insights
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="glass-card p-4 rounded-xl mb-4 max-w-xl">
              <label className="block text-sm font-medium mb-2 text-white">
                Select Domain
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full bg-black/30 text-white border border-white/30 rounded-md px-4 py-2 backdrop-blur-lg appearance-none hover:bg-black/50 focus:outline-none"
              >
                <option value="" disabled>
                  Select a domain
                </option>
                <option value="Agriculture">Agriculture</option>
                <option value="Office">Office</option>
                <option value="School">School</option>
                <option value="Medical">Medical</option>
                <option value="Factory">Factory</option>
                <option value="Lab">Lab</option>
              </select>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Data Input
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="api-endpoint"
                      placeholder="https://api.sensor.com/data"
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                      className="pl-10 glass-card border-white/20"
                    />
                  </div>
                  <Button
                    onClick={handleConnect}
                    disabled={isProcessing || !apiEndpoint}
                    className="bg-primary/80 hover:bg-primary text-white"
                  >
                    {isProcessing ? "Connecting..." : "Connect"}
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor="csv-upload">CSV File Upload</Label>
                <div className="relative">
                  <Upload className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="pl-10 glass-card border-white/20"
                  />
                </div>
              </div>
            </div>
            {isConnected && (
              <div className="mt-4 flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Connected to sensor</span>
              </div>
            )}
          </motion.div>

          {/* Results Section */}
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Environmental Status
                  </h3>
                  {data.condition === "Safe" ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  )}
                </div>
                <p
                  className={`text-2xl font-bold ${
                    data.condition === "Safe"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {data.condition}
                </p>
                <p className="text-foreground/70 mt-2">{data.domain}</p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-red-400" />
                      <span>Temperature</span>
                    </div>
                    <span className="font-semibold">{data.temperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4 text-blue-400" />
                      <span>Humidity</span>
                    </div>
                    <span className="font-semibold">{data.humidity}%</span>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Available Actions</h3>
                  <Activity className="h-6 w-6 text-blue-400" />
                </div>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
                    onClick={() => (window.location.href = "/insights")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Detailed Insights
                  </Button>
                  <div className="text-sm text-foreground/60 mt-4">
                    <p>• Real-time monitoring access</p>
                    <p>• Data analysis capabilities</p>
                    <p>• Alert notifications enabled</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Alerts Section */}
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card p-6 rounded-2xl"
            >
              <h3 className="text-xl font-semibold mb-4">Current Alerts</h3>
              <div className="space-y-3">
                {data.alerts.map((alert: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <span className="text-foreground/80">{alert}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
