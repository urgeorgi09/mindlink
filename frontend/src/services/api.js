import axios from 'axios';
import { getOrCreateUserId } from '../utils/userId';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || '';

// Axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor - добавя userId header и auth token
api.interceptors.request.use(
  config => {
    const userId = getOrCreateUserId();
    const token = localStorage.getItem('token');
    
    config.headers['x-ml-user'] = userId;
    config.headers['x-user-id'] = userId;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor - error handling
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // User-friendly error messages
    if (error.response) {
      const message = error.response.data?.error || error.response.data?.message || 'Грешка на сървъра';
      error.userMessage = message;
    } else if (error.request) {
      error.userMessage = 'Няма връзка със сървъра. Проверете интернет връзката си.';
    } else {
      error.userMessage = 'Възникна неочаквана грешка';
    }
    
    return Promise.reject(error);
  }
);

// ==================== EMOTIONS API ====================

/**
 * Зарежда емоциите на потребителя
 */
export const getEmotions = async (userId) => {
  try {
    const response = await api.get(`/emotions/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Създава нова емоция
 */
export const createEmotionPost = async (data) => {
  try {
    const payload = {
      mood: Number(data.mood),
      energy: Number(data.energy),
      note: data.note || ''
    };
    
    const response = await api.post('/emotions', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== JOURNAL API ====================

/**
 * Запазва дневников запис
 */
export const saveJournalEntry = async (data) => {
  try {
    const payload = {
      userId: getOrCreateUserId(),
      prompt: data.prompt,
      content: data.content,
      tags: data.tags || [],
      isPrivate: data.isPrivate !== false,
      wordCount: data.wordCount || 0
    };
    
    const response = await api.post('/journal', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Зарежда дневникови записи
 */
export const getJournalEntries = async () => {
  try {
    const userId = getOrCreateUserId();
    const response = await api.get(`/journal/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==================== USER API ====================

/**
 * Зарежда настройки на потребителя
 */
export const getUserSettings = async () => {
  try {
    const userId = getOrCreateUserId();
    const response = await api.get(`/user/${userId}/settings`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Обновява настройки на потребителя
 */
export const updateUserSettings = async (settings) => {
  try {
    const userId = getOrCreateUserId();
    const response = await api.put(`/user/${userId}/settings`, settings);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Експортира потребителски данни
 */
export const exportUserData = async () => {
  try {
    const userId = getOrCreateUserId();
    const response = await api.get(`/user/${userId}/export`, {
      responseType: 'blob'
    });
    
    // Създава download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mindlink-export-${userId}-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

/**
 * Изтрива потребителски данни
 */
export const deleteUserData = async (confirmation) => {
  try {
    const userId = getOrCreateUserId();
    const response = await api.delete(`/user/${userId}`, {
      data: { confirmation }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Създава backup ключ
 */
export const createBackup = async () => {
  try {
    const userId = getOrCreateUserId();
    const response = await api.post(`/user/${userId}/backup`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Възстановява от backup
 */
export const restoreFromBackup = async (backupKey) => {
  try {
    const response = await api.post('/user/restore', { backupKey });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;