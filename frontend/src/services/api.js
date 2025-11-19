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
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('anonymousUserId');
  if (userId) {
    config.headers['X-User-Id'] = userId;
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

export default api;