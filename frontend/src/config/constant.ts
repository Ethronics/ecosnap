import { CreditCard, Building2, Smartphone } from "lucide-react";

export const API_URL = "http://localhost:4040";

export const paymentMethods = [
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