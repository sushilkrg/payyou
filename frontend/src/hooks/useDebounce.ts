import { useState, useEffect } from "react";

// Returns a debounced version of the value
// Updates only after `delay` ms of inactivity
// Used for username/email uniqueness checks to avoid firing on every keystroke

export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel timer if value changes before delay completes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
