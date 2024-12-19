import { useContext } from 'react';
import { useActiveFile } from '../hooks/use-active-file';

import { Search } from 'lucide-react';
import { ToggleSearchContext } from '../contexts/toggle-search';
import { TabSearchPanel } from './tab-search-panel';
export const FileBar = () => {
  const file = useActiveFile();
  const { openSearch, searchIsOpen } = useContext(ToggleSearchContext);
  if (!file) return null;

  console.log('search:', searchIsOpen);
  return (
    <div className='file-bar'>
      <p className={`file-bar-header ${searchIsOpen ? 'search' : ''}`}>
        {file.path}
        <Search width={18} height={18} onClick={openSearch} />
      </p>
      {searchIsOpen && <TabSearchPanel />}
    </div>
  );
};
