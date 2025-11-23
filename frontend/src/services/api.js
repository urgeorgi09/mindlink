import axios from 'axios';
import { getOrCreateUserId } from '../utils/userId';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🌐 API URL:', API_URL);

// Axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor - добавя userId header
api.interceptors.request.use(
  config => {
    const userId = getOrCreateUserId();
    config.headers['x-ml-user'] = userId;
    console.log('📤 Request:', config.method.toUpperCase(), config.url, { userId });
    return config;
  },
  error => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - логване на грешки
api.interceptors.response.use(
  response => {
    console.log('✅ Response:', response.config.url, response.status);
    return response;
  },
  error => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
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
    return response.data; // Връща масив директно
  } catch (error) {
    console.error('Get emotions error:', error);
    throw error;
  }
};

/**
 * Създава нова емоция
 */
export const createEmotionPost = async (data) => {
  try {
    // userId се добавя автоматично от interceptor в header
    const payload = {
      mood: Number(data.mood),
      energy: Number(data.energy),
      note: data.note || ''
    };
    
    console.log('📤 Creating emotion:', payload);
    
    const response = await api.post('/emotions', payload);
    return response.data;
  } catch (error) {
    console.error('Create emotion error:', error);
    throw error;
  }
};

// ==================== CHAT API ====================

/**
 * Зарежда чат съобщенията
 */
export const getChatMessages = async (userId) => {
  try {
    const response = await api.get(`/chat/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get chat messages error:', error);
    throw error;
  }
};

/**
 * Изпраща чат съобщение
 */
export const sendChatMessage = async (data) => {
  try {
    const payload = {
      userId: data.userId || getOrCreateUserId(),
      message: data.message,
      isAi: data.isAi || false
    };
    
    const response = await api.post('/chat', payload);
    return response.data;
  } catch (error) {
    console.error('Send chat message error:', error);
    throw error;
  }
};

/**
 * Получава AI отговор
 */
export const getAIResponse = async (message) => {
  try {
    const response = await api.post('/chat/ai', { message });
    return response.data;
  } catch (error) {
    console.error('AI response error:', error);
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
    
    console.log('📤 Saving journal:', payload);
    
    const response = await api.post('/journal', payload);
    return response.data;
  } catch (error) {
    console.error('Save journal error:', error);
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
    console.error('Get journal entries error:', error);
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
    console.error('Get user settings error:', error);
    throw error;
  }
};

/**
 * Обновява настройки
 */
export const updateUserSettings = async (settings) => {
  try {
    const userId = getOrCreateUserId();
    const response = await api.put(`/user/${userId}/settings`, settings);
    return response.data;
  } catch (error) {
    console.error('Update settings error:', error);
    throw error;
  }
};

/**
 * Експортира всички данни
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
    console.error('Export error:', error);
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
    console.error('Delete user error:', error);
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
    console.error('Create backup error:', error);
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
    console.error('Restore error:', error);
    throw error;
  }
};

export default api;