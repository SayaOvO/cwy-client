import { File as FileIcon, FolderClosed, FolderOpen } from 'lucide-react';
import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'wouter';
import { useSetActiveTab, useSetTabs } from '../contexts/tab-context';
import { useFiles } from '../hooks/useFiles';
import { type File } from '../types/file';
import { FileType } from '../types/file-type';
import { buildFileTree, FileWithChildren } from '../utils/build-file-tree';
import { CreateFile } from './create-file-input';
import { SidebarContextMenu } from './sidebar-contextmenu';

let render = 0;
export const FileExplore: FC<{ files: File[] }> = ({
  files,
}) => {
  const root: FileWithChildren = useMemo(() => buildFileTree(files), [files]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(
    () => new Set<string>([root.id]),
  );
  console.log('file explore render:', render++);
  const { name: projectName } = useParams<{ name: string }>();
  const { createFile } = useFiles(projectName);
  const setTabs = useSetTabs();
  const setActiveTab = useSetActiveTab();
  const pathRef = useRef<string>('');
  const parentIdRef = useRef<string>('');
  const [path, setPath] = useState('');

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

  const toggleDirs = useCallback((dirId: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(dirId)) {
        next.delete(dirId);
      } else {
        next.add(dirId);
      }
      return next;
    });
  }, []);

  const [openMenu, setOpenMenu] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const [openInput, setOpenInput] = useState(false);
  const [createFileType, setCreateFileType] = useState<FileType>(
    'regular',
  );

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenMenu(true);
    setPos({
      x: e.clientX,
      y: e.clientY,
    });
  };
  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const handleOpenInput = useCallback((fileType: FileType) => {
    setOpenInput(true);
    setOpenMenu(false);
    setCreateFileType(fileType);
  }, []);

  const handleCloseInput = useCallback(() => {
    setOpenInput(false);
  }, []);

  const handleCreateFile = useCallback(async (fileName: string) => {
    createFile({
      name: fileName,
      projectName,
      path: pathRef.current + fileName,
      parentId: null,
      fileType: createFileType,
    });
    setOpenInput(false);
  }, [projectName, createFileType, pathRef.current]);

  const handleCollapseAll = useCallback(() => {
    setExpandedDirs(new Set([root.id]));
    setOpenMenu(false);
  }, []);

  const renderNode = (node: FileWithChildren, level: number) => {
    const padding = level * 20;
    return (
      <div
        key={node.id}
        style={{ paddingLeft: `${padding}px` }}
      >
        <div
          className='file-item br-1'
          onContextMenu={() => {
            if (node.fileType === 'directory') {
              pathRef.current = node.path + '/';
            } else {
              const seg = node.path.split('/');
              console.log('seg', seg);
              if (seg.length > 1) {
                seg.pop();
                pathRef.current = seg.join('/');
              } else {
                pathRef.current = '';
              }
            }
            console.log('path', pathRef.current);
          }}
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
          && node.children.map(child => renderNode(child, level + 1))}
      </div>
    );
  };
  return (
    <div className='file-explore' onContextMenu={handleOpenMenu}>
      <div>
        {renderNode(root, 0)}
        {openInput
          && (
            <CreateFile
              fileType={createFileType}
              onCreateFile={handleCreateFile}
              onCloseInput={handleCloseInput}
            />
          )}
      </div>
      {openMenu && (
        <SidebarContextMenu
          pos={pos}
          onCloseMenu={handleCloseMenu}
          onCollapseAll={handleCollapseAll}
          onCreateFile={handleOpenInput}
        />
      )}
    </div>
  );
};
