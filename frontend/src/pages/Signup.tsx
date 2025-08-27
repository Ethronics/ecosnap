import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Waves,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
  Building,
  Globe,
  ChevronDown,
  Crown,
  Zap,
  Star,
} from "lucide-react";
import useAuthStore from "@/stores/authStore";
import { useDomainStore } from "@/stores/domainStore";
import { usePlanStore } from "@/stores/planStore";

interface Domain {
  _id: string;
  name: string;
  description: string;
}

const Signup = () => {
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan");

  const [formData, setFormData] = useState({
    companyName: "",
    domainId: "",
    selectedPlanId: "",
    managerName: "",
    managerEmail: "",
    managerPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signup, error, signupSuccess, resetSignupSuccess } = useAuthStore();
  const { plans, getPlans, isLoading: plansLoading } = usePlanStore();

  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  const { domains, getDomains, isLoading: domainLoading } = useDomainStore();

  // Helper function to get selected plan name
  const getSelectedPlanName = () => {
    return (
      selectedPlan ||
      plans
        .find((p) => p._id === formData.selectedPlanId)
        ?.name.toLowerCase() ||
      "free"
    );
  };

  // Helper function to check if selected plan is free
  const isSelectedPlanFree = () => {
    return getSelectedPlanName() === "free";
  };

  // Fetch domains and plans from the database
  useEffect(() => {
    getDomains();
    getPlans();
  }, [getDomains, getPlans]);

  // Reset signup success when component mounts
  useEffect(() => {
    resetSignupSuccess();
  }, [resetSignupSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast({
        title: "Accept Terms Required",
        description:
          "You must agree to the Terms of Service and Privacy Policy to continue.",
        variant: "destructive",
      });
      return;
    }

    if (formData.managerPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.domainId) {
      toast({
        title: "Error",
        description: "Please select a domain.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPlan && !formData.selectedPlanId) {
      toast({
        title: "Error",
        description: "Please select a plan.",
        variant: "destructive",
      });
      return;
    }

    const planId = selectedPlan
      ? plans.find((p) => p.name.toLowerCase() === selectedPlan)?._id
      : formData.selectedPlanId;
    if (!planId) {
      toast({
        title: "Error",
        description: "Invalid plan selected.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const signupData = {
      companyName: formData.companyName,
      domainId: formData.domainId,
      planId: planId,
      managerData: {
        name: formData.managerName,
        email: formData.managerEmail,
        password: formData.managerPassword,
      },
    };

    const result = await signup(signupData);

    if (result.success) {
      const selectedPlanName = getSelectedPlanName();
      const isFreePlan = isSelectedPlanFree();

      if (isFreePlan) {
        toast({
          title: "Welcome to envoinsight!",
          description:
            "Your company and manager account have been created successfully. You can now log in to your dashboard.",
        });
        // Redirect to login for free plans
        navigate("/login");
      } else {
        // Store the selected plan for payment after login
        localStorage.setItem("pending_payment_plan", selectedPlanName);
      toast({
          title: "Welcome to envoinsight!",
        description:
            "Your company and manager account have been created successfully. Please log in to complete your payment.",
        });
        // Redirect to login first, then user will be redirected to payment
        navigate("/login");
      }
    } else {
      toast({
        title: "Signup failed",
        description:
          result.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 rounded-3xl"
        >
          <Link
            to="/"
            className="inline-flex items-center text-foreground/70 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>

          <div className="text-center mb-8">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 mb-4"
            >
              <Waves className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                envoinsight
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              Join envoinsight
            </h1>
            <p className="text-foreground/70 mt-2">
              Create your company and manager account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-white/20 pb-2">
                Company Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={handleInputChange("companyName")}
                    className="pl-10 glass-card border-white/20 text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domainId">Domain</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <select
                    id="domainId"
                    value={formData.domainId}
                    onChange={handleInputChange("domainId")}
                    aria-label="Select domain"
                    title="Select domain"
                    className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent appearance-none"
                    required
                    disabled={domainLoading}
                  >
                    <option value="" className="bg-background text-foreground">
                      {domainLoading ? "Loading domains..." : "Select a domain"}
                    </option>
                    {domains.map((domain) => (
                      <option
                        key={domain._id}
                        value={domain._id}
                        className="bg-background text-foreground"
                      >
                        {domain.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
                {formData.domainId && (
                  <p className="text-xs text-foreground/60 mt-1">
                    {
                      domains.find((d) => d._id === formData.domainId)
                        ?.description
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Plan Selection or Display */}
            {selectedPlan ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-white/20 pb-2">
                  Selected Plan
                </h3>
                {plansLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-foreground/60 mt-2">
                      Loading plan details...
                    </p>
                  </div>
                ) : (
                  (() => {
                    const plan = plans.find(
                      (p) => p.name.toLowerCase() === selectedPlan
                    );
                    if (!plan) return null;

                    const getPlanIcon = () => {
                      switch (plan.name) {
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
                    const PlanIcon = getPlanIcon();

                    return (
                      <div className="p-4 rounded-lg border-2 border-primary bg-primary/10">
                        <div className="flex items-center space-x-3 mb-3">
                          <PlanIcon className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold text-foreground">
                            {plan.name}
                          </h4>
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-2">
                          {plan.price.toLocaleString()} {plan.currency}
                          <span className="text-sm text-foreground/60">
                            /{plan.period}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/70">
                          {plan.description}
                        </p>
                      </div>
                    );
                  })()
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-white/20 pb-2">
                  Choose Your Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plansLoading ? (
                    <div className="col-span-3 text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      <p className="text-foreground/60 mt-2">
                        Loading plans...
                      </p>
                    </div>
                  ) : (
                    plans.map((plan) => {
                      const getPlanIcon = () => {
                        switch (plan.name) {
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
                      const PlanIcon = getPlanIcon();

                      return (
                        <div
                          key={plan._id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.selectedPlanId === plan._id
                              ? "border-primary bg-primary/10"
                              : "border-white/20 hover:border-primary/30"
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              selectedPlanId: plan._id,
                            }))
                          }
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <PlanIcon className="h-5 w-5 text-primary" />
                            <h4 className="font-semibold text-foreground">
                              {plan.name}
                            </h4>
                          </div>
                          <div className="text-2xl font-bold text-foreground mb-2">
                            {plan.price.toLocaleString()} {plan.currency}
                            <span className="text-sm text-foreground/60">
                              /{plan.period}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/70 mb-3">
                            {plan.description}
                          </p>
                          <ul className="text-xs text-foreground/60 space-y-1">
                            {plan.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Manager Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-white/20 pb-2">
                Manager Details
              </h3>

              <div className="space-y-2">
                <Label htmlFor="managerName">Manager Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="managerName"
                    type="text"
                    placeholder="Enter manager's full name"
                    value={formData.managerName}
                    onChange={handleInputChange("managerName")}
                    className="pl-10 glass-card border-white/20 text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerEmail">Manager Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="managerEmail"
                    type="email"
                    placeholder="Enter manager's email"
                    value={formData.managerEmail}
                    onChange={handleInputChange("managerEmail")}
                    className="pl-10 glass-card border-white/20 text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerPassword">Manager Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="managerPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password for manager"
                    value={formData.managerPassword}
                    onChange={handleInputChange("managerPassword")}
                    className="pl-10 pr-10 glass-card border-white/20 text-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm manager's password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange("confirmPassword")}
                    className="pl-10 pr-10 glass-card border-white/20 text-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms of Service & Privacy Policy */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="acceptTerms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(Boolean(checked))}
                />
                <Label htmlFor="acceptTerms" className="text-foreground/80">
                  I agree to the {" "}
                  <Link to="/terms-of-service" className="text-primary hover:text-accent">
                    Terms of Service
                  </Link>{" "}
                  and {" "}
                  <Link to="/privacy-policy" className="text-primary hover:text-accent">
                    Privacy Policy
                  </Link>
                  .
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary/80 hover:bg-primary text-white backdrop-blur-sm py-6 text-lg"
              disabled={isLoading || domainLoading}
            >
              {isLoading
                ? "Creating company..."
                : isSelectedPlanFree()
                ? "Create Company & Manager"
                : "Create Company & Continue to Payment"}
            </Button>

            {/* Plan-specific information */}
            {!isLoading && (
              <div className="text-center mt-4">
                <p className="text-sm text-foreground/60">
                  {isSelectedPlanFree()
                    ? "Free plan: Your account will be activated immediately after signup."
                    : "Paid plan: You'll be redirected to login, then to payment after signup."}
                </p>
              </div>
            )}
          </form>

          <div className="text-center mt-6">
            <p className="text-foreground/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-accent transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
