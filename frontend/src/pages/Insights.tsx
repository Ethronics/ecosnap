import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { RoleNavigation } from "@/components/RoleNavigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useCompanyStore } from "@/stores/companyStore";
import axios from "axios";
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
  RefreshCw,
} from "lucide-react";
import { API_URL } from "@/config/constant";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Define a type for history data
interface HistoryRecord {
  _id: string;
  CompanyId: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  domain: string;
}

const Insights = () => {
  const { company, isLoading: companyLoading } = useCompanyStore();
  // Always use the first domain as the current domain
  const currentDomain =
    company && company.domains.length > 0 ? company.domains[0].name : "";
  const [predictedTemperature, setPredictedTemperature] = useState<
    number | null
  >(null);
  const [predictedHumidity, setPredictedHumidity] = useState<number | null>(
    null
  );
  const [loadingTemperature, setLoadingTemperature] = useState(false);
  const [loadingHumidity, setLoadingHumidity] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [lastTempRefresh, setLastTempRefresh] = useState<Date | null>(null);
  const [lastHumRefresh, setLastHumRefresh] = useState<Date | null>(null);
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Calculate last24 only once at the top after historyData is fetched
  const last24 = historyData.slice(0, 24).reverse(); // oldest to newest
  // Calculate dynamic efficiency metrics from history
  const avgTemp =
    last24.length > 0
      ? last24.reduce((sum, h) => sum + h.temperature, 0) / last24.length
      : null;
  const avgHum =
    last24.length > 0
      ? last24.reduce((sum, h) => sum + h.humidity, 0) / last24.length
      : null;
  // Example: efficiency as percentage of values within optimal range (customize as needed)
  const tempOptimalMin = 18,
    tempOptimalMax = 28;
  const humOptimalMin = 40,
    humOptimalMax = 70;
  const tempEff =
    last24.length > 0
      ? Math.round(
          (last24.filter(
            (h) =>
              h.temperature >= tempOptimalMin && h.temperature <= tempOptimalMax
          ).length /
            last24.length) *
            100
        )
      : null;
  const humEff =
    last24.length > 0
      ? Math.round(
          (last24.filter(
            (h) => h.humidity >= humOptimalMin && h.humidity <= humOptimalMax
          ).length /
            last24.length) *
            100
        )
      : null;
  const safetyEff =
    last24.length > 0 ? Math.round(((tempEff ?? 0) + (humEff ?? 0)) / 2) : null;
  const overallEff =
    last24.length > 0
      ? Math.round(((tempEff ?? 0) + (humEff ?? 0) + (safetyEff ?? 0)) / 3)
      : null;

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
      overall: overallEff ?? "-",
      temperature: tempEff ?? "-",
      humidity: humEff ?? "-",
      safety: safetyEff ?? "-",
    },
  };

  // Helper to format date/time
  const formatDateTime = (date: Date | null) => {
    if (!date) return "-";
    return date.toLocaleString();
  };

  // Set default domain on company load
  useEffect(() => {
    if (company && company.domains.length > 0) {
      // setSelectedDomain(company.domains[0].name); // Removed as per edit
    }
  }, [company]);

  // Fetch both predictions on mount/domain change
  useEffect(() => {
    const fetchBoth = async () => {
      if (!company || !currentDomain) return;
      setLoadingTemperature(true);
      setLoadingHumidity(true);
      setPredictionError(null);
      try {
        const [tempRes, humRes] = await Promise.all([
          axios.post(`${API_URL}/api/predict/temperature`, {
            companyId: company._id,
            domain: currentDomain,
          }),
          axios.post(`${API_URL}/api/predict/humidity`, {
            companyId: company._id,
            domain: currentDomain,
          }),
        ]);
        setPredictedTemperature(tempRes.data.prediction);
        setPredictedHumidity(humRes.data.prediction);
        setLastTempRefresh(new Date());
        setLastHumRefresh(new Date());
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setPredictionError(
          error?.response?.data?.message || "Failed to fetch predictions"
        );
        setPredictedTemperature(null);
        setPredictedHumidity(null);
        setLastTempRefresh(null);
        setLastHumRefresh(null);
      } finally {
        setLoadingTemperature(false);
        setLoadingHumidity(false);
      }
    };
    fetchBoth();
  }, [company, currentDomain]);

  // Fetch history data
  useEffect(() => {
    const fetchHistory = async () => {
      if (!company || !currentDomain) return;
      setLoadingHistory(true);
      setHistoryError(null);
      try {
        const res = await axios.get(
          `${API_URL}/api/domain/history?companyId=${
            company._id
          }&domain=${encodeURIComponent(currentDomain)}`
        );
        setHistoryData(res.data.data || []);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setHistoryError(
          error?.response?.data?.message || "Failed to fetch history data"
        );
        setHistoryData([]);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [company, currentDomain]);

  // Calculate 24hr trend for temperature and humidity
  const tempChange =
    last24.length >= 2
      ? Number(
          (
            last24[last24.length - 1].temperature - last24[0].temperature
          ).toFixed(1)
        )
      : null;
  const humChange =
    last24.length >= 2
      ? Number(
          (last24[last24.length - 1].humidity - last24[0].humidity).toFixed(1)
        )
      : null;
  const tempStatus =
    tempChange !== null
      ? Math.abs(tempChange) < 0.5
        ? "steady"
        : tempChange > 0
        ? "rising"
        : "falling"
      : "-";
  const humStatus =
    humChange !== null
      ? Math.abs(humChange) < 0.5
        ? "steady"
        : humChange > 0
        ? "rising"
        : "falling"
      : "-";

  // Individual refresh handlers
  const refreshTemperature = async () => {
    if (!company || !currentDomain) return;
    setLoadingTemperature(true);
    setPredictionError(null);
    try {
      const tempRes = await axios.post(`${API_URL}/api/predict/temperature`, {
        companyId: company._id,
        domain: currentDomain,
      });
      setPredictedTemperature(tempRes.data.prediction);
      setLastTempRefresh(new Date());
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setPredictionError(
        error?.response?.data?.message ||
          "Failed to fetch temperature prediction"
      );
      setPredictedTemperature(null);
      setLastTempRefresh(null);
    } finally {
      setLoadingTemperature(false);
    }
  };

  const refreshHumidity = async () => {
    if (!company || !currentDomain) return;
    setLoadingHumidity(true);
    setPredictionError(null);
    try {
      const humRes = await axios.post(`${API_URL}/api/predict/humidity`, {
        companyId: company._id,
        domain: currentDomain,
      });
      setPredictedHumidity(humRes.data.prediction);
      setLastHumRefresh(new Date());
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setPredictionError(
        error?.response?.data?.message || "Failed to fetch humidity prediction"
      );
      setPredictedHumidity(null);
      setLastHumRefresh(null);
    } finally {
      setLoadingHumidity(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["manager", "staff"]}>
      <div className="min-h-screen">
        <RoleNavigation />

        <div className="pt-32 px-4 pb-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Remove Domain Selector */}
            {/* Top Metrics: Only 4 cards */}
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
                  {currentDomain || "-"}
                </p>
              </Card>
            </motion.div>
            {/* Prediction Section: 2 cards below top metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card p-6 text-center relative">
                <button
                  className="absolute top-4 right-4 p-2 rounded hover:bg-gray-300"
                  onClick={refreshTemperature}
                  disabled={loadingTemperature}
                  title="Refresh prediction"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${
                      loadingTemperature ? "animate-spin" : ""
                    }`}
                  />
                </button>
                <h3 className="font-semibold mb-2">Next Hour Temperature</h3>
                <div className="mb-2 text-xs text-gray-500">
                  {`As of: ${formatDateTime(lastTempRefresh)}`}
                </div>
                {loadingTemperature ? (
                  <p className="text-foreground/60">Loading...</p>
                ) : predictionError ? (
                  <p className="text-red-500 text-sm">{predictionError}</p>
                ) : (
                  <p className="text-3xl font-bold text-red-400">
                    {predictedTemperature !== null
                      ? `${predictedTemperature}°C`
                      : "-"}
                  </p>
                )}
                <div className="mt-4 text-xs text-gray-400">Powered by AI</div>
              </Card>
              <Card className="glass-card p-6 text-center relative">
                <button
                  className="absolute top-4 right-4 p-2 rounded hover:bg-gray-300"
                  onClick={refreshHumidity}
                  disabled={loadingHumidity}
                  title="Refresh prediction"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${
                      loadingHumidity ? "animate-spin" : ""
                    }`}
                  />
                </button>
                <h3 className="font-semibold mb-2">Next Hour Humidity</h3>
                <div className="mb-2 text-xs text-gray-500">
                  {`As of: ${formatDateTime(lastHumRefresh)}`}
                </div>
                {loadingHumidity ? (
                  <p className="text-foreground/60">Loading...</p>
                ) : predictionError ? (
                  <p className="text-red-500 text-sm">{predictionError}</p>
                ) : (
                  <p className="text-3xl font-bold text-blue-400">
                    {predictedHumidity !== null ? `${predictedHumidity}%` : "-"}
                  </p>
                )}
                <div className="mt-4 text-xs text-gray-400">Powered by AI</div>
              </Card>
            </div>
            {/* Trends Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    Trend Analysis (24h)
                  </h3>
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                {loadingHistory ? (
                  <p className="text-foreground/60">Loading...</p>
                ) : historyError ? (
                  <p className="text-red-500 text-sm">{historyError}</p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">Temperature</p>
                        <p className="text-sm text-foreground/60">24h</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            tempStatus === "rising"
                              ? "text-orange-400"
                              : tempStatus === "falling"
                              ? "text-blue-400"
                              : "text-green-400"
                          }`}
                        >
                          {tempChange !== null
                            ? `${tempChange > 0 ? "+" : ""}${tempChange}°C`
                            : "-"}
                        </p>
                        <p className="text-sm text-foreground/60 capitalize">
                          {tempStatus}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">Humidity</p>
                        <p className="text-sm text-foreground/60">24h</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            humStatus === "rising"
                              ? "text-orange-400"
                              : humStatus === "falling"
                              ? "text-blue-400"
                              : "text-green-400"
                          }`}
                        >
                          {humChange !== null
                            ? `${humChange > 0 ? "+" : ""}${humChange}%`
                            : "-"}
                        </p>
                        <p className="text-sm text-foreground/60 capitalize">
                          {humStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
              {/* Recent Alerts card remains unchanged */}
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
                  <h3 className="text-xl font-semibold">
                    Temperature Trends (24h)
                  </h3>
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg">
                  {loadingHistory ? (
                    <p className="text-foreground/60">Loading...</p>
                  ) : historyError ? (
                    <p className="text-red-500 text-sm">{historyError}</p>
                  ) : last24.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={last24}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={(t) => new Date(t).getHours() + ":00"}
                          minTickGap={2}
                        />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip
                          labelFormatter={(l) => new Date(l).toLocaleString()}
                        />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-foreground/60">No data</p>
                  )}
                </div>
              </Card>
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    Humidity Trends (24h)
                  </h3>
                  <PieChart className="h-6 w-6 text-purple-400" />
                </div>
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg">
                  {loadingHistory ? (
                    <p className="text-foreground/60">Loading...</p>
                  ) : historyError ? (
                    <p className="text-red-500 text-sm">{historyError}</p>
                  ) : last24.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={last24}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={(t) => new Date(t).getHours() + ":00"}
                          minTickGap={2}
                        />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip
                          labelFormatter={(l) => new Date(l).toLocaleString()}
                        />
                        <Line
                          type="monotone"
                          dataKey="humidity"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-foreground/60">No data</p>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Insights;
