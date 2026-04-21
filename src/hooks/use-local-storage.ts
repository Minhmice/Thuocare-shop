"use client";

import * as React from "react";

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function useLocalStorageState<T>(key: string, initialValue: T) {
  // IMPORTANT: keep server/client initial render identical to avoid hydration mismatches.
  // Always start from the provided `initialValue` and load localStorage in an effect.
  const [value, setValue] = React.useState<T>(initialValue);

  React.useEffect(() => {
    const stored = safeJsonParse<T>(window.localStorage.getItem(key));
    if (stored !== null) setValue(stored);
  }, [key]);

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

