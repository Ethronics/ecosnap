import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Wifi,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function Dashboard() {
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [results, setResults] = useState<{
    condition: string;
    temperature: number;
    humidity: number;
    domain: string;
    recommendation: string;
  } | null>(null);

  const handleConnect = () => {
    if (apiEndpoint) {
      setIsConnected(true);
      // Simulate API response
      setTimeout(() => {
        setResults({
          condition: "Safe",
          temperature: 24.5,
          humidity: 65,
          domain: "Office",
          recommendation:
            "Environment is optimal for office work. Maintain current conditions.",
        });
      }, 1500);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      // Simulate CSV processing
      setTimeout(() => {
        setResults({
          condition: "Warning",
          temperature: 28.3,
          humidity: 80,
          domain: "Agriculture",
          recommendation:
            "High humidity detected. Consider ventilation to prevent mold growth.",
        });
      }, 2000);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "safe":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "toxic":
        return "text-red-400";
      default:
        return "text-blue-400";
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "safe":
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-400" />;
      case "toxic":
        return <AlertTriangle className="h-6 w-6 text-red-400" />;
      default:
        return <TrendingUp className="h-6 w-6 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            EcoSnap Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect your sensors or upload data to monitor environmental
            conditions
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Data Source
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Endpoint Section */}
              <div className="space-y-3">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <div className="flex gap-3">
                  <Input
                    id="api-endpoint"
                    type="text"
                    placeholder="https://api.your-sensor.com/data"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="glass flex-1"
                  />
                  <Button
                    onClick={handleConnect}
                    disabled={!apiEndpoint || isConnected}
                    className="bg-primary/80 hover:bg-primary"
                  >
                    {isConnected ? "Connected" : "Connect"}
                  </Button>
                </div>
                {isConnected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-green-400 text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Successfully connected to sensor
                  </motion.div>
                )}
              </div>

              {/* CSV Upload Section */}
              <div className="border-t border-white/10 pt-6">
                <Label htmlFor="csv-upload" className="block mb-3">
                  Or Upload CSV Data
                </Label>
                <div className="relative">
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="glass file:bg-primary/20 file:text-primary file:border-0 file:rounded-md file:px-3 file:py-1"
                  />
                  <Upload className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {csvFile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-blue-400 text-sm mt-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    File uploaded: {csvFile.name}
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Environmental Condition */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getConditionIcon(results.condition)}
                  Condition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${getConditionColor(
                    results.condition
                  )}`}
                >
                  {results.condition}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Domain: {results.domain}
                </div>
              </CardContent>
            </Card>

            {/* Temperature */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-400" />
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">
                  {results.temperature}°C
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Current reading
                </div>
              </CardContent>
            </Card>

            {/* Humidity */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Humidity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">
                  {results.humidity}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Relative humidity
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recommendations */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{results.recommendation}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
