import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Full user object
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

    const initializeUser = async () => {
      try {
        // Optional: Validate token expiration (based on jwtDecode)
        const decoded = jwtDecode(token);
        if (Date.now() >= decoded.exp * 1000) {
          // Token expired
          logout();
          return;
        }

        // Fetch full user profile from backend
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (res.data.fetched) {
          setUser(res.data.me); // Store full DB user
        } else {
          logout();
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        logout();
      }
    };
  useEffect(() => {
    if (!token) return;
    initializeUser();
  }, [token]);

  const login = async (token, userDataFromBackend = null) => {
    localStorage.setItem("token", token);
    if (userDataFromBackend) {
      setUser(userDataFromBackend);
    } else {
      // fallback: fetch user
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (res.data.fetched) setUser(res.data.me);
      } catch (err) {
        console.error("Error fetching user after login:", err);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/models");
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser,login, logout,initializeUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use context
export const useAuth = () => useContext(AuthContext);