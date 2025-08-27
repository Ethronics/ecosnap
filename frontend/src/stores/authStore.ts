import { API_URL } from "@/config/constant";
import { create } from "zustand";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  error: string | null;
  signupSuccess: boolean;
  initializeAuth: () => void;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string | null) => void;
  resetSignupSuccess: () => void;
  testConnection: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: {
    companyName: string;
    domainId: string;
    planId: string;
    managerData: {
      name: string;
      email: string;
      password: string;
    };
  }) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  error: null,
  signupSuccess: false,

  initializeAuth: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("envoinsight_token");
      const user = localStorage.getItem("envoinsight_user");

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          set({
            user: userData,
            isAuthenticated: true,
            token,
          });
          console.log("Auth initialized from localStorage:", userData);
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          localStorage.removeItem("envoinsight_token");
          localStorage.removeItem("envoinsight_user");
        }
      }
    }
  },

  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setToken: (token) => set({ token }),
  resetSignupSuccess: () => set({ signupSuccess: false }),

  testConnection: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/health`);
      console.log("Backend connection test:", response.data);
      return true;
    } catch (error) {
      console.error("Backend connection failed:", error);
      return false;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        if (typeof window !== "undefined") {
          localStorage.setItem("envoinsight_token", token);
          localStorage.setItem("envoinsight_user", JSON.stringify(user));
        }
        set({
          user,
          isAuthenticated: true,
          token,
          error: null,
        });
        return true;
      } else {
        set({ error: "Invalid email or password" });
        return false;
      }
    } catch (e: unknown) {
      const message =
        axios.isAxiosError(e) && e.response?.data?.message
          ? e.response.data.message
          : "Login failed";
      set({ error: message });
      return false;
    }
  },

  signup: async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/companies/create`,
        data
      );

      if (response.status === 201) {
        set({
          error: null,
          signupSuccess: true,
        });
        return { success: true, message: response.data.message };
      } else {
        set({ error: "Company creation failed" });
        return { success: false, message: "Company creation failed" };
      }
    } catch (e: unknown) {
      const message =
        axios.isAxiosError(e) && e.response?.data?.message
          ? e.response.data.message
          : "Company creation failed";
      set({ error: message });
      return { success: false, message };
    }
  },

  updateProfile: async (data) => {
    try {
      // Read current user from store/localStorage
      const storedUserRaw = typeof window !== "undefined" ? localStorage.getItem("envoinsight_user") : null;
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
      const userId: string | undefined = storedUser?.id || storedUser?._id;
      if (!userId) {
        return { success: false, message: "No authenticated user found" };
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("envoinsight_token") : null;
      const response = await axios.put(
        `${API_URL}/api/users/${userId}`,
        data,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      if (response.status === 200) {
        const updatedUser = response.data.data as User & { _id?: string };
        const normalized = { ...updatedUser, id: (updatedUser as any).id || updatedUser._id } as User;
        if (typeof window !== "undefined") {
          localStorage.setItem("envoinsight_user", JSON.stringify(normalized));
        }
        set({ user: normalized });
        return { success: true, message: "Profile updated successfully" };
      }
      return { success: false, message: "Failed to update profile" };
    } catch (e: unknown) {
      const message =
        axios.isAxiosError(e) && e.response?.data?.message
          ? e.response.data.message
          : "Failed to update profile";
      return { success: false, message };
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("envoinsight_token");
      localStorage.removeItem("envoinsight_user");
    }
    set({
      user: null,
      isAuthenticated: false,
      token: null,
      signupSuccess: false,
      error: null,
    });
  },
}));

export default useAuthStore;
