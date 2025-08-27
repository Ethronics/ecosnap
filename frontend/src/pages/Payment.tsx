import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Smartphone,
  Shield,
  CheckCircle,
} from "lucide-react";
import useAuthStore from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";
import { usePlanStore } from "@/stores/planStore";
import { usePaymentStore } from "@/stores/paymentStore";
import { paymentMethods } from "@/config/constant";

const planDetails = {
  free: { name: "Free", price: 0, period: "month" },
  pro: { name: "Pro", price: 9999, period: "month" },
  premium: { name: "Premium", price: 29999, period: "month" },
};

const ethiopianBanks = [
  { code: "CBE", name: "Commercial Bank of Ethiopia" },
  { code: "DBE", name: "Development Bank of Ethiopia" },
  { code: "BOA", name: "Bank of Abyssinia" },
  { code: "AIB", name: "Awash International Bank" },
  { code: "LIB", name: "Lion International Bank" },
  { code: "UBE", name: "United Bank" },
  { code: "NIB", name: "Nib International Bank" },
  { code: "COOP", name: "Cooperative Bank of Oromia" },
  { code: "BIRR", name: "M-Birr" },
  { code: "CBE_BIRR", name: "CBE Birr" },
];

export const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    company,
    getCompanyByManagerId,
    isLoading: companyLoading,
  } = useCompanyStore();
  const { plans, getPlans, isLoading: plansLoading } = usePlanStore();
  const { createPayment, isLoading: paymentLoading } = usePaymentStore();
  const { toast } = useToast();

  const selectedPlan = searchParams.get("plan") || "pro";

  // Use database plan instead of hardcoded planDetails
  const plan =
    plans.find(
      (p) =>
        p.name.toLowerCase() === selectedPlan.toLowerCase() ||
        p.name.toLowerCase().includes(selectedPlan.toLowerCase()) ||
        selectedPlan.toLowerCase().includes(p.name.toLowerCase())
    ) || planDetails[selectedPlan as keyof typeof planDetails];

  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [selectedBank, setSelectedBank] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch plans and company data
  useEffect(() => {
    getPlans();
    if (user?.id) {
      getCompanyByManagerId(user.id);
    }
  }, [getPlans, getCompanyByManagerId, user?.id]);

  // Debug logging when data changes
  useEffect(() => {
    if (company && plans.length > 0) {
      console.log("Payment component data loaded:", {
        company: {
          _id: company._id,
          companyName: company.companyName,
          manager: company.manager?.reference,
        },
        plans: plans.map((p) => ({ _id: p._id, name: p.name, price: p.price })),
        selectedPlan,
        user: user ? { id: user.id, name: user.name } : null,
      });
    }
  }, [company, plans, selectedPlan, user]);

  // Generate a unique transaction ID
  const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `TXN_${timestamp}_${random}`.toUpperCase();
  };

  const validatePaymentForm = () => {
    if (paymentMethod === "mobile_money") {
      if (!phoneNumber.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter your phone number.",
          variant: "destructive",
        });
        return false;
      }
      if (!selectedBank) {
        toast({
          title: "Validation Error",
          description: "Please select a bank.",
          variant: "destructive",
        });
        return false;
      }
    } else if (paymentMethod === "bank_transfer") {
      if (!selectedBank) {
        toast({
          title: "Validation Error",
          description: "Please select a bank.",
          variant: "destructive",
        });
        return false;
      }
    } else if (paymentMethod === "card") {
      if (!cardholderName.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter the cardholder name.",
          variant: "destructive",
        });
        return false;
      }
      if (!cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive",
        });
        return false;
      }
      if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid expiry date (MM/YY).",
          variant: "destructive",
        });
        return false;
      }
      if (!cardCvv.match(/^\d{3,4}$/)) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid CVV.",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!user || !company || !plans.length) {
      toast({
        title: "Error",
        description: "Missing user, company, or plan information.",
        variant: "destructive",
      });
      return;
    }

    // Validate company data structure
    if (!company._id || !company.companyName || !company.manager?.reference) {
      console.error("Invalid company data:", company);
      toast({
        title: "Error",
        description: "Company data is incomplete. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    // Validate user data
    if (!user.id || !user.name) {
      console.error("Invalid user data:", user);
      toast({
        title: "Error",
        description: "User data is incomplete. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    // Find the actual plan from the database - use more flexible matching
    const actualPlan = plans.find(
      (p) =>
        p.name.toLowerCase() === selectedPlan.toLowerCase() ||
        p.name.toLowerCase().includes(selectedPlan.toLowerCase()) ||
        selectedPlan.toLowerCase().includes(p.name.toLowerCase())
    );

    if (!actualPlan) {
      console.error(
        "Plan not found. Available plans:",
        plans.map((p) => p.name)
      );
      console.error("Selected plan:", selectedPlan);
      toast({
        title: "Error",
        description: `Selected plan "${selectedPlan}" not found in database. Available plans: ${plans
          .map((p) => p.name)
          .join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Check if payment is required (free plans don't need payment)
    if (actualPlan.price === 0) {
      toast({
        title: "No Payment Required",
        description: "This is a free plan. You can proceed without payment.",
      });
      navigate("/dashboard/manager");
      return;
    }

    // Validate payment form
    if (!validatePaymentForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment data
      const paymentData = {
        companyId: company._id,
        planId: actualPlan._id,
        managerId: user.id,
        amount: actualPlan.price,
        currency: "Birr",
        paymentMethod,
        transactionId: generateTransactionId(),
        status: "completed" as const,
      };

      // Debug logging to ensure data consistency
      console.log("Creating payment with data:", {
        companyId: company._id,
        companyName: company.companyName,
        planId: actualPlan._id,
        planName: actualPlan.name,
        managerId: user.id,
        managerName: user.name,
        amount: actualPlan.price,
        transactionId: paymentData.transactionId,
      });

      // Final validation before sending to backend
      if (
        !paymentData.companyId ||
        !paymentData.planId ||
        !paymentData.managerId
      ) {
        console.error("Payment data validation failed:", paymentData);
        toast({
          title: "Validation Error",
          description: "Payment data is incomplete. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Save payment to backend
      const success = await createPayment(paymentData);

      if (success) {
        const transactionId = paymentData.transactionId;
        toast({
          title: "Payment Successful!",
          description: `Your payment has been recorded. Transaction ID: ${transactionId}`,
        });

        // Redirect to manager dashboard after successful payment
        setTimeout(() => {
          navigate("/dashboard/manager");
        }, 2000);
      } else {
        toast({
          title: "Payment Failed",
          description:
            "There was an error processing your payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Payment Error",
        description: `Payment processing failed: ${errorMessage}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Show loading state while fetching data
  if (companyLoading || plansLoading) {
    return (
      <div className="min-h-screen bg-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading payment information...</p>
        </div>
      </div>
    );
  }

  // Show error if plan is not found
  if (!plan) {
    return (
      <div className="min-h-screen bg-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-500 mb-4">
            <Shield className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Plan Not Found
          </h1>
          <p className="text-foreground/60 mb-6">
            The selected plan "{selectedPlan}" could not be found. Available
            plans: {plans.map((p) => p.name).join(", ")}
          </p>
          <Button onClick={() => navigate("/dashboard/manager")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Redirect if user is not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }

  // Show error if company data is not available
  if (!company) {
    return (
      <div className="min-h-screen bg-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-500 mb-4">
            <Shield className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Company Information Not Found
          </h1>
          <p className="text-foreground/60 mb-6">
            Unable to load company information. Please contact support.
          </p>
          <Button onClick={() => navigate("/dashboard/manager")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-4 glass-card hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Complete Your Payment
            </h1>
            <p className="text-foreground/60 text-lg">
              Secure payment for your {plan.name} plan
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    Payment Method
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`glass-card p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                          paymentMethod === method.id
                            ? "border-primary/50 bg-primary/10"
                            : "border-white/10 hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <method.icon className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {method.name}
                              </span>
                              {method.popular && (
                                <Badge className="bg-primary/20 text-primary text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-foreground/60 mt-1">
                              {method.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Money Form */}
                {paymentMethod === "mobile_money" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+251 9XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank">Select Bank</Label>
                      <Select
                        value={selectedBank}
                        onValueChange={setSelectedBank}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {ethiopianBanks.map((bank) => (
                            <SelectItem key={bank.code} value={bank.code}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}

                {/* Bank Transfer Form */}
                {paymentMethod === "bank_transfer" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="bank-transfer">Select Bank</Label>
                      <Select
                        value={selectedBank}
                        onValueChange={setSelectedBank}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {ethiopianBanks.map((bank) => (
                            <SelectItem key={bank.code} value={bank.code}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="glass-card p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <h4 className="font-semibold text-primary mb-2">
                        Bank Account Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/60">
                            Account Name:
                          </span>
                          <span className="font-mono">
                            envoinsight Technologies PLC
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/60">
                            Account Number:
                          </span>
                          <span className="font-mono">1000123456789</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/60">Bank:</span>
                          <span>Commercial Bank of Ethiopia</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/60">Branch:</span>
                          <span>Addis Ababa Main Branch</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Card Form */}
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="cardholder">Cardholder Name</Label>
                      <Input
                        id="cardholder"
                        placeholder="John Doe"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardnumber">Card Number</Label>
                      <Input
                        id="cardnumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        className="mt-1"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) =>
                            setCardExpiry(formatExpiry(e.target.value))
                          }
                          className="mt-1"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) =>
                            setCardCvv(e.target.value.replace(/\D/g, ""))
                          }
                          className="mt-1"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || paymentLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                  size="lg"
                >
                  {isProcessing || paymentLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Pay ${plan.price.toLocaleString()} Birr`
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card h-fit">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60">Plan:</span>
                  <span className="font-semibold">{plan.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60">Duration:</span>
                  <span>1 {plan.period}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60">Amount:</span>
                  <span className="font-semibold">
                    {plan.price.toLocaleString()} Birr
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60">VAT (15%):</span>
                  <span>{(plan.price * 0.15).toLocaleString()} Birr</span>
                </div>
                <hr className="border-white/10" />
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">
                    {Math.round(plan.price * 1.15).toLocaleString()} Birr
                  </span>
                </div>

                <div className="glass-card p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-semibold">Secure Payment</span>
                  </div>
                  <p className="text-sm text-foreground/60">
                    Your payment information is encrypted and secure. We use
                    industry-standard SSL encryption.
                  </p>
                </div>

                <div className="glass-card p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-semibold">Payment Recording</span>
                  </div>
                  <p className="text-sm text-foreground/60">
                    All payments are recorded in our system for your records and
                    compliance purposes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
