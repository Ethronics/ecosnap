import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import useSubscriptionStore from "@/stores/subscriptionStore";
import { AlertTriangle, Lock } from "lucide-react";

interface UsageTrackerProps {
  children: React.ReactNode;
  companyId: string;
  feature: "domains" | "employees" | "requests" | "data";
  dataSize?: number; // in MB, for data feature
}

export default function UsageTracker({ 
  children, 
  companyId, 
  feature, 
  dataSize = 0 
}: UsageTrackerProps) {
  const { subscription, getSubscription } = useSubscriptionStore();
  const { toast } = useToast();
  const [canProceed, setCanProceed] = useState(true);

  useEffect(() => {
    if (companyId) {
      getSubscription(companyId);
    }
  }, [companyId, getSubscription]);

  useEffect(() => {
    if (subscription) {
      const plan = subscription.plan;
      const limits = plan.limits;
      
      let allowed = true;
      let message = "";

      switch (feature) {
        case "domains":
          if (subscription.usage?.domainsUsed >= limits.domains) {
            allowed = false;
            message = `You have reached the maximum number of domains (${limits.domains}) for your ${plan.name} plan.`;
          }
          break;
          
        case "employees":
          if (subscription.usage?.employeesAdded >= limits.employees) {
            allowed = false;
            message = `You have reached the maximum number of employees (${limits.employees}) for your ${plan.name} plan.`;
          }
          break;
          
        case "requests":
          const today = new Date().toDateString();
          const lastRequestDate = subscription.usage?.lastRequestDate 
            ? new Date(subscription.usage.lastRequestDate).toDateString() 
            : "";
          
          if (today === lastRequestDate && (subscription.usage?.requestsToday || 0) >= limits.requestsPerDay) {
            allowed = false;
            message = `You have reached the daily request limit (${limits.requestsPerDay}) for your ${plan.name} plan.`;
          }
          break;
          
        case "data":
          if ((subscription.usage?.dataStored || 0) + dataSize >= limits.dataRetention * 1024) {
            allowed = false;
            message = `You have reached the data retention limit (${limits.dataRetention} days) for your ${plan.name} plan.`;
          }
          break;
      }

      if (!allowed) {
        setCanProceed(false);
        toast({
          title: "Plan Limit Reached",
          description: message,
          variant: "destructive",
        });
      } else {
        setCanProceed(true);
      }
    }
  }, [subscription, feature, dataSize, toast]);

  if (!canProceed) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Lock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Feature Locked</h3>
          <p className="text-foreground/70 mb-4">
            You've reached the limit for this feature on your current plan.
          </p>
          <button
            onClick={() => window.location.href = "/pricing?upgrade=true"}
            className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
