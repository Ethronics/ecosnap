import { API_URL } from "@/config/constant";
import { create } from "zustand";
import axios, { AxiosError } from "axios";

export interface BackendAlert {
  _id: string;
  sensor_data_id: string;
  company_id: string;
  user_id?: string;
  message: string;
  type: "threshold_breach" | "anomaly" | "info" | "warning" | "critical";
  metric: string; // e.g., temperature, humidity
  value?: number;
  threshold?: number;
  severity: "low" | "medium" | "high" | "critical";
  audience_roles: string[]; // ["manager","staff","employee"]
  recipient_user_ids?: string[];
  status: "new" | "acknowledged" | "resolved";
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  sent_at: string;
  
}

interface AlertStoreState {
  alerts: BackendAlert[];
  isLoading: boolean;
  error: string | null;
  getCompanyAlerts: (companyId: string) => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<boolean>;
  resolveAlert: (alertId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useAlertStore = create<AlertStoreState>((set, get) => ({
  alerts: [],
  isLoading: false,
  error: null,

  getCompanyAlerts: async (companyId: string) => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem("envoinsight_token");
      const response = await axios.get(
        `${API_URL}/api/alerts/company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        set({ alerts: response.data.data as BackendAlert[], isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to fetch alerts";
      set({ error: errorMessage, isLoading: false });
    }
  },

  acknowledgeAlert: async (alertId: string) => {
    try {
      const token = localStorage.getItem("envoinsight_token");
      const response = await axios.post(
        `${API_URL}/api/alerts/${alertId}/acknowledge`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Optimistically update store
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a._id === alertId ? { ...a, status: "acknowledged", acknowledged_at: new Date().toISOString() } : a
          ),
        }));
        return true;
      }
      return false;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to acknowledge alert";
      set({ error: errorMessage });
      return false;
    }
  },

  resolveAlert: async (alertId: string) => {
    try {
      const token = localStorage.getItem("envoinsight_token");
      const response = await axios.post(
        `${API_URL}/api/alerts/${alertId}/resolve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a._id === alertId ? { ...a, status: "resolved", resolved_at: new Date().toISOString() } : a
          ),
        }));
        return true;
      }
      return false;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        "Failed to resolve alert";
      set({ error: errorMessage });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));


