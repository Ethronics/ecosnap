import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Crown, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { usePlanStore } from "@/stores/planStore";
import { useEffect } from "react";

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

// Icon mapping for plans
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

export const PlanSelectionModal = ({
  isOpen,
  onClose,
  currentPlan = "Free",
}: PlanSelectionModalProps) => {
  const navigate = useNavigate();
  const { plans, getPlans, isLoading } = usePlanStore();

  useEffect(() => {
    if (isOpen) {
      getPlans();
    }
  }, [isOpen, getPlans]);

  const handlePlanSelect = (planName: string) => {
    if (planName !== currentPlan) {
      navigate(`/signup?plan=${planName.toLowerCase()}`);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Choose Your Plan
                </h2>
                <p className="text-foreground/60 mt-2">
                  Current plan:{" "}
                  <span className="text-primary font-semibold">
                    {currentPlan}
                  </span>
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="glass-card hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-3 text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-foreground/60 mt-2">Loading plans...</p>
                </div>
              ) : plans.length === 0 ? (
                <div className="col-span-3 text-center py-8">
                  <p className="text-foreground/60">No plans available</p>
                </div>
              ) : (
                plans.map((plan, index) => {
                  const PlanIcon = getPlanIcon(plan.name);
                  return (
                    <motion.div
                      key={plan._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {plan.isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                          <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full">
                            Most Popular
                          </Badge>
                        </div>
                      )}

                      {plan.name === currentPlan && (
                        <div className="absolute -top-3 right-2 z-10">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1 rounded-full text-xs">
                            Current
                          </Badge>
                        </div>
                      )}

                      <Card
                        className={`glass-card h-full relative overflow-hidden transition-all duration-300 hover:scale-105 flex flex-col ${
                          plan.isPopular
                            ? "border-primary/50 shadow-2xl shadow-primary/20"
                            : plan.name === currentPlan
                            ? "border-green-500/50 shadow-2xl shadow-green-500/20"
                            : "border-white/10 hover:border-primary/30"
                        }`}
                      >
                        <CardHeader className="text-center pb-6">
                          <div className="flex justify-center mb-4">
                            <div
                              className={`p-3 rounded-full ${
                                plan.isPopular
                                  ? "bg-primary/20"
                                  : plan.name === currentPlan
                                  ? "bg-green-500/20"
                                  : "bg-foreground/10"
                              }`}
                            >
                              <PlanIcon
                                className={`h-6 w-6 ${
                                  plan.isPopular
                                    ? "text-primary"
                                    : plan.name === currentPlan
                                    ? "text-green-400"
                                    : "text-foreground/70"
                                }`}
                              />
                            </div>
                          </div>
                          <CardTitle className="text-2xl font-bold text-foreground">
                            {plan.name}
                          </CardTitle>
                          <p className="text-foreground/60">
                            {plan.description}
                          </p>

                          <div className="mt-6">
                            <div className="flex items-baseline justify-center">
                              <span className="text-4xl font-bold text-foreground">
                                {plan.price.toLocaleString()} {plan.currency}
                              </span>
                              <span className="text-foreground/60 ml-1">
                                /{plan.period}
                              </span>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0 flex-1 flex flex-col">
                          <ul className="space-y-3 mb-8 flex-1">
                            {plan.features.map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-start"
                              >
                                <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-foreground/80 text-sm">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <Button
                            onClick={() => handlePlanSelect(plan.name)}
                            className={`w-full ${
                              plan.name === currentPlan
                                ? "bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                                : plan.isPopular
                                ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                                : "bg-foreground/10 hover:bg-foreground/20 text-foreground"
                            }`}
                            size="lg"
                            disabled={plan.name === currentPlan}
                          >
                            {plan.name === currentPlan
                              ? "Current Plan"
                              : "Select Plan"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
