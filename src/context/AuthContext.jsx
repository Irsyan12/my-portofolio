import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = async () => {
      try {
        const user = authAPI.getCurrentUser();
        const isAuthenticated = authAPI.isAuthenticated();

        if (user && isAuthenticated) {
          // Verify token is still valid by fetching profile
          try {
            const response = await authAPI.getProfile();
            if (response.success) {
              setCurrentUser(response.data);
            } else {
              // Token invalid, clear auth
              authAPI.logout();
              setCurrentUser(null);
            }
          } catch (error) {
            // Token invalid or expired
            console.error("Auth verification failed:", error);
            authAPI.logout();
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    if (response.success) {
      setCurrentUser(response.data.user);
    }
    return response;
  };

  const logout = () => {
    authAPI.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAuthenticated: authAPI.isAuthenticated,
    isAdmin: authAPI.isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
