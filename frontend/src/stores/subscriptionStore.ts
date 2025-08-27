import { create } from "zustand";
import { API_URL } from "@/config/constant";
import axios from "axios";

interface Subscription {
  _id: string;
  company: string;
  plan: {
    _id: string;
    name: string;
    price: number;
    currency: string;
    features: string[];
    limits: {
      domains: number;
      employees: number;
      requestsPerDay: number;
      dataRetention: number;
    };
  };
  status: "active" | "expired" | "cancelled" | "pending" | "trial";
  startDate: string;
  endDate: string;
  billingCycle: "monthly" | "quarterly" | "yearly";
  amount: number;
  currency: string;
  autoRenew: boolean;
  daysUntilExpiration: number;
  expiresSoon: boolean;
  isActive: boolean;
}

interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  getSubscription: (companyId: string) => Promise<void>;
  renewSubscription: (companyId: string, billingCycle: string) => Promise<boolean>;
  cancelSubscription: (companyId: string) => Promise<boolean>;
  checkSubscriptionStatus: (companyId: string) => Promise<void>;
}

const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  isLoading: false,
  error: null,

  getSubscription: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const token = localStorage.getItem("ecosnap_token");
      const response = await axios.get(`${API_URL}/api/subscriptions/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ subscription: response.data.data });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch subscription";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  renewSubscription: async (companyId: string, billingCycle: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const token = localStorage.getItem("ecosnap_token");
      const response = await axios.put(
        `${API_URL}/api/subscriptions/${companyId}/renew`,
        { billingCycle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        await get().getSubscription(companyId);
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to renew subscription";
      set({ error: message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelSubscription: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const token = localStorage.getItem("ecosnap_token");
      const response = await axios.put(
        `${API_URL}/api/subscriptions/${companyId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        await get().getSubscription(companyId);
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to cancel subscription";
      set({ error: message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  checkSubscriptionStatus: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const token = localStorage.getItem("ecosnap_token");
      const response = await axios.get(`${API_URL}/api/subscriptions/${companyId}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ subscription: response.data.data.subscription });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to check subscription status";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useSubscriptionStore;
