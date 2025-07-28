import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ManagerDashboard from "./pages/dashboard/ManagerDashboard";
import StaffDashboard from "./pages/dashboard/StaffDashboard";
import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard";
import Insights from "./pages/Insights";
import CustomizeSettings from "./pages/settings/CustomizeSettings";
import UsersManagement from "./pages/dashboard/UsersManagement";
import EmployeesManagement from "./pages/dashboard/EmployeesManagement";

const queryClient = new QueryClient();

const App = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/dashboard/manager" element={<ManagerDashboard />} />
            <Route path="/dashboard/staff" element={<StaffDashboard />} />
            <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
            <Route path="/dashboard/users" element={<UsersManagement />} />
            <Route
              path="/dashboard/employees"
              element={<EmployeesManagement />}
            />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings/customize" element={<CustomizeSettings />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
