// src/context/AnonymousContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const AnonymousContext = createContext(null);

export const AnonymousProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      let id = localStorage.getItem("anonymousUserId");
      if (!id) {
        id = uuidv4();
        localStorage.setItem("anonymousUserId", id);
      }
      setUserId(id);
    } catch (e) {
      // fallback: create ephemeral id
      const fallback = `anon-${Date.now()}`;
      setUserId(fallback);
    }
  }, []);

  return (
    <AnonymousContext.Provider value={{ userId }}>
      {children}
    </AnonymousContext.Provider>
  );
};

export const useAnonymous = () => {
  const ctx = useContext(AnonymousContext);
  if (!ctx) throw new Error("useAnonymous must be used within AnonymousProvider");
  return ctx;
};
