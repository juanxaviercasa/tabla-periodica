// Keep the current session usable when storage is blocked or full.
const sessionValues = new Map();

export function readStoredValue(key, fallback = null) {
  if (sessionValues.has(key)) return sessionValues.get(key);
  try {
    return globalThis.localStorage?.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStoredValue(key, value) {
  const text = String(value);
  try {
    globalThis.localStorage.setItem(key, text);
    sessionValues.delete(key);
    return true;
  } catch {
    sessionValues.set(key, text);
    return false;
  }
}
