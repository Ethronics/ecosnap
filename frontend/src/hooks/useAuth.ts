import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") !== null
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("token") !== null);
    };

    window.addEventListener("storage", handleStorageChange);

    // Check auth status on route change
    setIsAuthenticated(localStorage.getItem("token") !== null);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return { isAuthenticated, logout };
};
