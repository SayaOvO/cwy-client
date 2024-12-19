import { useActiveTab } from '../contexts/tab-context';
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
  if (activeTab === '') return <p>No active tab</p>;
  return (
    <main>
      <TabBar />
      <FileBar />
      <EditorCore />
    </main>
  );
};
