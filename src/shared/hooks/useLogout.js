import useAuth from "./useAuth";
import authService from "../services/AuthService";

export default function useLogout() {
  const { setUser, setAccessToken, setCSRFToken } = useAuth();

  const logout = async () => {
    try {
      // Clear context state FIRST
      setUser({});
      setAccessToken(null);
      setCSRFToken(null);
      
      // Clear ALL localStorage items - use clear() to remove everything
      localStorage.clear();
      
      // Then call logout API to clear cookies on server
      await authService.logout();
      
      // Force page reload to ensure all state is cleared
      // Use window.location.href instead of navigate to force full page reload
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout error:", error);
      
      // Clear state even if API call fails
      setUser({});
      setAccessToken(null);
      setCSRFToken(null);
      
      // Clear ALL localStorage items even on error
      localStorage.clear();
      
      // Force page reload to ensure all state is cleared
      window.location.href = "/auth/login";
    }
  };

  return logout;
}
