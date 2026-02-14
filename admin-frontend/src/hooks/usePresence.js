// frontend/src/hooks/usePresence.js
import { useState, useEffect } from 'react';

// Hook за проверка на онлайн статус на ЕДИН потребител
export const useUserStatus = (userId) => {
  const [status, setStatus] = useState({
    online: false,
    lastSeen: null,
    loading: true
  });

  useEffect(() => {
    if (!userId) {
      setStatus({ online: false, lastSeen: null, loading: false });
      return;
    }

    const checkStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/presence/status/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        
        setStatus({
          online: data.online || false,
          lastSeen: data.lastSeen || null,
          loading: false
        });
      } catch (error) {
        console.error('Error checking user status:', error);
        setStatus({
          online: false,
          lastSeen: null,
          loading: false
        });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Проверка на всеки 10 сек
    return () => clearInterval(interval);
  }, [userId]);

  return status;
};

// Hook за проверка на статуса на МНОГО потребители наведнъж (batch)
export const useBatchStatus = (userIds) => {
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    if (!userIds || userIds.length === 0) {
      setStatuses({});
      return;
    }

    const checkStatuses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/presence/status/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userIds })
        });
        const data = await response.json();
        
        // data.statuses е обект: { userId: { online, lastSeen }, ... }
        setStatuses(data.statuses || {});
      } catch (error) {
        console.error('Error checking batch statuses:', error);
        // При грешка, задаваме всички като offline
        const fallback = {};
        userIds.forEach(id => {
          fallback[id] = { online: false, lastSeen: null };
        });
        setStatuses(fallback);
      }
    };

    checkStatuses();
    const interval = setInterval(checkStatuses, 10000); // Проверка на всеки 10 сек
    return () => clearInterval(interval);
  }, [JSON.stringify(userIds)]); // Dependency на JSON string за да work-ва с масиви

  return statuses;
};

// Hook за изпращане на собствен heartbeat
export const usePresence = () => {
  useEffect(() => {
    // Временно изключено - backend не е готов
    return;
    
    const sendHeartbeat = async () => {
      try {
        const token = localStorage.getItem('token');
        await fetch('/api/presence/heartbeat', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        // Silent fail - не е критично ако heartbeat не мине
      }
    };

    // Изпращаме heartbeat веднага
    sendHeartbeat();
    
    // После на всеки 20 секунди
    const interval = setInterval(sendHeartbeat, 20000);
    
    // Cleanup при logout или затваряне на страницата
    const handleUnload = async () => {
      try {
        const token = localStorage.getItem('token');
        // Използваме sendBeacon за да работи при затваряне на таб
        navigator.sendBeacon(
          '/api/presence/offline',
          new Blob([JSON.stringify({})], { type: 'application/json' })
        );
      } catch {}
    };

    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
      // Маркираме като offline при unmount
      handleUnload();
    };
  }, []);
};