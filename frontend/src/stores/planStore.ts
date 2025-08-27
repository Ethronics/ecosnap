import { API_URL } from "../config/constant";
import { create } from "zustand";
import axios, { AxiosError } from "axios";

interface PlanLimits {
  domains: number;
  employees: number;
  requestsPerDay: number;
  dataRetention: number;
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  limits: PlanLimits;
  isPopular: boolean;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

interface UserPlan {
  userPlan: string;
  planDetails: Plan | null;
}

interface PlanStore {
  plans: Plan[];
  userPlan: UserPlan | null;
  isLoading: boolean;
  error: string | null;
  getPlans: () => Promise<void>;
  getPlanById: (id: string) => Promise<Plan | null>;
  getUserPlan: (userId: string) => Promise<void>;
  updateUserPlan: (userId: string, planName: string) => Promise<boolean>;
  createPlan: (planData: Partial<Plan>) => Promise<boolean>;
  updatePlan: (id: string, planData: Partial<Plan>) => Promise<boolean>;
  deletePlan: (id: string) => Promise<boolean>;
  initializeDefaultPlans: () => Promise<boolean>;
  clearError: () => void;
}

export const usePlanStore = create<PlanStore>((set, get) => ({
  plans: [],
  userPlan: null,
  isLoading: false,
  error: null,

  getPlans: async () => {
    try {
      set({ isLoading: true, error: null });

      console.log("Fetching plans from:", `${API_URL}/api/plans`);
      const response = await axios.get(`${API_URL}/api/plans`);

      if (response.status === 200) {
        console.log("Plans API response:", response.data);
        set({ plans: response.data.data, isLoading: false });
      }
    } catch (error) {
      console.error("Plans API error:", error);
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to fetch plans";
      set({ error: errorMessage, isLoading: false });
    }
  },

  getPlanById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(`${API_URL}/api/plans/${id}`);

      if (response.status === 200) {
        set({ isLoading: false });
        return response.data.data;
      }
      return null;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to fetch plan";
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  getUserPlan: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("envoinsight_token");
      const response = await axios.get(`${API_URL}/api/plans/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        set({ userPlan: response.data.data, isLoading: false });
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to fetch user plan";
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateUserPlan: async (userId: string, planName: string) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("envoinsight_token");
      const response = await axios.put(
        `${API_URL}/api/plans/user/${userId}`,
        { planName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the user plan in the store
        set({ userPlan: response.data.data, isLoading: false });
        return true;
      }
      return false;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to update user plan";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  createPlan: async (planData: Partial<Plan>) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("envoinsight_token");
      const response = await axios.post(`${API_URL}/api/plans`, planData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        // Add the new plan to the list
        const newPlan = response.data.data;
        set((state) => ({
          plans: [...state.plans, newPlan],
          isLoading: false,
        }));
        return true;
      }
      return false;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to create plan";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  updatePlan: async (id: string, planData: Partial<Plan>) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("envoinsight_token");
      const response = await axios.put(`${API_URL}/api/plans/${id}`, planData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Update the plan in the list
        const updatedPlan = response.data.data;
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan._id === id ? updatedPlan : plan
          ),
          isLoading: false,
        }));
        return true;
      }
      return false;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to update plan";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  deletePlan: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("envoinsight_token");
      const response = await axios.delete(`${API_URL}/api/plans/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Remove the plan from the list
        set((state) => ({
          plans: state.plans.filter((plan) => plan._id !== id),
          isLoading: false,
        }));
        return true;
      }
      return false;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to delete plan";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  initializeDefaultPlans: async () => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("envoinsight_token");
      const response = await axios.post(
        `${API_URL}/api/plans/initialize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Refresh the plans list
        await get().getPlans();
        return true;
      }
      return false;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to initialize plans";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
