import { useEffect, useState } from "react";

// TODO: 考虑扩展到存储 Set 用来放 ExpandedDirs
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localstorage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        if (storedValue !== undefined) {
          window.localStorage.setItem(key, JSON.stringify(storedValue));
        }
      }
    } catch (error) {
      console.error("Error setting localstorage", error);
    }
  }, [storedValue, key]);

  return [storedValue, setStoredValue];
};
