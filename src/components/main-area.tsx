import { FileBar } from './file-bar';
import { TabBar } from './tab-bar';

let render = 0;
export const MainArea = () => {
  console.log(
    'main area render: ',
    render++,
  );
  return (
    <main>
      <TabBar />
      <FileBar />
    </main>
  );
};
