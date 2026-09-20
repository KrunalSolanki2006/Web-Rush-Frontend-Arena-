import { useState, useEffect } from 'react';

/**
 * Safe localStorage wrapper with try/catch handling.
 */
export function usePersistentState<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore write errors (e.g. quota exceeded or incognito)
    }
  }, [key, state]);

  return [state, setState];
}
