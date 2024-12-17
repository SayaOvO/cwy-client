import { File as FileIcon, FolderClosed, FolderOpen } from 'lucide-react';
import { memo, useCallback } from 'react';
import {
  useActiveTab,
  useSetActiveTab,
  useSetTabs,
} from '../contexts/tab-context';
import { File } from '../types/file';
import { FileWithChildren } from '../utils/build-file-tree';

interface FileExploreItemProps {
  node: FileWithChildren;
  onFileContextMenu: (node: FileWithChildren) => void;
  toggleDirs: (dirId: string) => void;
  expandedDirs: Set<string>;
}
export const FileExploreItem = memo((
  { node, onFileContextMenu, toggleDirs, expandedDirs }: FileExploreItemProps,
) => {
  const setTabs = useSetTabs();
  const setActiveTab = useSetActiveTab();
  const activeTab = useActiveTab();
  const openFile = useCallback((file: File) => {
    setTabs(
      currentTabs => {
        if (currentTabs.find(tab => tab.id === file.id)) {
          return currentTabs;
        }
        return [...currentTabs, { id: file.id, fileName: file.name }];
      },
    );
    setActiveTab(file.id);
  }, []);

  return (
    <div className={`folder`}>
      <div
        className={`file-item br-1 ${activeTab === node.id ? 'active' : ''}`}
        onContextMenu={() => onFileContextMenu(node)}
        onClick={() => {
          node.fileType === 'directory'
            ? toggleDirs(node.id)
            : openFile(node);
        }}
      >
        {node.fileType === 'directory'
          ? expandedDirs.has(node.id)
            ? <FolderOpen width={18} height={18} />
            : <FolderClosed width={18} height={18} />
          : <FileIcon width={18} height={18} />}
        {node.name}
      </div>
      {node.fileType === 'directory' && expandedDirs.has(node.id)
        && node.children.map(child => (
          <FileExploreItem
            node={child}
            key={child.id}
            onFileContextMenu={onFileContextMenu}
            toggleDirs={toggleDirs}
            expandedDirs={expandedDirs}
          />
        ))}
      <div className='fold-indicator' />
    </div>
  );
}, (oldProps, newProps) => {
  return oldProps.expandedDirs.size === newProps.expandedDirs.size
    && oldProps.node === newProps.node;
});
