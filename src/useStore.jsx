import { useState, useEffect } from "react";
import { getItem, setItem } from "./localStorage.jsx";

export function useStore(key, fallback) {
  const [data, setData] = useState(() => getItem(key, fallback));
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    if (!loaded) return;
    setItem(key, data);
  }, [data, loaded, key]);

  return [data, setData, loaded];
}