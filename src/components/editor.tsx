import { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'wouter';
import { useFiles } from '../hooks/useFiles';
import { FileExplore } from './file-explore';
import { SideBar } from './sidebar';

export const Editor = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { id: projectId } = useParams<{ id: string }>();
  const { files, isLoading } = useFiles(projectId);
  const isResizing = useRef<boolean>(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      isResizing.current = true;

      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', () => {
        isResizing.current = false;
        document.body.style.cursor = '';
      }, { once: true });
    },
    [],
  );

  const fileExplore = useMemo(() => <FileExplore files={files || []} />, [
    files,
  ]);
  const handleResize = (e: MouseEvent) => {
    if (!isResizing.current) {
      return;
    }
    const minWidth = 180;
    const maxWidth = window.innerWidth / 2;
    setSidebarWidth(Math.max(minWidth, Math.min(maxWidth, e.clientX)));
    document.body.style.cursor = 'w-resize';
  };

  if (!files || isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className='editor'
      style={{
        gridTemplateColumns: `${sidebarWidth}px 1fr`,
      }}
    >
      <SideBar projectId={projectId} onResizeMouseDown={handleResizeMouseDown}>
        {fileExplore}
      </SideBar>
      {children}
    </div>
  );
};
