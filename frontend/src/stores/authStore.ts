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
      const token = localStorage.getItem("ecosnap_token");
      const user = localStorage.getItem("ecosnap_user");

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
          localStorage.removeItem("ecosnap_token");
          localStorage.removeItem("ecosnap_user");
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
          localStorage.setItem("ecosnap_token", token);
          localStorage.setItem("ecosnap_user", JSON.stringify(user));
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

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ecosnap_token");
      localStorage.removeItem("ecosnap_user");
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
