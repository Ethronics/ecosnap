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
import { usePlanStore } from "@/stores/planStore";
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
  Users,
  Building,
  Globe,
  UserPlus,
  UserMinus,
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

interface Plan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  limits: {
    domains: number;
    employees: number;
    requestsPerDay: number;
    dataRetention: number;
  };
  isPopular: boolean;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

type TabType = "main" | "domains";

const ManagerDashboard = () => {
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
  const [selectedDomain, setSelectedDomain] = useState("");
  const [planDetails, setPlanDetails] = useState<Plan | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("domains");
  const [activeDomainTab, setActiveDomainTab] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auth and Company stores
  const { user } = useAuthStore();
  const {
    company,
    isLoading: companyLoading,
    getCompanyByManagerId,
  } = useCompanyStore();
  const { getPlanById } = usePlanStore();

  // Fetch company data when component mounts
  useEffect(() => {
    if (user?.id) {
      getCompanyByManagerId(user.id);
    }
  }, [user?.id, getCompanyByManagerId]);

  // Fetch plan details when company data is loaded
  useEffect(() => {
    if (company?.plan?._id) {
      const fetchPlanDetails = async () => {
        const plan = await getPlanById(company.plan._id);
        setPlanDetails(plan);
      };
      fetchPlanDetails();
    }
  }, [company?.plan?._id, getPlanById]);

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

  const getDomainGlow = () => {
    const domainName = company?.domains?.[0]?.name || selectedDomain;
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

  const renderMainTab = () => (
    <>
      {/* Company Stats */}
      {company && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Employees</h3>
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {company.employees.length}
            </p>
            <p className="text-foreground/70 mt-2">Active team members</p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Domain</h3>
              <Globe className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-xl font-bold text-green-400">
              {company.domains?.[0]?.name || "No Domain"}
            </p>
            <p className="text-foreground/70 mt-2">
              {company.domains?.[0]?.description || "No description"}
            </p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Manager</h3>
              <UserPlus className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-xl font-bold text-purple-400">
              {company.manager?.reference?.name || "Manager"}
            </p>
            <p className="text-foreground/70 mt-2">
              {company.manager?.reference?.email || "No email"}
            </p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Current Plan</h3>
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  planDetails?.name === "Premium"
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
                    : planDetails?.name === "Pro"
                    ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30"
                }`}
              >
                {planDetails?.name || "Loading..."}
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-400">
              {planDetails?.price === 0
                ? "Free"
                : planDetails?.price
                ? `${planDetails.price} ${planDetails.currency}`
                : "Loading..."}
            </p>
            <p className="text-foreground/70 mt-2">
              {planDetails?.period === "month"
                ? "per month"
                : planDetails?.period
                ? `per ${planDetails.period}`
                : ""}
            </p>
            <div className="mt-3 text-xs text-foreground/60">
              <p>• {planDetails?.limits?.employees || 0} employees</p>
              <p>
                • {planDetails?.limits?.domains || 0} domain
                {(planDetails?.limits?.domains || 0) > 1 ? "s" : ""}
              </p>
              <p>• {planDetails?.limits?.requestsPerDay || 0} requests/day</p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Plan Details Section */}
      {company && planDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Current Plan Details
            </h2>

            {planDetails?.name !== "Premium" && (
              <Button
                onClick={() => navigate("/payment")}
                className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/30"
              >
                Upgrade Plan
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    planDetails?.name === "Premium"
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                      : planDetails?.name === "Pro"
                      ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
                      : "bg-gradient-to-r from-green-500/20 to-emerald-500/20"
                  }`}
                >
                  <div
                    className={`text-2xl font-bold ${
                      planDetails?.name === "Premium"
                        ? "text-purple-300"
                        : planDetails?.name === "Pro"
                        ? "text-blue-300"
                        : "text-green-300"
                    }`}
                  >
                    {planDetails?.name || "Loading..."}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">
                    {planDetails?.price === 0
                      ? "Free"
                      : planDetails?.price
                      ? `${planDetails.price} ${planDetails.currency}`
                      : "Loading..."}
                  </p>
                  <p className="text-foreground/70">
                    {planDetails?.period === "month"
                      ? "per month"
                      : planDetails?.period
                      ? `per ${planDetails.period}`
                      : ""}
                  </p>
                </div>
              </div>

              <p className="text-foreground/80 mb-6">
                {planDetails?.description || "Loading plan description..."}
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">
                  Plan Features:
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {planDetails?.features?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-foreground/80">
                        {feature}
                      </span>
                    </div>
                  )) || (
                    <div className="text-sm text-foreground/60">
                      Loading features...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">
                Usage Limits:
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span className="text-foreground/80">Employees</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-400">
                      {company.employees.length}
                    </p>
                    <p className="text-xs text-foreground/60">
                      / {planDetails?.limits?.employees || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-green-400" />
                    <span className="text-foreground/80">Domains</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">
                      {company.domains.length}
                    </p>
                    <p className="text-xs text-foreground/60">
                      / {planDetails?.limits?.domains || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-purple-400" />
                    <span className="text-foreground/80">Daily Requests</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-400">0</p>
                    <p className="text-xs text-foreground/60">
                      / {planDetails?.limits?.requestsPerDay || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-amber-400" />
                    <span className="text-foreground/80">Data Retention</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-amber-400">
                      {planDetails?.limits?.dataRetention || 0}
                    </p>
                    <p className="text-xs text-foreground/60">days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Employee List */}
      {company && company.employees.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="text-xl font-semibold mb-4">Team Members</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {company.employees.map((employee) => (
              <Card key={employee._id} className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {employee.name}
                    </p>
                    <p className="text-sm text-foreground/70">
                      {employee.email}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full mt-1">
                      {employee.role}
                    </span>
                  </div>
                  <UserMinus className="h-5 w-5 text-red-400 cursor-pointer hover:text-red-300" />
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );

  const renderDomainsTab = () => (
    <>
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
                  activeDomainTab === domainItem.place ? "default" : "outline"
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
                    {data.temperature > 25 ? "Above optimal" : "Optimal range"}
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
                  <p className="text-3xl font-bold text-purple-400">Active</p>
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
                  <p className="text-2xl font-bold text-green-400">Secure</p>
                  <p className="text-foreground/70 mt-2">
                    Encrypted data transfer
                  </p>
                </Card>

                <Card className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Performance</h3>
                    <Zap className="h-6 w-6 text-yellow-400" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">Optimal</p>
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
                  {data.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      <span className="text-foreground/80">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })()}
    </>
  );

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
                Manager Dashboard
              </h1>
            )}
            <p className="text-center text-foreground/70 mt-4">
              Full access to environmental monitoring and configuration
            </p>

            {/* Tab Navigation */}
            <div className="flex justify-center mt-6 space-x-4">
              <Button
                onClick={() => setActiveTab("main")}
                variant={activeTab === "main" ? "default" : "outline"}
                className={`${
                  activeTab === "main"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    : "bg-white/5 text-foreground/70 border-white/20"
                }`}
              >
                <Building className="h-4 w-4 mr-2" />
                Main
              </Button>
              <Button
                onClick={() => setActiveTab("domains")}
                variant={activeTab === "domains" ? "default" : "outline"}
                className={`${
                  activeTab === "domains"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    : "bg-white/5 text-foreground/70 border-white/20"
                }`}
              >
                <Globe className="h-4 w-4 mr-2" />
                Domains
              </Button>
            </div>
          </motion.div>

          {/* Tab Content */}
          {activeTab === "main" ? renderMainTab() : renderDomainsTab()}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
