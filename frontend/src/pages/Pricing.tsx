import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePlanStore } from "@/stores/planStore";
import {
  Waves,
  Star,
  Zap,
  Crown,
  Check,
  AlertTriangle,
  ArrowRight,
  Globe,
  Users,
  Database,
  Calendar,
  TrendingUp,
  Lock
} from "lucide-react";
import { usePlanRestrictions } from '@/hooks/usePlanRestrictions';
import PlanRestriction from '@/components/PlanRestriction';
import UsageLimit from '@/components/UsageLimit';

export default function Pricing() {
  const [searchParams] = useSearchParams();
  const isUpgrade = searchParams.get("upgrade") === "true";
  const isExpired = searchParams.get("expired") === "true";
  const { plans, getPlans, isLoading } = usePlanStore();
  const { toast } = useToast();
  const { planLimits, checkUsage, getUpgradeSuggestion } = usePlanRestrictions();

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  useEffect(() => {
    if (isExpired) {
      toast({
        title: "Subscription Expired",
        description: "Your subscription has expired. Please choose a new plan to continue using EcoSnap.",
        variant: "destructive",
      });
    }
  }, [isExpired, toast]);

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case "Free":
        return Star;
      case "Pro":
        return Zap;
      case "Premium":
        return Crown;
      default:
        return Star;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 mb-6"
          >
            <Waves className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EcoSnap
            </span>
          </Link>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            {isUpgrade ? "Upgrade Your Plan" : isExpired ? "Renew Your Subscription" : "Choose Your Plan"}
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            {isUpgrade 
              ? "Unlock more features and scale your environmental monitoring capabilities"
              : isExpired
              ? "Your subscription has expired. Choose a plan to restore access to EcoSnap services."
              : "Select the perfect plan for your environmental monitoring needs"
            }
          </p>

          {isExpired && (
            <div className="mt-6 inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-red-600 font-medium">Subscription Expired</span>
            </div>
          )}
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {isLoading ? (
            <div className="col-span-3 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-foreground/60">Loading plans...</p>
            </div>
          ) : (
            plans.map((plan, index) => {
              const PlanIcon = getPlanIcon(plan.name);
              const isPopular = plan.isPopular;

              return (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative ${isPopular ? 'scale-105' : ''}`}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className={`glass-card p-6 rounded-3xl h-full ${
                    isPopular ? 'ring-2 ring-primary' : ''
                  }`}>
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <PlanIcon className="h-8 w-8 text-primary" />
                        <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                      </div>
                      
                      <div className="text-4xl font-bold text-foreground mb-2">
                        {plan.price === 0 ? "Free" : `${plan.price.toLocaleString()} ${plan.currency}`}
                      </div>
                      
                      {plan.price > 0 && (
                        <p className="text-foreground/60">per {plan.period}</p>
                      )}
                      
                      <p className="text-foreground/70 mt-3">{plan.description}</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-foreground/80">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-foreground">Plan Limits:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-foreground/60">Domains:</span>
                          <span className="font-medium">{plan.limits.domains}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-foreground/60">Employees:</span>
                          <span className="font-medium">{plan.limits.employees}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-foreground/60">Daily Requests:</span>
                          <span className="font-medium">{plan.limits.requestsPerDay}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-foreground/60">Data Retention:</span>
                          <span className="font-medium">{plan.limits.dataRetention} days</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className={`w-full ${
                        plan.name === "Free" 
                          ? "bg-gray-600 hover:bg-gray-700" 
                          : "bg-primary hover:bg-primary/80"
                      }`}
                      disabled={plan.name === "Free"}
                    >
                      {plan.name === "Free" ? "Current Plan" : "Choose Plan"}
                      {plan.name !== "Free" && <ArrowRight className="h-4 w-4 ml-2" />}
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-foreground/60 mb-4">
            Need help choosing a plan? Contact our sales team
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              to="/contact"
              className="text-primary hover:text-accent transition-colors"
            >
              Contact Sales
            </Link>
            <span className="text-foreground/30">|</span>
            <Link
              to="/faq"
              className="text-primary hover:text-accent transition-colors"
            >
              FAQ
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
