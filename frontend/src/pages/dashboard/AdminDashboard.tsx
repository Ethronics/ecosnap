import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RoleNavigation } from "@/components/RoleNavigation";
import { useToast } from "@/hooks/use-toast";
import { useDomainStore } from "@/stores/domainStore";
import { useCompanyStore } from "@/stores/companyStore";
import {
  Building,
  Globe,
  Users,
  Activity,
  Plus,
  Settings,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [domainName, setDomainName] = useState("");
  const [domainDescription, setDomainDescription] = useState("");
  const [isCreatingDomain, setIsCreatingDomain] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Stores
  const {
    domains,
    getDomains,
    createDomain,
    isLoading: domainLoading,
  } = useDomainStore();
  const {
    companies,
    getAllCompanies,
    isLoading: companyLoading,
  } = useCompanyStore();

  // Fetch data when component mounts
  useEffect(() => {
    getDomains();
    getAllCompanies();
  }, [getDomains, getAllCompanies]);

  const handleCreateDomain = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!domainName.trim() || !domainDescription.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both name and description fields.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingDomain(true);

    try {
      const success = await createDomain(domainName, domainDescription);

      if (success) {
        toast({
          title: "Success",
          description: "Domain created successfully!",
        });
        setDomainName("");
        setDomainDescription("");
        // Refresh domains list
        getDomains();
      } else {
        toast({
          title: "Error",
          description: "Failed to create domain. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingDomain(false);
    }
  };

  // Dummy data for additional cards
  const dummyData = {
    totalUsers: 1247,
    activeSessions: 89,
    systemHealth: "Excellent",
    lastBackup: "2 hours ago",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const generateRecentActivity = () => {
    const activities = [];

    // Add company activities based on actual data
    if (companies.length > 0) {
      const latestCompany = companies[companies.length - 1];
      const timeAgo = getTimeAgo(new Date(latestCompany.created_at));
      activities.push({
        message: `New company "${latestCompany.companyName}" registered`,
        time: timeAgo,
        color: "bg-green-400",
      });
    }

    // Add domain activities
    if (domains.length > 0) {
      const latestDomain = domains[domains.length - 1];
      activities.push({
        message: `Domain "${latestDomain.name}" is active`,
        time: "Current",
        color: "bg-blue-400",
      });
    }

    // Add employee activities
    const totalEmployees = companies.reduce(
      (total, company) => total + company.employees.length,
      0
    );
    if (totalEmployees > 0) {
      activities.push({
        message: `${totalEmployees} total employees across all companies`,
        time: "Current",
        color: "bg-orange-400",
      });
    }

    // Return the most recent 3 activities
    return activities.slice(0, 3);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return formatDate(date.toISOString());
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
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-center text-foreground/70 mb-8">
              System overview and administrative controls
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Total Companies */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Companies</h3>
                <Building className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-400">
                {companyLoading ? "..." : companies.length}
              </p>
              <p className="text-foreground/70 mt-2">
                Registered organizations
              </p>
            </Card>

            {/* Total Domains */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Domains</h3>
                <Globe className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-400">
                {domainLoading ? "..." : domains.length}
              </p>
              <p className="text-foreground/70 mt-2">Active domains</p>
            </Card>

            {/* Total Users */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <Users className="h-6 w-6 text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-orange-400">
                {dummyData.totalUsers}
              </p>
              <p className="text-foreground/70 mt-2">Registered users</p>
            </Card>

            {/* Active Sessions */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Active Sessions</h3>
                <Activity className="h-6 w-6 text-red-400" />
              </div>
              <p className="text-3xl font-bold text-red-400">
                {dummyData.activeSessions}
              </p>
              <p className="text-foreground/70 mt-2">Current online</p>
            </Card>
          </motion.div>

          {/* Domain Creation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold mb-6 text-foreground">
              Create New Domain
            </h2>
            <form onSubmit={handleCreateDomain} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="domain-name">Domain Name</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="domain-name"
                      type="text"
                      placeholder="Enter domain name"
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                      className="pl-10 glass-card border-white/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain-description">Description</Label>
                  <div className="relative">
                    <Settings className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="domain-description"
                      type="text"
                      placeholder="Enter domain description"
                      value={domainDescription}
                      onChange={(e) => setDomainDescription(e.target.value)}
                      className="pl-10 glass-card border-white/20"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={
                  isCreatingDomain ||
                  !domainName.trim() ||
                  !domainDescription.trim()
                }
                className="w-full bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-sm py-3"
              >
                {isCreatingDomain ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Domain...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Domain</span>
                  </div>
                )}
              </Button>
            </form>
          </motion.div>

          {/* System Status Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Domain Analytics */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Domain Analytics</h3>
                <Globe className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-blue-400">
                {domains.length > 0
                  ? `${Math.round(
                      (domains.length / (domains.length + 1)) * 100
                    )}%`
                  : "0%"}
              </p>
              <p className="text-foreground/70 mt-2">Domain utilization rate</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Active Domains</span>
                  <span className="text-blue-400">{domains.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Companies per Domain</span>
                  <span className="text-blue-400">
                    {domains.length > 0
                      ? Math.round(companies.length / domains.length)
                      : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Most Popular</span>
                  <span className="text-blue-400">
                    {domains.length > 0 ? domains[0]?.name || "N/A" : "N/A"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div className="space-y-3">
                {generateRecentActivity().map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 ${activity.color} rounded-full`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-foreground/60">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
                onClick={() => navigate("/dashboard/users")}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button
                className="w-full justify-start bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30"
                onClick={() => navigate("/dashboard/companies")}
              >
                <Building className="h-4 w-4 mr-2" />
                View Companies
              </Button>
              <Button
                className="w-full justify-start bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
