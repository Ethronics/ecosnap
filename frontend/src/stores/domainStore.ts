import { API_URL } from "../config/constant";
import { create } from "zustand";
import axios from "axios";

interface Domain {
  _id: string;
  name: string;
  description: string;
  config?: any;
}

interface DomainStore {
  domains: Domain[];
  isLoading: boolean;
  error: string | null;
  createDomain: (name: string, description: string) => Promise<boolean>;
  getDomains: () => Promise<void>;
  clearError: () => void;
}

export const useDomainStore = create<DomainStore>((set, get) => ({
  domains: [],
  isLoading: false,
  error: null,

  createDomain: async (name: string, description: string) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("envoinsight_token");
      const response = await axios.post(
        `${API_URL}/api/domain/create`,
        { name, description },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Add the new domain to the list
        const newDomain = response.data.data.domain;
        set((state) => ({
          domains: [...state.domains, newDomain],
          isLoading: false,
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create domain";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  getDomains: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.get(`${API_URL}/api/domain/all`);

      set({ domains: response.data.data, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch domains";
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
