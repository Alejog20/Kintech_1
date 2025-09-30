import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode as a named export

// 1. Create the context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to decode token and set user
  const decodeAndSetUser = (token) => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // decoded will now contain id, name, email, and role
      } catch (error) {
        console.error("Error decoding token:", error);
        logout(); // Invalid token, log out
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // On initial load or token change, decode and set user
    decodeAndSetUser(token);
    setLoading(false); // Set loading to false after initial check
  }, [token]); // Depend on token

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    decodeAndSetUser(newToken); // Decode and set user immediately on login
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user && user.role === 'admin'; // New helper for admin check
  
  
  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
    isAdmin // Expose isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
