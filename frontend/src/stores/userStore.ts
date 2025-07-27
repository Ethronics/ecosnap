import { API_URL } from "@/config/constant";
import { create } from "zustand";
import axios from "axios";

//get All users

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface UserStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  getUsers: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  getUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/api/users/all`);
      set({ users: response.data.data, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch users";
      set({ error: errorMessage, isLoading: false });
      console.log(errorMessage);
    }
  },

  clearError: () => set({ error: null }),
}));
