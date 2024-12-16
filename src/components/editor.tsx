import { useCallback, useRef, useState } from 'react';
import { useParams } from 'wouter';
import { SideBar } from './sidebar';

export const Editor = () => {
  const { name } = useParams<{ name: string }>();
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
  const handleResize = (e: MouseEvent) => {
    if (!isResizing.current) {
      return;
    }
    const minWidth = 180;
    const maxWidth = window.innerWidth / 2;
    setSidebarWidth(Math.max(minWidth, Math.min(maxWidth, e.clientX)));
    document.body.style.cursor = 'w-resize';
  };

  return (
    <div
      className='editor'
      style={{
        gridTemplateColumns: `${sidebarWidth}px 1fr`,
      }}
    >
      <SideBar projectName={name} onResizeMouseDown={handleResizeMouseDown} />
    </div>
  );
};
