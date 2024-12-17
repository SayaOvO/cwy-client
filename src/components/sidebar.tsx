import { FC, memo, ReactNode } from 'react';
import { useFiles } from '../hooks/useFiles';
let count = 0;
export const SideBar: FC<{
  projectName: string;
  onResizeMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
}> = memo(({ projectName, onResizeMouseDown, children }) => {
  console.log('side bar render', count++);
  const { files } = useFiles(projectName);

  if (!files) return null;
  return (
    <aside className='sidebar'>
      {children}
      <div className='resize-handle' onMouseDown={onResizeMouseDown} />
    </aside>
  );
});

SideBar.displayName = 'SideBar';
