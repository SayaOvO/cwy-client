import {
  findNext,
  findPrevious,
  openSearchPanel,
  SearchQuery,
  setSearchQuery,
} from '@codemirror/search';
import { CaseSensitive, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useEditorManager } from '../contexts/editor-manager';
import { useActiveTab } from '../contexts/tab-context';
import { ToggleSearchContext } from '../contexts/toggle-search';

export const TabSearchPanel = () => {
  const { closeSearch, searchIsOpen } = useContext(ToggleSearchContext);
  const [query, setQuery] = useState<string>('');
  const editorManager = useEditorManager();
  const activeTab = useActiveTab();
  const [matchCount, setMatchCount] = useState(0);
  const [caseSensitive, dispatch] = useReducer(state => !state, false);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    const newQuery = new SearchQuery({
      search: searchQuery,
      caseSensitive,
    });
    const view = editorManager?.getCurrentView(activeTab);
    if (view) {
      const cursor = newQuery.getCursor(view.state);
      let count = 0;
      let item = cursor.next();
      while (!item.done) {
        item = cursor.next();
        count++;
      }
      setMatchCount(count);
      openSearchPanel(view);
      view.dispatch({
        effects: setSearchQuery.of(newQuery),
      });
    }
  };

  useEffect(() => {
    const cancel = (e: KeyboardEvent) => {
      if (searchIsOpen && e.key === 'Escape') {
        closeSearch();
      }
    };
    document.addEventListener('keydown', cancel);
    return () => {
      document.removeEventListener('keydown', cancel);
    };
  }, []);

  const gotoNext = useCallback(() => {
    const view = editorManager?.getCurrentView(activeTab);
    if (view) {
      findNext(view);
    }
  }, [matchCount]);
  const gotoPrev = useCallback(() => {
    const view = editorManager?.getCurrentView(activeTab);
    if (view) {
      findPrevious(view);
    }
  }, []);

  console.log('case', caseSensitive);

  return (
    <div className='search-wrapper'>
      <div className='search-input-wrapper'>
        <input
          autoFocus
          value={query}
          onChange={handleSearch}
        />
        <div
          className={`case-icon-wrapper icon-wrapper ${
            caseSensitive && 'sensitive'
          }`}
        >
          <CaseSensitive width={16} height={16} onClick={dispatch} />
        </div>
      </div>
      <div className='icon-wrapper'>
        <ChevronLeft width={16} height={16} onClick={gotoPrev} />
      </div>
      <div className='icon-wrapper'>
        <ChevronRight width={16} height={16} onClick={gotoNext} />
      </div>
      <span>results: {matchCount}</span>
    </div>
  );
};
