import { MouseEvent } from 'react';
import { useClickOutside } from '../hooks/use-click-outside';
import { FileType } from '../types/file-type';

export const SidebarContextMenu: React.FC<{
  onCloseMenu: () => void;
  pos: { x: number; y: number };
  onCollapseAll: () => void;
  onCreateFile: (fileType: FileType) => void;
}> = ({ onCloseMenu, pos, onCollapseAll, onCreateFile }) => {
  const ref = useClickOutside<HTMLUListElement>(onCloseMenu);

  const handleCreateFile = (
    e: MouseEvent,
    fileType: FileType,
  ) => {
    e.stopPropagation();
    onCreateFile(fileType);
  };
  return (
    <ul
      ref={ref}
      className='sidebar-contextmenu'
      style={{
        left: pos.x,
        top: pos.y,
      }}
    >
      <li
        onClick={(e) => handleCreateFile(e, 'regular')}
      >
        新建文件
      </li>
      <li
        onClick={(e) => handleCreateFile(e, 'directory')}
      >
        新建目录
      </li>
      <li
        onClick={onCollapseAll}
      >
        折叠全部
      </li>
    </ul>
  );
};
