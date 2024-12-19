import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'wouter';
import {
  useExpandedDirs,
  useToggleDirs,
} from '../contexts/expanded-dirs-context';
import { useFiles } from '../hooks/useFiles';
import { type File } from '../types/file';
import { type FileType } from '../types/file-type';
import { buildFileTree, FileWithChildren } from '../utils/build-file-tree';
import { CreateFile } from './create-file-input';
import { FileExploreItem } from './file-explore-item';
import { SidebarContextMenu } from './sidebar-contextmenu';

let render = 0;
export const FileExplore: FC<{ files: File[] }> = ({
  files,
}) => {
  const root: FileWithChildren = useMemo(() => buildFileTree(files), [files]);
  const expandedDirs = useExpandedDirs();
  const { toggleDirs, collapseAll } = useToggleDirs();
  // console.log('file explore render:', render++);
  const { id: projectId } = useParams<{ id: string }>();
  const { createFile } = useFiles(projectId);
  const pathRef = useRef<string>('');
  const parentIdRef = useRef<string>(root.id);

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

  const resetRef = useCallback(() => {
    parentIdRef.current = root.id;
    pathRef.current = '';
  }, [root]);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
    resetRef();
  }, [resetRef]);

  const handleOpenInput = useCallback((fileType: FileType) => {
    setOpenInput(true);
    setOpenMenu(false);
    setCreateFileType(fileType);
  }, []);

  const handleCloseInput = useCallback(() => {
    setOpenInput(false);
    resetRef();
  }, [resetRef]);

  const handleCreateFile = useCallback(async (fileName: string) => {
    createFile({
      name: fileName,
      projectId,
      path: pathRef.current + fileName,
      parentId: parentIdRef.current,
      fileType: createFileType,
    });
    setOpenInput(false);
    resetRef();
  }, [projectId, createFileType, pathRef.current, resetRef]);

  const handleCollapseAll = useCallback(() => {
    collapseAll();
    setOpenMenu(false);
  }, []);

  // 逻辑上正确性暂时没发现问题，暂时不动
  const handleFileContextMenu = useCallback((node: File) => {
    // update parentId
    if (node.id === root.id) {
      parentIdRef.current = root.id;
    } else {
      if (node.fileType === 'directory') {
        parentIdRef.current = node.id;
      } else {
        parentIdRef.current = node.parentId!; // only root file's parentId will be null
      }
    }
    if (node.fileType === 'directory') {
      if (node.id !== root.id) {
        pathRef.current = node.path + '/';
      }
    } else {
      const seg = node.path.split('/');
      if (seg.length > 1) {
        seg.pop();
        pathRef.current = seg.join('/');
      } else {
        pathRef.current = '';
      }
    }
  }, [root]);
  return (
    <div className='file-explore' onContextMenu={handleOpenMenu}>
      <>
        {
          <FileExploreItem
            node={root}
            onFileContextMenu={handleFileContextMenu}
            toggleDirs={toggleDirs}
            expandedDirs={expandedDirs}
          />
        }
        {openInput
          && (
            <CreateFile
              fileType={createFileType}
              onCreateFile={handleCreateFile}
              onCloseInput={handleCloseInput}
            />
          )}
      </>
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
