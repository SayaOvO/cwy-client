import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useLocalStorage } from '../hooks/use-localstorage';
import { type Tab } from '../types/tab';

const TabContext = createContext<{
  tabs: Tab[];
  closeTab: (tabId: string) => void;
  activeTab: string;
}>({
  tabs: [],
  closeTab: () => {},
  activeTab: '',
});

/* 分离出这两个 Action Context，目的是为了减少无关的重渲染，具体来讲是
在 FileExplore 中的 openFile 函数中有用这两个值，如果不提取出来的话，activeTab 的改变
也会导致 FileExplore 的重渲染，虽然影响不大，我仍不想这样无关的渲染产生
 */
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
