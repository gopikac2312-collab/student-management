import { useState, useEffect } from "react";

export function useStore(key, fallback) {
  const [data, setData] = useState(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await window.storage.get(key, false);
        if (!cancelled) setData(r ? JSON.parse(r.value) : fallback);
      } catch (e) {
        if (!cancelled) setData(fallback);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set(key, JSON.stringify(data), false);
      } catch (e) {
        console.error("Save failed for", key, e);
      }
    })();
  }, [data, loaded, key]);

  return [data, setData, loaded];
}