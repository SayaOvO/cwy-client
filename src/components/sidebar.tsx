import { FC, memo, ReactNode } from 'react';
import { useFiles } from '../hooks/useFiles';
let count = 0;
export const SideBar: FC<{
  projectId: string;
  onResizeMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
}> = memo(({ projectId, onResizeMouseDown, children }) => {
  console.log('side bar render', count++);
  const { files } = useFiles(projectId);

  if (!files) return null;
  return (
    <aside className='sidebar'>
      {children}
      <div className='resize-handle' onMouseDown={onResizeMouseDown} />
    </aside>
  );
});

SideBar.displayName = 'SideBar';
