import { useContext } from 'react';
import { useActiveFile } from '../hooks/use-active-file';

import { Search } from 'lucide-react';
import { ToggleSearchContext } from '../contexts/toggle-search';
import { TabSearchPanel } from './tab-search-panel';
export const FileBar = () => {
  const file = useActiveFile();
  const { openSearch, searchIsOpen, closeSearch } = useContext(
    ToggleSearchContext,
  );
  if (!file) return null;

  return (
    <div className='file-bar'>
      <p className={`file-bar-header ${searchIsOpen ? 'search' : ''}`}>
        {file.path}
        <Search
          width={18}
          height={18}
          onClick={searchIsOpen ? closeSearch : openSearch}
        />
      </p>
      {searchIsOpen && <TabSearchPanel />}
    </div>
  );
};
