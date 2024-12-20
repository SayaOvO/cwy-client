import { Extension } from '@codemirror/state';
import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { EditorManagerProvider } from '../contexts/editor-manager';
import { useActiveTab } from '../contexts/tab-context';
import { useActiveFile } from '../hooks/use-active-file';
import { EditorCore } from './editor-core';
import { FileBar } from './file-bar';
import { TabBar } from './tab-bar';

let render = 0;
export const MainArea = () => {
  // console.log(
  //   'main area render: ',
  //   render++,
  // );
  const activeTab = useActiveTab();
  const { id: projectId } = useParams<{ id: string }>();

  if (!activeTab) return <p>No active tab</p>;

  return (
    <main>
      <TabBar />
      <EditorManagerProvider projectId={projectId}>
        {/* 我认为把 FileBar 放进 EditorCode 更好，因为 searc panel 有些功能需要依赖 cm 中的状态 */}
        <FileBar />
        <EditorCore />
      </EditorManagerProvider>
    </main>
  );
};
