import { useEffect, useState } from "react";

/**
 * useState that transparently persists to localStorage.
 *
 * - Lazy initialiser reads the stored value on first render.
 * - An optional `deserialize` function sanitizes whatever was stored
 *   (handy for guarding against stale/corrupt data from older versions).
 * - Every change is written back (autosave) — no manual calls needed.
 * - All access is wrapped in try/catch so private-browsing mode or
 *   sandboxed iframes (where storage can throw) never crash the app.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  deserialize?: (raw: unknown) => T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      const parsed: unknown = JSON.parse(raw);
      return deserialize ? deserialize(parsed) : (parsed as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — the app keeps working in-memory */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
