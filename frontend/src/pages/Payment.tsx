import { motion } from "framer-motion";
import { useState } from "react";
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

const ethiopianBanks = [
  { name: "Commercial Bank of Ethiopia (CBE)", code: "CBE" },
  { name: "Dashen Bank", code: "DASHEN" },
  { name: "Bank of Abyssinia", code: "BOA" },
  { name: "United Bank", code: "UB" },
  { name: "Cooperative Bank of Oromia", code: "CBO" },
  { name: "Lion International Bank", code: "LIB" },
  { name: "Wegagen Bank", code: "WEGAGEN" },
  { name: "Bank of Ethiopia", code: "BOE" },
  { name: "Nib International Bank", code: "NIB" },
  { name: "Cooperative Bank of Tigray", code: "CBT" },
  { name: "Lion Bank", code: "LION" },
  { name: "Zemen Bank", code: "ZEMEN" },
  { name: "Oromia International Bank", code: "OIB" },
  { name: "Bunna International Bank", code: "BIB" },
  { name: "Berhan International Bank", code: "BERHAN" },
];

const paymentMethods = [
  {
    id: "mobile_money",
    name: "Mobile Money",
    description: "CBE Birr, M-Birr, or other mobile money services",
    icon: Smartphone,
    popular: true,
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    description: "Direct bank transfer to our account",
    icon: Building2,
    popular: false,
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    description: "Visa, Mastercard, or local cards",
    icon: CreditCard,
    popular: false,
  },
];

const planDetails = {
  free: { name: "Free", price: 0, period: "month" },
  pro: { name: "Pro", price: 9999, period: "month" },
  premium: { name: "Premium", price: 29999, period: "month" },
};

export const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const selectedPlan = searchParams.get("plan") || "pro";
  const plan = planDetails[selectedPlan as keyof typeof planDetails];

  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [selectedBank, setSelectedBank] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Show success message and redirect to login
      toast({
        title: "Payment Successful!",
        description:
          "Your account has been activated. Please log in to access your dashboard.",
      });
      navigate("/login");
    }, 3000);
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
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                  size="lg"
                >
                  {isProcessing ? (
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
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
