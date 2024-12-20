import { keymap } from '@codemirror/view';
import { EditorView } from 'codemirror';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'wouter';
import { useEditorManager } from '../contexts/editor-manager';
import { useActiveTab } from '../contexts/tab-context';
import { ToggleSearchContext } from '../contexts/toggle-search';
import { useActiveFile } from '../hooks/use-active-file';
import { EditorManager } from '../utils/editor-manager';
import { StatusLine } from './status-line';

export const EditorCore = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { openSearch } = useContext(ToggleSearchContext);
  const [cursorPosition, setCursorPosition] = useState('0:0');
  const editorManager = useEditorManager();
  const activeTab = useActiveTab();
  const activeFile = useActiveFile();

  const getCursorPos = useMemo(() =>
    EditorView.updateListener.of((updated) => {
      if (updated.selectionSet) {
        const selection = updated.state.selection.main;
        const doc = updated.state.doc;
        const lineNumber = doc.lineAt(selection.head).number;
        const column = selection.head - doc.line(lineNumber).from + 1;
        setCursorPosition(`${lineNumber}:${column}`);
      }
    }), []);

  const keymaps = useMemo(() =>
    keymap.of([
      {
        key: 'Ctrl-s',
        run: () => {
          openSearch();
          return true;
        },
      },
    ]), []);

  useEffect(() => {
    (async () => {
      if (
        containerRef.current && editorManager && activeTab
        && activeFile
      ) {
        const view = await editorManager.switchActiveFile(
          activeTab,
          activeFile.name,
          containerRef.current,
          [
            getCursorPos,
            keymaps,
          ],
        );
        view.focus();
      }
    })();
  }, [activeTab, activeFile, editorManager]);

  return (
    <>
      <div
        className='cm-container'
        ref={containerRef}
      />
      <StatusLine cursorPos={cursorPosition} />
    </>
  );
};
