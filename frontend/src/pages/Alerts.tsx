import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RoleNavigation } from "@/components/RoleNavigation";
import UserSelectionModal from "@/components/UserSelectionModal";
import useAuthStore from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";
import { useToast } from "@/hooks/use-toast";
import { Bell, CheckCircle, Users } from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  domain: string;
  timestamp: string;
  status: "active" | "notified" | "fixed";
  type: "temperature" | "humidity" | "air_quality" | "system" | "security";
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const { user } = useAuthStore();
  const { toast } = useToast();

  // Auto-generate alerts for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: crypto.randomUUID(),
        title: "Random Temperature Alert",
        description: "Temperature exceeded safe levels in the storage room",
        severity: ["low", "medium", "high", "critical"][
          Math.floor(Math.random() * 4)
        ] as Alert["severity"],
        domain: "Office",
        timestamp: new Date().toISOString(),
        status: "active",
        type: ["temperature", "humidity", "air_quality", "system", "security"][
          Math.floor(Math.random() * 5)
        ] as Alert["type"],
      };

      setAlerts((prev) => [newAlert, ...prev]);
    }, 15000); // every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Example for fetching from backend instead
  /*
  useEffect(() => {
    const fetchAlerts = async () => {
      const res = await fetch("/api/alerts");
      const data = await res.json();
      setAlerts(data);
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);
  */

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "low":
        return "text-blue-400 border-blue-400/30 bg-blue-400/10";
      case "medium":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      case "high":
        return "text-orange-400 border-orange-400/30 bg-orange-400/10";
      case "critical":
        return "text-red-400 border-red-400/30 bg-red-400/10";
      default:
        return "text-gray-400 border-gray-400/30 bg-gray-400/10";
    }
  };

  const getStatusColor = (status: Alert["status"]) => {
    switch (status) {
      case "active":
        return "text-red-400 border-red-400/30 bg-red-400/10";
      case "notified":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      case "fixed":
        return "text-green-400 border-green-400/30 bg-green-400/10";
      default:
        return "text-gray-400 border-gray-400/30 bg-gray-400/10";
    }
  };

  const getTypeIcon = (type: Alert["type"]) => {
    switch (type) {
      case "temperature":
        return "🌡️";
      case "humidity":
        return "💧";
      case "air_quality":
        return "🌬️";
      case "system":
        return "⚙️";
      case "security":
        return "🔒";
      default:
        return "⚠️";
    }
  };

  const handleNotify = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleNotifyUsers = async (selectedUserIds: string[]) => {
    if (!selectedAlert) return;

    // Send email request to backend
    try {
      await fetch("/api/send-alert-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId: selectedAlert.id,
          userIds: selectedUserIds,
        }),
      });

      // Update alert status locally
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === selectedAlert.id
            ? { ...alert, status: "notified" }
            : alert
        )
      );

      toast({
        title: "Notifications Sent",
        description: `Alert "${selectedAlert.title}" sent to ${selectedUserIds.length} user${
          selectedUserIds.length !== 1 ? "s" : ""
        }.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email notifications.",
        variant: "destructive",
      });
    }
  };

  const handleFixed = async (alertId: string) => {
    // Update status in backend
    try {
      await fetch(`/api/alerts/${alertId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "fixed" }),
      });

      // Update locally
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, status: "fixed" } : alert
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <RoleNavigation />
      <div className="pt-32 px-4 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Bell className="h-8 w-8 text-red-400" />
              <h1 className="text-3xl font-bold text-red-400">Alerts Center</h1>
            </div>
            <p className="text-center text-foreground/70">
              Monitor and manage environmental alerts across all domains
            </p>
          </motion.div>

          {/* Alerts Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-6"
          >
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              >
                <Card className="glass-card p-6 border-l-4 border-l-red-400">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">
                          {getTypeIcon(alert.type)}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {alert.title}
                          </h3>
                          <p className="text-foreground/70">
                            {alert.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                            alert.severity
                          )}`}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            alert.status
                          )}`}
                        >
                          {alert.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-foreground/60">
                          {alert.domain}
                        </span>
                        <span className="text-sm text-foreground/60">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => handleNotify(alert)}
                        disabled={
                          alert.status === "notified" ||
                          alert.status === "fixed"
                        }
                        variant="outline"
                        size="sm"
                        className="glass-card border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Notify
                      </Button>
                      <Button
                        onClick={() => handleFixed(alert.id)}
                        disabled={alert.status === "fixed"}
                        variant="outline"
                        size="sm"
                        className="glass-card border-green-400/30 text-green-400 hover:bg-green-400/10"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Fixed
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {alerts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center py-12"
            >
              <Bell className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground/70 mb-2">
                No Active Alerts
              </h3>
              <p className="text-foreground/50">
                All systems are running normally. Check back later for updates.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* User Selection Modal */}
      <UserSelectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAlert(null);
        }}
        alertTitle={selectedAlert?.title || ""}
        onNotifyUsers={handleNotifyUsers}
      />
    </div>
  );
};

export default Alerts;
