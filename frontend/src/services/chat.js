import api from './api';

export const sendChatMessage = (data) => api.post('/chat', data); // backend returns { msg, newBadges }
