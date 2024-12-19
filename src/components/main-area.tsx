import { Extension } from '@codemirror/state';
import { useEffect, useState } from 'react';
import { useActiveTab } from '../contexts/tab-context';
import { useActiveFile } from '../hooks/use-active-file';
import { getLanguageMode } from '../utils/import-language-mode';
import { EditorCore } from './editor-core';
import { FileBar } from './file-bar';
import { TabBar } from './tab-bar';

let render = 0;
export const MainArea = () => {
  // console.log(
  //   'main area render: ',
  //   render++,
  // );
  const activeFile = useActiveFile();
  const [mode, setMode] = useState<Extension[] | null>(null);
  useEffect(() => {
    let ignore = false;
    const loadMode = async () => {
      try {
        if (activeFile) {
          const mode = await getLanguageMode(activeFile.name);
          if (!ignore) {
            setMode(mode);
          }
        }
      } catch (error) {
        console.error('Failed to load language mode', error);
      }
    };
    loadMode();
    return () => {
      ignore = true;
    };
  }, [activeFile]);

  if (!activeFile || !mode) return <p>No active tab</p>;

  return (
    <main>
      <TabBar />
      <FileBar />
      <EditorCore mode={mode} />
    </main>
  );
};
