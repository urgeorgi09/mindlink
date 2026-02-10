import api from "./api";

export const register = (email, password, role = "user") => {
  return api.post("/auth/register", { email, password, role });
};

export const login = (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const getMe = () => {
  return api.get("/auth/me");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};
