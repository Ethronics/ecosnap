import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authStore";
import { PlanSelectionModal } from "@/components/PlanSelectionModal";
import { useState } from "react";
import {
  Waves,
  LayoutDashboard,
  Eye,
  Settings,
  LogOut,
  Shield,
  Users,
  User,
  Crown,
  CreditCard,
} from "lucide-react";

export const RoleNavigation = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  console.log("RoleNavigation - User data:", user);

  if (!user) {
    console.log("RoleNavigation - No user found, returning null");
    return null;
  }

  const getRoleIcon = () => {
    switch (user.role) {
      case "admin":
        return <Shield className="h-5 w-5" />;
      case "manager":
        return <Shield className="h-5 w-5" />;
      case "staff":
        return <Users className="h-5 w-5" />;
      case "employee":
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case "admin":
        return "from-purple-400 to-purple-600";
      case "manager":
        return "from-amber-400 to-orange-500";
      case "staff":
        return "from-blue-400 to-indigo-500";
      case "employee":
        return "from-green-400 to-emerald-500";
    }
  };

  const getNavItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        path: `/dashboard/${user.role}`,
        icon: LayoutDashboard,
      },
    ];

    if (user.role === "admin") {
      baseItems.push(
        { name: "Users", path: "/dashboard/users", icon: Users },
        { name: "Companies", path: "/dashboard/companies", icon: Users },
        { name: "Settings", path: "/settings/customize", icon: Settings }
      );
    } else if (user.role === "manager") {
      baseItems.push(
        { name: "Insights", path: "/insights", icon: Eye },
        { name: "Settings", path: "/settings/customize", icon: Settings },
        { name: "Team", path: "/dashboard/users", icon: Users }
      );
    } else if (user.role === "staff") {
      baseItems.push(
        { name: "Insights", path: "/insights", icon: Eye },
        { name: "Employees", path: "/dashboard/employees", icon: Users }
      );
    }

    return baseItems;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 mx-4 mt-4"
      >
        <div className="glass-nav rounded-2xl px-6 w-full py-4">
          <div className="flex items-center justify-between max-w-full mx-10 ">
            <div className="flex items-center space-x-2">
              <Waves className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EcoSnap
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {getNavItems().map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`glass-card hover:bg-white/20 ${
                      location.pathname === item.path ? "bg-white/20" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}

              <Button
                onClick={() => navigate("/profile")}
                variant="ghost"
                className="flex items-center space-x-2 px-3 py-2 glass-card rounded-lg hover:bg-white/20 transition-colors"
              >
                {getRoleIcon()}
                <span
                  className={`font-medium bg-gradient-to-r ${getRoleColor()} bg-clip-text text-transparent capitalize`}
                >
                  {user.role}
                </span>
              </Button>

              <Button
                onClick={() => setIsPlanModalOpen(true)}
                variant="ghost"
                className="glass-card bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                Plans
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      <PlanSelectionModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        currentPlan={user?.plan || "Free"}
      />
    </>
  );
};
