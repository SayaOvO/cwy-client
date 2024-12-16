import { FC, memo } from 'react';
import { useFiles } from '../hooks/useFiles';
import { type File } from '../types/file';
import { FileExplore } from './file-explore';
let count = 0;
export const SideBar: FC<{
  projectName: string;
  onResizeMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}> = memo(({ projectName, onResizeMouseDown }) => {
  console.log('render', count++);
  const { files } = useFiles(projectName);
  if (!files) return null;
  return (
    <aside className='sidebar'>
      <FileExplore files={files} />
      <div className='resize-handle' onMouseDown={onResizeMouseDown} />
    </aside>
  );
});
