import { X } from 'lucide-react';
import { MouseEvent } from 'react';
import {
  useActiveTab,
  useCloseTab,
  useSetActiveTab,
  useTabs,
} from '../contexts/tab-context';
import { type Tab } from '../types/tab';

let render = 0;
export const TabBar = () => {
  // console.log(
  //   'tab bar render: ',
  //   render++,
  // );
  const tabs = useTabs();
  const activeTab = useActiveTab();
  const setActiveTab = useSetActiveTab();
  const closeTab = useCloseTab();

  const hanldeCloseTab = (e: MouseEvent<HTMLSpanElement>, tab: Tab) => {
    e.stopPropagation();
    closeTab(tab.id);
  };

  if (activeTab === '') return null;
  return (
    <nav className='nav-tabs'>
      <ul role='tablist' className='tabs'>
        {tabs.map(tab => (
          <li
            key={tab.id}
            role='tab'
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
          >
            <button onClick={() => setActiveTab(tab.id)} className='tab'>
              {tab.fileName}
              <span
                className='x-container'
                onClick={(e) => hanldeCloseTab(e, tab)}
              >
                <X width={12} height={12} />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className='tabs-remaining' />
    </nav>
  );
};
