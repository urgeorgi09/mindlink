import axios from 'axios';
import dotenv from 'dotenv';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Emotions API
export const getEmotions = () => api.get('/emotions');
export const createEmotionPost = (post) => api.post('/emotions', post);

// Chat API
export const getChatMessages = (userId) => api.get(`/chat/${userId}`);
export const sendChatMessage = (message) => api.post('/chat', message);

// Therapists API
export const getTherapists = (params) => api.get('/therapists', { params });
export const addTherapist = (therapist) => api.post('/therapists', therapist);

// Users API
export const createUser = (user) => api.post('/users', user);

export default api;