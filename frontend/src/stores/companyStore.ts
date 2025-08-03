import { API_URL } from "@/config/constant";
import { create } from "zustand";
import axios from "axios";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Manager {
  reference: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface Domain {
  reference: {
    _id: string;
    name: string;
    description: string;
  };
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  limits: {
    domains: number;
    employees: number;
    requestsPerDay: number;
    dataRetention: number;
  };
  isPopular: boolean;
}

interface DomainItem {
  domainId: string;
  place: string;
}

interface Company {
  _id: string;
  companyName: string;
  manager: Manager;
  employees: Employee[];
  domain: Domain;
  domains: DomainItem[];
  plan: Plan;
  created_at: string;
}

interface CompanyStore {
  company: Company | null;
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  getCompanyByManagerId: (managerId: string) => Promise<void>;
  getAllCompanies: () => Promise<void>;
  addEmployee: (companyId: string, employeeId: string) => Promise<boolean>;
  removeEmployee: (companyId: string, employeeId: string) => Promise<boolean>;
  addDomain: (
    companyId: string,
    domainId: string,
    placeName: string
  ) => Promise<boolean>;
  clearError: () => void;
}

export const useCompanyStore = create<CompanyStore>((set, get) => ({
  company: null,
  companies: [],
  isLoading: false,
  error: null,

  getCompanyByManagerId: async (managerId: string) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("ecosnap_token");
      const response = await axios.get(`${API_URL}/api/companies/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const companies = response.data.data;
        const company = companies.find(
          (comp: Company) => comp.manager.reference._id === managerId
        );

        if (company) {
          set({ company, isLoading: false });
        } else {
          set({
            error: "No company found for this manager",
            isLoading: false,
          });
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch company data";
      set({ error: errorMessage, isLoading: false });
    }
  },

  getAllCompanies: async () => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("ecosnap_token");
      const response = await axios.get(`${API_URL}/api/companies/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        set({ companies: response.data.data, isLoading: false });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch companies";
      set({ error: errorMessage, isLoading: false });
    }
  },

  addEmployee: async (companyId: string, employeeId: string) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("ecosnap_token");
      const response = await axios.post(
        `${API_URL}/api/companies/${companyId}/employees`,
        { employeeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedCompany = response.data.data;
        set({ company: updatedCompany, isLoading: false });
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to add employee";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  removeEmployee: async (companyId: string, employeeId: string) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("ecosnap_token");
      const response = await axios.delete(
        `${API_URL}/api/companies/${companyId}/employees/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedCompany = response.data.data;
        set({ company: updatedCompany, isLoading: false });
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to remove employee";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  addDomain: async (companyId: string, domainId: string, placeName: string) => {
    try {
      set({ isLoading: true, error: null });

      const token = localStorage.getItem("ecosnap_token");
      const response = await axios.post(
        `${API_URL}/api/companies/${companyId}/domains`,
        { domainId, placeName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedCompany = response.data.data;
        set({ company: updatedCompany, isLoading: false });
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to add domain";
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
