import { useEffect, useRef } from 'react';

export const useClickOutside = <T extends HTMLElement>(
  callback: () => void,
): React.RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const click = ({ target }: MouseEvent) => {
      if (target && ref.current && !ref.current.contains(target as Node)) {
        callback();
      }
    };

    document.addEventListener('click', click);

    return () => {
      document.removeEventListener('click', click);
    };
  }, [callback]);

  return ref;
};
