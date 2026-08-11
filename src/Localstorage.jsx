export function getItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error("Failed to read", key, e);
    return fallback;
  }
}
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("Failed to save", key, e);
    return false;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error("Failed to remove", key, e);
    return false;
  }
}


export function clearAll() {
  try {
    localStorage.clear();
    return true;
  } catch (e) {
    console.error("Failed to clear storage", e);
    return false;
  }
}