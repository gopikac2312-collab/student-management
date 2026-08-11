import { useState, useEffect } from "react";

export function useStore(key, fallback) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Save failed for", key, e);
    }
  }, [data, key]);

  return [data, setData, true];
}