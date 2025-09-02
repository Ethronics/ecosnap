import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RoleNavigation } from "@/components/RoleNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import useSubscriptionStore from "@/stores/subscriptionStore";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Crown,
  Zap,
  Star,
  Clock,
  Users,
  Globe,
  Database,
  TrendingUp,
  Loader2,
  Lock
} from "lucide-react";

export default function Subscription() {
  const { user } = useAuthStore();
  const { subscription, isLoading, error, getSubscription, renewSubscription, cancelSubscription } = useSubscriptionStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedBillingCycle, setSelectedBillingCycle] = useState("monthly");
  const [isRenewing, setIsRenewing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (user) {
      // Assuming user has companyId, you might need to adjust this
      const companyId = user.companyId || "default";
      getSubscription(companyId);
    }
  }, [user, getSubscription]);

  const handleRenewSubscription = async () => {
    if (!user) return;
    
    setIsRenewing(true);
    const companyId = user.companyId || "default";
    const success = await renewSubscription(companyId, selectedBillingCycle);
    
    if (success) {
      toast({
        title: "Subscription Renewed",
        description: "Your subscription has been renewed successfully!",
      });
    } else {
      toast({
        title: "Renewal Failed",
        description: "Failed to renew subscription. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsRenewing(false);
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    if (!confirm("Are you sure you want to cancel your subscription? This action cannot be undone.")) {
      return;
    }
    
    setIsCancelling(true);
    const companyId = user.companyId || "default";
    const success = await cancelSubscription(companyId);
    
    if (success) {
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
    } else {
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsCancelling(false);
  };

  const handleUpgradePlan = () => {
    navigate("/pricing?upgrade=true");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "expired":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "expired":
        return "bg-red-500/20 text-red-400";
      case "cancelled":
        return "bg-gray-500/20 text-gray-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case "Free":
        return <Star className="h-5 w-5" />;
      case "Pro":
        return <Zap className="h-5 w-5" />;
      case "Premium":
        return <Crown className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <RoleNavigation />
        <div className="pt-24 px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <RoleNavigation />
        <div className="pt-24 px-4 max-w-4xl mx-auto">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Subscription</h2>
            <p className="text-foreground/70 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <RoleNavigation />
      
      <div className="pt-24 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Subscription Management
          </h1>
          <p className="text-foreground/70 text-lg">
            Manage your EcoSnap subscription and monitor usage
          </p>
        </motion.div>

        {subscription ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Subscription */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getPlanIcon(subscription.plan.name)}
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {subscription.plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {subscription.plan.price.toLocaleString()} {subscription.plan.currency}
                      <span className="text-sm text-foreground/60">
                        /{subscription.billingCycle}
                      </span>
                    </div>
                    <Badge className={getStatusColor(subscription.status)}>
                      {getStatusIcon(subscription.status)}
                      <span className="ml-2 capitalize">{subscription.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Start Date:</span>
                      <span>{new Date(subscription.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">End Date:</span>
                      <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Auto-renew:</span>
                      <span>{subscription.autoRenew ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscription Actions & Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Subscription Status */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Subscription Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subscription.expiresSoon && subscription.status === "active" && (
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <span className="font-semibold text-yellow-600">Subscription Expiring Soon</span>
                      </div>
                      <p className="text-yellow-700 text-sm">
                        Your subscription will expire in {subscription.daysUntilExpiration} days. 
                        Renew now to avoid service interruption.
                      </p>
                    </div>
                  )}

                  {subscription.status === "expired" && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="font-semibold text-red-600">Subscription Expired</span>
                      </div>
                      <p className="text-red-700 text-sm">
                        Your subscription has expired. Upgrade your plan to continue using EcoSnap services.
                      </p>
                      <Button 
                        onClick={handleUpgradePlan}
                        className="mt-3 bg-red-600 hover:bg-red-700"
                      >
                        Upgrade Plan
                      </Button>
                    </div>
                  )}

                  {subscription.status === "active" && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-semibold text-green-600">Subscription Active</span>
                      </div>
                      <p className="text-green-700 text-sm">
                        Your subscription is active and you have full access to all features.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {subscription.daysUntilExpiration}
                      </div>
                      <div className="text-foreground/70">Days Left</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {subscription.billingCycle}
                      </div>
                      <div className="text-foreground/70">Billing Cycle</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Limits */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Plan Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-foreground/70">Domains</span>
                      </div>
                      <div className="text-lg font-semibold">
                        {subscription.plan.limits.domains === -1 ? 'Unlimited' : subscription.plan.limits.domains}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-foreground/70">Employees</span>
                      </div>
                      <div className="text-lg font-semibold">
                        {subscription.plan.limits.employees === -1 ? 'Unlimited' : subscription.plan.limits.employees}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-foreground/70">Daily Requests</span>
                      </div>
                      <div className="text-lg font-semibold">
                        {subscription.plan.limits.requestsPerDay === -1 ? 'Unlimited' : subscription.plan.limits.requestsPerDay}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-foreground/70">Data Retention</span>
                      </div>
                      <div className="text-lg font-semibold">
                        {subscription.plan.limits.dataRetention} days
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Actions */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Subscription Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subscription.status === "active" && (
                    <>
                      <div className="space-y-3">
                        <h4 className="font-semibold">Renew Subscription</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {["monthly", "quarterly", "yearly"].map((cycle) => (
                            <Button
                              key={cycle}
                              variant={selectedBillingCycle === cycle ? "default" : "outline"}
                              onClick={() => setSelectedBillingCycle(cycle)}
                              className="text-sm"
                            >
                              {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                            </Button>
                          ))}
                        </div>
                        <Button
                          onClick={handleRenewSubscription}
                          disabled={isRenewing}
                          className="w-full"
                        >
                          {isRenewing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Renewing...
                            </>
                          ) : (
                            "Renew Subscription"
                          )}
                        </Button>
                      </div>

                      <div className="border-t border-white/20 pt-4">
                        <Button
                          variant="outline"
                          onClick={handleCancelSubscription}
                          disabled={isCancelling}
                          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          {isCancelling ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            "Cancel Subscription"
                          )}
                        </Button>
                      </div>
                    </>
                  )}

                  {subscription.status === "expired" && (
                    <div className="text-center">
                      <Button
                        onClick={handleUpgradePlan}
                        className="w-full bg-primary hover:bg-primary/80"
                      >
                        Upgrade Plan
                      </Button>
                      <p className="text-sm text-foreground/70 mt-2">
                        Choose a plan that fits your needs
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <div className="text-center">
            <div className="glass-card p-8 rounded-3xl">
              <Clock className="h-16 w-16 text-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">No Subscription Found</h2>
              <p className="text-foreground/70 mb-6">
                It looks like you don't have an active subscription. Please contact support or upgrade your plan.
              </p>
              <Button onClick={handleUpgradePlan}>View Plans</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
