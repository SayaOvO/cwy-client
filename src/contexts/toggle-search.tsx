import { createContext, ReactNode, useMemo, useReducer } from 'react';

export const ToggleSearchContext = createContext<{
  toggle: () => void;
  searchIsOpen: boolean;
}>({
  toggle: () => {},
  searchIsOpen: false,
});

export const ToggleSearchProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [searchIsOpen, toggle] = useReducer(open => !open, false);

  const val = useMemo(() => ({
    searchIsOpen,
    toggle,
  }), [toggle, searchIsOpen]);
  return (
    <ToggleSearchContext value={val}>
      {children}
    </ToggleSearchContext>
  );
};
