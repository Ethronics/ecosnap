import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RoleNavigation } from "@/components/RoleNavigation";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";
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
  Building,
  Globe,
  Users,
  Database,
  Shield,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardData {
  condition: string;
  temperature: number;
  humidity: number;
  domain: string;
  recommendations: string[];
}

const StaffDashboard = () => {
  const [apiEndpoints, setApiEndpoints] = useState<{ [key: string]: string }>(
    {}
  );
  const [csvFiles, setCsvFiles] = useState<{ [key: string]: File | null }>({});
  const [connections, setConnections] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});
  const [domainData, setDomainData] = useState<{
    [key: string]: DashboardData | null;
  }>({});
  const [activeDomainTab, setActiveDomainTab] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auth and Company stores
  const { user } = useAuthStore();
  const {
    company,
    isLoading: companyLoading,
    getCompanyByEmployeeId,
  } = useCompanyStore();

  // Fetch company data when component mounts
  useEffect(() => {
    if (user?.id) {
      getCompanyByEmployeeId(user.id);
    }
  }, [user?.id, getCompanyByEmployeeId]);

  const handleConnect = async (domainPlace: string) => {
    const apiEndpoint = apiEndpoints[domainPlace];
    if (!apiEndpoint) return;

    setProcessing((prev) => ({ ...prev, [domainPlace]: true }));
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setConnections((prev) => ({ ...prev, [domainPlace]: true }));
    setDomainData((prev) => ({
      ...prev,
      [domainPlace]: {
        condition: "Safe",
        temperature: 24.5,
        humidity: 65,
        domain: domainPlace,
        recommendations: [
          "Temperature levels are optimal",
          "Humidity within acceptable range",
          "No immediate action required",
        ],
      },
    }));

    toast({
      title: "Connected Successfully",
      description: `Sensor data for ${domainPlace} is now being monitored.`,
    });

    setProcessing((prev) => ({ ...prev, [domainPlace]: false }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    domainPlace: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFiles((prev) => ({ ...prev, [domainPlace]: file }));
    setProcessing((prev) => ({ ...prev, [domainPlace]: true }));

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setDomainData((prev) => ({
      ...prev,
      [domainPlace]: {
        condition: "Moderate Risk",
        temperature: 28.3,
        humidity: 78,
        domain: domainPlace,
        recommendations: [
          "Temperature slightly elevated",
          "Consider increasing ventilation",
          "Monitor air quality closely",
        ],
      },
    }));

    toast({
      title: "CSV Processed",
      description: "Environmental data has been analyzed.",
    });

    setProcessing((prev) => ({ ...prev, [domainPlace]: false }));
  };

  const getDomainGlow = () => {
    const domainName = company?.domains?.[0]?.name || activeDomainTab;
    switch (domainName) {
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
          {/* Company Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {companyLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-white/10 rounded mb-2"></div>
                <div className="h-6 bg-white/10 rounded w-64 mx-auto"></div>
              </div>
            ) : company ? (
              <>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Building className="h-8 w-8 text-amber-400" />
                  <h1 className="text-3xl font-bold text-amber-400">
                    {company.companyName}
                  </h1>
                </div>
                <div className="flex items-center justify-center space-x-2 text-foreground/70">
                  <Globe className="h-4 w-4" />
                  <span>{company.domains?.[0]?.name || "No Domain"}</span>
                  <span>•</span>
                  <span>
                    Managed by {company.manager?.reference?.name || "Manager"}
                  </span>
                </div>
              </>
            ) : (
              <h1 className="text-3xl font-bold text-amber-400">
                Staff Dashboard
              </h1>
            )}
            <p className="text-center text-foreground/70 mt-4">
              Access to environmental monitoring and data analysis
            </p>
          </motion.div>

          {/* Domain Selection Tabs */}
          {company && company.domains.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-6 rounded-2xl mb-6"
            >
              <h3 className="text-lg font-semibold mb-4">
                Select Domain to Monitor
              </h3>
              <div className="flex flex-wrap gap-3">
                {company.domains.map((domainItem, index) => (
                  <Button
                    key={index}
                    onClick={() => setActiveDomainTab(domainItem.place)}
                    variant={
                      activeDomainTab === domainItem.place
                        ? "default"
                        : "outline"
                    }
                    className={`${
                      activeDomainTab === domainItem.place
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        : "bg-white/5 text-foreground/70 border-white/20"
                    }`}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {domainItem.place}
                    {connections[domainItem.place] && (
                      <CheckCircle className="h-4 w-4 ml-2 text-green-400" />
                    )}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Domain Monitoring Section - Only show selected domain */}
          {company &&
            activeDomainTab &&
            (() => {
              const domainItem = company.domains.find(
                (d) => d.place === activeDomainTab
              );
              if (!domainItem) return null;

              return (
                <motion.div
                  key={activeDomainTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="glass-card p-6 rounded-2xl mb-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Globe className="h-6 w-6 text-blue-400" />
                    <h2 className="text-xl font-semibold text-foreground">
                      {domainItem.place} Monitoring
                    </h2>
                    {connections[domainItem.place] && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label htmlFor={`api-endpoint-${domainItem.place}`}>
                        API Endpoint
                      </Label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id={`api-endpoint-${domainItem.place}`}
                            placeholder="https://api.sensor.com/data"
                            value={apiEndpoints[domainItem.place] || ""}
                            onChange={(e) =>
                              setApiEndpoints((prev) => ({
                                ...prev,
                                [domainItem.place]: e.target.value,
                              }))
                            }
                            className="pl-10 glass-card border-white/20"
                          />
                        </div>
                        <Button
                          onClick={() => handleConnect(domainItem.place)}
                          disabled={
                            processing[domainItem.place] ||
                            !apiEndpoints[domainItem.place]
                          }
                          className="bg-primary/80 hover:bg-primary text-white"
                        >
                          {processing[domainItem.place]
                            ? "Connecting..."
                            : "Connect"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

          {/* Domain Dashboard - Only show for selected domain with data */}
          {company &&
            activeDomainTab &&
            (() => {
              const data = domainData[activeDomainTab];
              if (!data) return null;

              const domainItem = company.domains.find(
                (d) => d.place === activeDomainTab
              );
              if (!domainItem) return null;

              return (
                <motion.div
                  key={`dashboard-${activeDomainTab}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="glass-card p-6 rounded-2xl mb-6"
                >
                  <div className="flex justify-between items-center w-full px-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Globe className="h-6 w-6 text-blue-400" />
                      <h3 className="text-xl font-semibold">
                        {domainItem.place} Dashboard
                      </h3>
                    </div>
                    <Button
                      onClick={() => navigate("/insights")}
                      variant="ghost"
                      className="glass-card bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                    >
                      Insights
                    </Button>
                  </div>

                  {/* Detailed Condition Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Status</h3>
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
                    </Card>

                    <Card className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Temperature</h3>
                        <Thermometer className="h-6 w-6 text-red-400" />
                      </div>
                      <p className="text-3xl font-bold text-red-400">
                        {data.temperature}°C
                      </p>
                      <p className="text-foreground/70 mt-2">
                        {data.temperature > 25
                          ? "Above optimal"
                          : "Optimal range"}
                      </p>
                    </Card>

                    <Card className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Humidity</h3>
                        <Droplets className="h-6 w-6 text-blue-400" />
                      </div>
                      <p className="text-3xl font-bold text-blue-400">
                        {data.humidity}%
                      </p>
                      <p className="text-foreground/70 mt-2">
                        {data.humidity > 70 ? "High humidity" : "Normal levels"}
                      </p>
                    </Card>

                    <Card className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Activity</h3>
                        <Activity className="h-6 w-6 text-purple-400" />
                      </div>
                      <p className="text-3xl font-bold text-purple-400">
                        Active
                      </p>
                      <p className="text-foreground/70 mt-2">
                        Real-time monitoring
                      </p>
                    </Card>
                  </div>

                  {/* Additional Detailed Cards */}
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <Card className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Data Quality</h3>
                        <Database className="h-6 w-6 text-cyan-400" />
                      </div>
                      <p className="text-2xl font-bold text-cyan-400">98.5%</p>
                      <p className="text-foreground/70 mt-2">
                        High accuracy sensors
                      </p>
                    </Card>

                    <Card className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Security</h3>
                        <Shield className="h-6 w-6 text-green-400" />
                      </div>
                      <p className="text-2xl font-bold text-green-400">
                        Secure
                      </p>
                      <p className="text-foreground/70 mt-2">
                        Encrypted data transfer
                      </p>
                    </Card>

                    <Card className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Performance</h3>
                        <Zap className="h-6 w-6 text-yellow-400" />
                      </div>
                      <p className="text-2xl font-bold text-yellow-400">
                        Optimal
                      </p>
                      <p className="text-foreground/70 mt-2">
                        All systems operational
                      </p>
                    </Card>
                  </div>

                  {/* Recommendations */}
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-4">
                      AI Recommendations
                    </h3>
                    <div className="space-y-3">
                      {data.recommendations.map(
                        (rec: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                            <span className="text-foreground/80">{rec}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
