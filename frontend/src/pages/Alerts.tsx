import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RoleNavigation } from "@/components/RoleNavigation";
import UserSelectionModal from "@/components/UserSelectionModal";
import useAuthStore from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";
import { useToast } from "@/hooks/use-toast";
import { useAlertStore, type BackendAlert } from "@/stores/alertStore";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Users,
  UserCheck,
  UserX,
  Eye,
  Settings,
} from "lucide-react";

const Alerts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<BackendAlert | null>(null);

  const { user } = useAuthStore();
  const {
    company,
    isLoading: companyLoading,
    getCompanyByManagerId,
    getCompanyByEmployeeId,
  } = useCompanyStore();
  const { toast } = useToast();
  const {
    alerts,
    isLoading: alertsLoading,
    error: alertsError,
    getCompanyAlerts,
    acknowledgeAlert,
    resolveAlert,
    clearError,
  } = useAlertStore();

  useEffect(() => {
    if (!user) return;
    if (user.role === "manager" && user.id) {
      getCompanyByManagerId(user.id);
    } else if ((user.role === "employee" || user.role === "staff") && user.id) {
      getCompanyByEmployeeId(user.id);
    }
  }, [user, getCompanyByManagerId, getCompanyByEmployeeId]);

  useEffect(() => {
    if (company?._id) {
      getCompanyAlerts(company._id);
    }
  }, [company?._id, getCompanyAlerts]);

  useEffect(() => {
    if (alertsError) {
      toast({ title: "Alerts Error", description: alertsError, variant: "destructive" });
      clearError();
    }
  }, [alertsError, toast, clearError]);

  const getSeverityColor = (severity: BackendAlert["severity"]) => {
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

  const getStatusColor = (status: BackendAlert["status"]) => {
    switch (status) {
      case "new":
        return "text-red-400 border-red-400/30 bg-red-400/10";
      case "acknowledged":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      case "resolved":
        return "text-green-400 border-green-400/30 bg-green-400/10";
      default:
        return "text-gray-400 border-gray-400/30 bg-gray-400/10";
    }
  };

  const getTypeIcon = (metric: string | undefined) => {
    switch (metric) {
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

  const handleNotify = (alert: BackendAlert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleNotifyUsers = async (selectedUserIds: string[]) => {
    if (!selectedAlert) return;
    const ok = await acknowledgeAlert(selectedAlert._id);
    if (ok) {
      toast({
        title: "Notifications Sent",
        description: `Alert has been acknowledged and sent to ${selectedUserIds.length} user${
          selectedUserIds.length !== 1 ? "s" : ""
        }.`,
      });
    }
  };

  const handleFixed = async (alertId: string) => {
    await resolveAlert(alertId);
  };

  const isLoading = useMemo(() => companyLoading || alertsLoading, [companyLoading, alertsLoading]);

  return (
    <div className="min-h-screen ">
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
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid gap-6"
            >
              <Card className="glass-card p-6">
                <div className="flex items-center justify-center py-8 text-foreground/70">
                  Loading alerts...
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid gap-6"
            >
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                >
                  <Card className="glass-card p-6 border-l-4 border-l-red-400">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{getTypeIcon(alert.metric)}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {alert.message}
                            </h3>
                            <p className="text-foreground/70">
                              {alert.metric ? `${alert.metric}` : "Alert"}
                              {typeof alert.value === "number" ? ` • value: ${alert.value}` : ""}
                              {typeof alert.threshold === "number" ? ` • threshold: ${alert.threshold}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}
                          >
                            {alert.severity.toUpperCase()}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(alert.status)}`}
                          >
                            {alert.status.toUpperCase()}
                          </span>
                          <span className="text-sm text-foreground/60">
                            {new Date(alert.sent_at).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Button
                          onClick={() => handleNotify(alert)}
                          disabled={alert.status !== "new"}
                          variant="outline"
                          size="sm"
                          className="glass-card border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Notify
                        </Button>
                        <Button
                          onClick={() => handleFixed(alert._id)}
                          disabled={alert.status === "resolved"}
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
          )}

          {/* Empty State */}
          {!isLoading && alerts.length === 0 && (
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
        alertTitle={selectedAlert?.message || ""}
        onNotifyUsers={handleNotifyUsers}
      />
    </div>
  );
};

export default Alerts;
