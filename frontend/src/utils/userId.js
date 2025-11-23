// utils/userId.js
import { v4 as uuidv4 } from "uuid";

export const getOrCreateUserId = () => {
  try {
    // ✅ Използвайте СЪЩИЯ ключ като AnonymousContext
    let userId = localStorage.getItem('anonymousUserId');
    
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('anonymousUserId', userId);
    }
    
    return userId;
  } catch (e) {
    return `anon-${Date.now()}`;
  }
};