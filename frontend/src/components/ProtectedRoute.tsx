import { Navigate } from "react-router-dom";
import useAuthStore from "@/stores/authStore";

type UserRole = "admin" | "manager" | "staff" | "employee";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return <>{children}</>;
};
