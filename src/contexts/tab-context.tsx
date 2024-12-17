import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useLocalStorage } from '../hooks/use-localstorage';
import { type Tab } from '../types/tab';
import { useToggleDirs } from './expanded-dirs-context';

const TabContext = createContext<{
  tabs: Tab[];
  closeTab: (tabId: string) => void;
  activeTab: string;
}>({
  tabs: [],
  closeTab: () => {},
  activeTab: '',
});

const SetActiveTabContext = createContext<Dispatch<SetStateAction<string>>>(
  () => {},
);
const SetTabsContext = createContext<Dispatch<SetStateAction<Tab[]>>>(
  () => {},
);

export const TabContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [tabs, setTabs] = useLocalStorage<Tab[]>('tabs', []);
  const [activeTab, setActiveTab] = useLocalStorage<string>(
    'activeTab',
    tabs.length > 0 ? tabs[0].id : '',
  );
  const { toggleDirs } = useToggleDirs();

  console.log('tabs', tabs);
  console.log('active Tab', activeTab);

  const closeTab = useCallback((tabId: string) => {
    setTabs(currentTabs => {
      const newTabs = [...currentTabs];
      const idx = newTabs.findIndex(tab => tab.id === tabId);
      if (idx !== -1) {
        newTabs.splice(idx, 1);
        if (tabId === activeTab) {
          if (newTabs.length > 0) {
            if (idx === 0) {
              setActiveTab(newTabs[0].id);
            } else {
              setActiveTab(newTabs[idx - 1].id);
            }
          } else {
            setActiveTab('');
          }
        }
      }

      return newTabs;
    });
  }, [activeTab]);

  const contextValue = useMemo(() => ({
    tabs,
    closeTab,
    activeTab,
  }), [tabs, closeTab, activeTab]);

  useEffect(() => {
    if (activeTab) {
      toggleDirs(activeTab);
    }
  }, [activeTab, toggleDirs]);

  return (
    <SetActiveTabContext value={setActiveTab}>
      <SetTabsContext value={setTabs}>
        <TabContext
          value={contextValue}
        >
          {children}
        </TabContext>
      </SetTabsContext>
    </SetActiveTabContext>
  );
};

export const useTabs = () => {
  return useContext(TabContext).tabs;
};

export const useActiveTab = () => {
  return useContext(TabContext).activeTab;
};

export const useSetTabs = () => {
  return useContext(SetTabsContext);
};

export const useCloseTab = () => {
  return useContext(TabContext).closeTab;
};

export const useSetActiveTab = () => {
  return useContext(SetActiveTabContext);
};
