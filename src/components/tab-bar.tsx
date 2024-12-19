import { X } from 'lucide-react';
import { useCallback } from 'react';
import {
  useActiveTab,
  useCloseTab,
  useSetActiveTab,
  useTabs,
} from '../contexts/tab-context';

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
              <span className='x-container' onClick={() => closeTab(tab.id)}>
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
