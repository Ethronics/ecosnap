import { API_URL } from "@/config/constant";
import { create } from "zustand";
import axios, { AxiosError } from "axios";

interface Payment {
  _id: string;
  companyId: string;
  planId: string;
  managerId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
  updatedAt: string;
}

interface PaymentStore {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  createPayment: (paymentData: {
    companyId: string;
    planId: string;
    managerId: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    status: "completed" | "pending" | "failed";
  }) => Promise<boolean>;
  getCompanyPayments: (companyId: string) => Promise<void>;
  getAllPayments: () => Promise<void>;
  clearError: () => void;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],
  isLoading: false,
  error: null,

  createPayment: async (paymentData) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("envoinsight_token");
      const response = await axios.post(
        `${API_URL}/api/payments/create`,
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const newPayment = response.data.data;
        set((state) => ({
          payments: [...state.payments, newPayment],
          isLoading: false,
        }));
        return true;
      }
      return false;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to create payment";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  getCompanyPayments: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("envoinsight_token");
      const response = await axios.get(
        `${API_URL}/api/payments/company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        set({ payments: response.data.data, isLoading: false });
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to fetch company payments";
      set({ error: errorMessage, isLoading: false });
    }
  },

  getAllPayments: async () => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("envoinsight_token");

      // For now, let's try to get all payments and see what happens
      // The backend should handle role-based access
      console.log("Fetching payments from:", `${API_URL}/api/payments`);
      const response = await axios.get(`${API_URL}/api/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("Payments API response:", response.data);
        set({ payments: response.data.data, isLoading: false });
      }
    } catch (error) {
      console.error("Payments API error:", error);
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to fetch payments";
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
