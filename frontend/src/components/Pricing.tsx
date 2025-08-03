import { motion } from "framer-motion";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { usePlanStore } from "@/stores/planStore";
import { useEffect } from "react";

export const Pricing = () => {
  const { plans, getPlans, isLoading } = usePlanStore();

  useEffect(() => {
    getPlans();
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-glass-primary/10 to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core
            monitoring features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-3 text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-foreground/60 mt-4">Loading plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-foreground/60">No plans available</p>
            </div>
          ) : (
            plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card
                  className={`glass-card h-full relative overflow-hidden transition-all duration-300 hover:scale-105 flex flex-col ${
                    plan.isPopular
                      ? "border-primary/50 shadow-2xl shadow-primary/20"
                      : "border-white/10 hover:border-primary/30"
                  }`}
                >
                  <CardHeader className="text-center pb-6">
                    <div className="flex justify-center mb-4">
                      <div
                        className={`p-3 rounded-full ${
                          plan.isPopular ? "bg-primary/20" : "bg-foreground/10"
                        }`}
                      >
                        <Zap
                          className={`h-6 w-6 ${
                            plan.isPopular
                              ? "text-primary"
                              : "text-foreground/70"
                          }`}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {plan.name}
                    </CardTitle>
                    <p className="text-foreground/60">{plan.description}</p>

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
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground/80">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={`/signup?plan=${plan.name.toLowerCase()}`}
                      className="block mt-auto"
                    >
                      <Button
                        className={`w-full ${
                          plan.isPopular
                            ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                            : "bg-foreground/10 hover:bg-foreground/20 text-foreground"
                        }`}
                        size="lg"
                      >
                        {plan.name}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-foreground/50">
            Need a custom solution?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Contact our sales team
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
