import { useContext } from 'react';
import { useActiveFile } from '../hooks/use-active-file';

import { Search } from 'lucide-react';
import { ToggleSearchContext } from '../contexts/toggle-search';
import { TabSearchInput } from './tab-search-input';
export const FileBar = () => {
  const file = useActiveFile();
  const { toggle, searchIsOpen } = useContext(ToggleSearchContext);
  if (!file) return null;

  console.log('search:', searchIsOpen);
  return (
    <div className='file-bar'>
      <p className={`file-bar-header ${searchIsOpen ? 'search' : ''}`}>
        {file.path}
        <Search width={18} height={18} onClick={toggle} />
      </p>
      {searchIsOpen && <TabSearchInput />}
    </div>
  );
};
