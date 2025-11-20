import api from './api'; // axios instance configured with baseURL + auth header

export const saveJournalEntry = (data) => api.post('/journal', data);
export const getJournalEntries = () => api.get('/journal');
