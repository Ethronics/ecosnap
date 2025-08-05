import { API_URL } from "@/config/constant";
import { create } from "zustand";
import axios, { AxiosError } from "axios";

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

interface DomainConfig {
  domainId: string | { _id: string; name: string; description: string };
  name: string;
  description: string;
  place: string;
  config: {
    threshold_temp: number;
    threshold_humidity: number;
    parameters: ConfigParameters;
    updated_at: string;
  };
}

interface Config {
  _id: string;
  company_id: string;
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
  updateConfig: (configData: {
    company_id: string;
    domain_id: string;
    threshold_temp: number;
    threshold_humidity: number;
    parameters: ConfigParameters;
  }) => Promise<boolean>;
  getConfigByDomain: (
    companyId: string,
    domainId: string
  ) => Promise<Config | null>;
  clearError: () => void;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  configs: [],
  isLoading: false,
  error: null,

  updateConfig: async (configData: {
    company_id: string;
    domain_id: string;
    threshold_temp: number;
    threshold_humidity: number;
    parameters: ConfigParameters;
  }) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("envoinsight_token");
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
        const updatedCompany = response.data.data;

        // Extract the updated domain config from the company response
        const updatedDomain = updatedCompany.domains.find(
          (domain: DomainConfig) => {
            if (typeof domain.domainId === "string") {
              return domain.domainId === configData.domain_id;
            } else {
              return domain.domainId._id === configData.domain_id;
            }
          }
        );

        if (updatedDomain) {
          const domainId =
            typeof updatedDomain.domainId === "string"
              ? updatedDomain.domainId
              : updatedDomain.domainId._id;

          const updatedConfig: Config = {
            _id: domainId,
            company_id: configData.company_id,
            domain_id: configData.domain_id,
            threshold_temp: updatedDomain.config.threshold_temp,
            threshold_humidity: updatedDomain.config.threshold_humidity,
            parameters: updatedDomain.config.parameters,
            updated_at: updatedDomain.config.updated_at,
          };

          // Update the config in the store
          set((state) => ({
            configs: state.configs.some(
              (c) => c.domain_id === configData.domain_id
            )
              ? state.configs.map((c) =>
                  c.domain_id === configData.domain_id ? updatedConfig : c
                )
              : [...state.configs, updatedConfig],
            isLoading: false,
          }));
        }
        return true;
      }
      return false;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to update config";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  getConfigByDomain: async (companyId: string, domainId: string) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("envoinsight_token");
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
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to fetch config";
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
