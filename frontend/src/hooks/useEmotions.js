import { useState, useEffect, useCallback } from 'react';
import { getEmotions, createEmotionPost } from '../services/api';
import { useAnonymous } from '../context/AnonymousContext';

export const useEmotions = () => {
  const { userId } = useAnonymous();
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  // Fetch emotions
  const fetchEmotions = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await getEmotions(userId);
      setEmotions(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching emotions:', err);
      setError(err.response?.data?.error || 'Грешка при зареждане на емоциите');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Create new emotion
  const createEmotion = useCallback(async (emotionData) => {
    try {
      setCreating(true);
      setError('');
      const response = await createEmotionPost(emotionData);
      const newEmotion = response.data.data || response.data;
      
      // Add to beginning of list
      setEmotions(prev => [newEmotion, ...prev]);
      
      return { success: true, data: newEmotion };
    } catch (err) {
      console.error('Error creating emotion:', err);
      const errorMessage = err.response?.data?.error || 'Грешка при публикуване';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setCreating(false);
    }
  }, []);

  // Delete emotion
  const deleteEmotion = useCallback(async (emotionId) => {
    try {
      // Optimistically remove from UI
      setEmotions(prev => prev.filter(e => e._id !== emotionId));
      
      // TODO: Implement delete API call
      // await deleteEmotionApi(emotionId);
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting emotion:', err);
      // Rollback on error
      fetchEmotions();
      return { success: false };
    }
  }, [fetchEmotions]);

  // Initial fetch
  useEffect(() => {
    fetchEmotions();
  }, [fetchEmotions]);

  return {
    emotions,
    loading,
    error,
    creating,
    createEmotion,
    deleteEmotion,
    refetch: fetchEmotions
  };
};