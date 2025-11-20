import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor за добавяне на User ID
let anonId = localStorage.getItem("anonymousId");

if (!anonId) {
  anonId = crypto.randomUUID();
  localStorage.setItem("anonymousId", anonId);
}

// Автоматично добавяне към всички заявки
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.headers["x-anonymous-id"] = anonId;
  }

  return config;
});

// ==================== EMOTIONS ====================
export const getEmotions = (userId) => api.get(`/emotions/${userId}`);
export const createEmotionPost = (data) => api.post('/emotions', data);

// ==================== CHAT ====================
export const getChatMessages = (userId) => api.get(`/chat/${userId}`);
export const sendChatMessage = (data) => api.post('/chat', data);
export const getAIResponse = (message) => api.post('/chat/ai', { message });

// ==================== THERAPISTS ====================
export const getTherapists = (params) => api.get('/therapists', { params });

export const saveJournalEntry = (data) => {
  return api.post("/journal", data);
};

export const getJournalEntries = () => {
  return api.get("/journal");
};

export default api;