import { API_URL } from "@/config/constant";
import { create } from "zustand";
import axios from "axios";

//get All users

interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UserStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  getUsers: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<boolean>;
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

  createUser: async (userData: CreateUserData) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/users/create`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Add the new user to the list
        const newUser = response.data.data;
        set((state) => ({
          users: [...state.users, newUser],
          isLoading: false,
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create user";
      set({ error: errorMessage, isLoading: false });
      console.log(errorMessage);
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
