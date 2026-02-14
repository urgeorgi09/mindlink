import React, { createContext, useContext, useState, useEffect } from "react";

const AnonymousContext = createContext();

export const useAnonymous = () => {
  const context = useContext(AnonymousContext);
  if (!context) {
    throw new Error("useAnonymous must be used within AnonymousProvider");
  }
  return context;
};

export const AnonymousProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("user");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const normalizeRole = (role) => {
    const lower = typeof role === "string" ? role.toLowerCase() : "user";
    const roleHierarchy = {
      user: 1,
      therapist: 2,
      admin: 3,
    };
    return roleHierarchy[lower] ? lower : "user";
  };

  const syncFromStorage = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      setIsAuthenticated(true);
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setUserRole(normalizeRole(userData.role || "user"));
      } catch (e) {
        setUser(null);
        setUserRole("user");
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setUserRole("user");
    }
  };

  useEffect(() => {
    // Check if user is logged in
    syncFromStorage();

    // Sync across tabs/windows
    const handleStorage = (event) => {
      if (event.key === "token" || event.key === "user") {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const canAccess = (requiredRole) => {
    const roleHierarchy = {
      user: 1,
      therapist: 2,
      admin: 3,
    };
    const currentRole = normalizeRole(userRole);
    const required = normalizeRole(requiredRole);

    // Fallback to storage in case state is stale
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!isAuthenticated && !(token && userStr)) return false;

    return roleHierarchy[currentRole] >= roleHierarchy[required];
  };

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setUserRole(normalizeRole(userData.role || "user"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setUserRole("user");
  };

  const value = {
    user,
    userRole,
    isAuthenticated,
    canAccess,
    login,
    logout,
  };

  return <AnonymousContext.Provider value={value}>{children}</AnonymousContext.Provider>;
};
