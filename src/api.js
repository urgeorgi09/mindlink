// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// --- Добавяме X-User-Id към всички заявки ---
api.interceptors.request.use((config) => {
  const id = localStorage.getItem("anonymousUserId");
  if (id) config.headers["X-User-Id"] = id;
  return config;
});

// ---------- EMOTIONS ----------
export const getEmotions = (userId) =>
  api.get(`/emotions/${userId}`);

export const createEmotionPost = (data) =>
  api.post(`/emotions`, data);

// ---------- CHAT (ИСТОРИЯ) ----------
export const getChatMessages = (userId) =>
  api.get(`/chat/${userId}`);

export const sendChatMessage = (message) =>
  api.post(`/chat`, message);

// ---------- AI CHAT ----------
export const getAIResponse = (text) =>
  api.post(`/hf-chat`, { message: text });

// ---------- THERAPISTS ----------
export const getTherapists = (params) =>
  api.get(`/therapists`, { params });

export const addTherapist = (therapist) =>
  api.post(`/therapists`, therapist);

export default api;
