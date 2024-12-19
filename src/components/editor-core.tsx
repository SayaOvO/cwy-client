import { Extension } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { EditorView } from 'codemirror';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'wouter';
import { useActiveTab } from '../contexts/tab-context';
import { ToggleSearchContext } from '../contexts/toggle-search';
import { useActiveFile } from '../hooks/use-active-file';
import { EditorManager } from '../utils/editor-manager';
import { StatusLine } from './status-line';

export const EditorCore = ({ mode }: { mode: Extension[] | null }) => {
  console.log('mode: in core', mode);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorManagerRef = useRef<EditorManager | null>(null);
  const { toggle } = useContext(ToggleSearchContext);
  const [cursorPosition, setCursorPosition] = useState('0:0');
  const { id: projectId } = useParams<{ id: string }>();
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
          toggle();
          return true;
        },
      },
    ]), []);

  useEffect(() => {
    if (!editorManagerRef.current) {
      editorManagerRef.current = new EditorManager(projectId);
    }
    return () => {
      editorManagerRef.current?.destroy();
      editorManagerRef.current = null;
    };
  }, [projectId]);

  useEffect(() => {
    (async () => {
      if (
        containerRef.current && editorManagerRef.current && activeTab
        && activeFile
      ) {
        editorManagerRef.current.switchActiveFile(
          activeTab,
          activeFile.name,
          containerRef.current,
          [
            getCursorPos,
            keymaps,
          ],
        );
      }
    })();
  }, [activeTab, activeFile]);

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
