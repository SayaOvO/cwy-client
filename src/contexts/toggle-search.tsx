import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useReducer,
  useState,
} from 'react';

export const ToggleSearchContext = createContext<{
  openSearch: () => void;
  closeSearch: () => void;
  searchIsOpen: boolean;
}>({
  closeSearch: () => {},
  openSearch: () => {},
  searchIsOpen: false,
});

export const ToggleSearchProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [searchIsOpen, setSearchIsOpen] = useState(false);

  const openSearch = useCallback(() => {
    setSearchIsOpen(true);
  }, []);
  const closeSearch = useCallback(() => {
    setSearchIsOpen(false);
  }, []);
  const val = useMemo(() => ({
    searchIsOpen,
    openSearch,
    closeSearch,
  }), [searchIsOpen, openSearch, closeSearch]);
  return (
    <ToggleSearchContext value={val}>
      {children}
    </ToggleSearchContext>
  );
};
