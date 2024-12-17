import { X } from 'lucide-react';
import { useCallback } from 'react';
import { useToggleDirs } from '../contexts/expanded-dirs-context';
import {
  useActiveTab,
  useCloseTab,
  useSetActiveTab,
  useTabs,
} from '../contexts/tab-context';

let render = 0;
export const TabBar = () => {
  console.log(
    'tab bar render: ',
    render++,
  );
  const tabs = useTabs();
  const activeTab = useActiveTab();
  const setActiveTab = useSetActiveTab();
  const closeTab = useCloseTab();
  const { toggleDirs } = useToggleDirs();

  const handleClick = useCallback((id: string) => {
    setActiveTab(id);
    // toggleDirs(id);
  }, []);

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
            <button onClick={() => handleClick(tab.id)} className='tab'>
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
