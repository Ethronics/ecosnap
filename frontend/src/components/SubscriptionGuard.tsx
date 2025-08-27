import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/authStore";
import useSubscriptionStore from "@/stores/subscriptionStore";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, XCircle } from "lucide-react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  companyId?: string;
  requiredPlan?: "Free" | "Pro" | "Premium";
}

export default function SubscriptionGuard({ 
  children, 
  companyId, 
  requiredPlan = "Free" 
}: SubscriptionGuardProps) {
  const { user } = useAuthStore();
  const { subscription, getSubscription, isLoading } = useSubscriptionStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showExpiredWarning, setShowExpiredWarning] = useState(false);

  useEffect(() => {
    if (user && companyId) {
      getSubscription(companyId);
    }
  }, [user, companyId, getSubscription]);

  useEffect(() => {
    if (subscription && !isLoading) {
      // Check if subscription is expired
      if (subscription.status === "expired") {
        setShowExpiredWarning(true);
        
        // Redirect to pricing page after 3 seconds
        const timer = setTimeout(() => {
          navigate("/pricing?expired=true");
        }, 3000);

        return () => clearTimeout(timer);
      }

      // Check if subscription expires soon (within 5 days)
      if (subscription.expiresSoon && subscription.status === "active") {
        toast({
         title: "Subscription Expiring Soon",
          description: `Your subscription will expire in ${subscription.daysUntilExpiration} days. Consider renewing to avoid service interruption.`,
          variant: "destructive",
        });
      }

      // Check plan requirements
      if (requiredPlan !== "Free") {
        const planHierarchy = { "Free": 0, "Pro": 1, "Premium": 2 };
        const userPlanLevel = planHierarchy[subscription.plan.name as keyof typeof planHierarchy] || 0;
        const requiredPlanLevel = planHierarchy[requiredPlan];

        if (userPlanLevel < requiredPlanLevel) {
          toast({
            title: "Plan Upgrade Required",
            description: `This feature requires a ${requiredPlan} plan or higher. Please upgrade your subscription.`,
            variant: "destructive",
          });
          navigate("/pricing?upgrade=true");
          return;
        }
      }
    }
  }, [subscription, isLoading, requiredPlan, navigate, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show expired warning
  if (showExpiredWarning) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background/50">
        <div className="glass-card p-8 rounded-3xl text-center max-w-md">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Subscription Expired</h1>
          <p className="text-foreground/70 mb-4">
            Your EcoSnap subscription has expired. You'll be redirected to the pricing page to renew your subscription.
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Redirecting in 3 seconds...</span>
          </div>
        </div>
      </div>
    );
  }

  // Render children if subscription is valid
  return <>{children}</>;
}
