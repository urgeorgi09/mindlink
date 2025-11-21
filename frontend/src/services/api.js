import axios from 'axios';

// ✅ CORRECT: Use environment variable with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🌐 API URL:', API_URL); // Debug log

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Add auth token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  response => {
    console.log('✅ Response:', response.config.url, response.status);
    return response;
  },
  error => {
    console.error('❌ Response error:', error.message);
    
    if (error.response) {
      // Server responded with error
      console.error('Server error:', error.response.status, error.response.data);
    } else if (error.request) {
      // No response received
      console.error('No response from server. Check if backend is running at:', API_URL);
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Chat API
export const chatAPI = {
  sendMessage: (userId, message) => 
    api.post(`/chat/${userId}`, { message }),
  getHistory: (userId) => 
    api.get(`/chat/${userId}`),
  deleteHistory: (userId) => 
    api.delete(`/chat/${userId}`)
};

// Mood API
export const moodAPI = {
  create: (data) => api.post('/mood', data),
  getHistory: (days = 30) => api.get(`/mood/history?days=${days}`),
  getAnalytics: (period = 'month') => api.get(`/mood/analytics?period=${period}`)
};

// Journal API
export const journalAPI = {
  getAll: () => api.get('/features/journal'),
  create: (data) => api.post('/features/journal', data),
  getPrompts: () => api.get('/features/journal/prompts'),
  delete: (id) => api.delete(`/features/journal/${id}`)
};

// Badges API
export const badgesAPI = {
  getAll: () => api.get('/features/badges'),
  getProgress: () => api.get('/features/badges/progress')
};

// Stats API
export const statsAPI = {
  get: () => api.get('/features/stats'),
  update: (data) => api.post('/features/stats/update', data)
};

// Breathing API
export const breathingAPI = {
  complete: (data) => api.post('/features/breathing/complete', data),
  getStats: () => api.get('/features/breathing/stats')
};

// Goals API
export const goalsAPI = {
  getAll: () => api.get('/goals'),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.patch(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`)
};

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default api;