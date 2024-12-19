import { javascript } from '@codemirror/lang-javascript';
import { keymap } from '@codemirror/view';
import { basicSetup, EditorView } from 'codemirror';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'wouter';
import { useActiveTab } from '../contexts/tab-context';
import { ToggleSearchContext } from '../contexts/toggle-search';
import { EditorManager } from '../utils/editor-manager';
import { StatusLine } from './status-line';

export const EditorCore = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorManagerRef = useRef<EditorManager | null>(null);
  const { toggle } = useContext(ToggleSearchContext);
  const [cursorPosition, setCursorPosition] = useState('0:0');
  const { id: projectId } = useParams<{ id: string }>();
  const activeTab = useActiveTab();

  console.log('activeTab:', activeTab);

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

  useEffect(() => {
    if (!editorManagerRef.current) {
      editorManagerRef.current = new EditorManager(projectId);
    }
    return () => {
      console.log('files map', editorManagerRef?.current?.filesMap.entries());
      editorManagerRef.current?.destroy();
      editorManagerRef.current = null;
    };
  }, [projectId]);

  useEffect(() => {
    (async () => {
      if (containerRef.current && editorManagerRef.current) {
        console.log('active Tab:', activeTab);
        editorManagerRef.current.switchActiveFile(
          activeTab,
          containerRef.current,
          [
            getCursorPos,
            keymap.of([
              {
                key: 'Ctrl-s',
                run: () => {
                  toggle();
                  return true;
                },
              },
            ]),
          ],
        );
      }
    })();
  }, [activeTab]);

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
