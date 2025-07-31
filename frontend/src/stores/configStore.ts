import { API_URL } from "@/config/constant";
import { create } from "zustand";
import axios from "axios";

interface ConfigParameters {
  temperature: {
    min: number;
    max: number;
    optimal: number;
  };
  humidity: {
    min: number;
    max: number;
    optimal: number;
  };
}

interface Config {
  _id: string;
  domain_id: string;
  threshold_temp: number;
  threshold_humidity: number;
  parameters: ConfigParameters;
  updated_at: string;
}

interface ConfigStore {
  configs: Config[];
  isLoading: boolean;
  error: string | null;
  updateConfig: (configData: Partial<Config>) => Promise<boolean>;
  getConfigByDomain: (domainId: string) => Promise<Config | null>;
  clearError: () => void;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  configs: [],
  isLoading: false,
  error: null,

  updateConfig: async (configData: Partial<Config>) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/config/update`,
        configData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedConfig = response.data.data;

        // Update the config in the store
        set((state) => ({
          configs: state.configs.map((config) =>
            config.domain_id === configData.domain_id ? updatedConfig : config
          ),
          isLoading: false,
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update config";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  getConfigByDomain: async (domainId: string) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/config/update`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const config = response.data.data;

      // Add to store if not already present
      set((state) => ({
        configs: state.configs.some((c) => c.domain_id === domainId)
          ? state.configs.map((c) => (c.domain_id === domainId ? config : c))
          : [...state.configs, config],
        isLoading: false,
      }));

      return config;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch config";
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
