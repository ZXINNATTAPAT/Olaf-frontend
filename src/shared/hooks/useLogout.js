import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import authService from "../services/AuthService";

export default function useLogout() {
  const navigate = useNavigate();
  const { setUser, setAccessToken, setCSRFToken } = useAuth();

  const logout = async () => {
    try {
      // เรียก logout API
      await authService.logout();
      
      // Clear context state
      setUser({});
      setAccessToken(null);
      setCSRFToken(null);
      
      // Navigate to login page
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      
      // Clear state even if API call fails
      setUser({});
      setAccessToken(null);
      setCSRFToken(null);
      
      // Navigate to login page
      navigate("/auth/login", { replace: true });
    }
  };

  return logout;
}
