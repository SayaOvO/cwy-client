import { FC, useMemo, useState } from 'react';
import { FolderOpen, File as FileIcon, FolderClosed } from 'lucide-react'
import { type File } from '../types/file';
import { buildFileTree, FileWithChildren } from '../utils/build-file-tree';
import { getAllDirs } from '../utils/get-all-dirs';

export const FileExplore: FC<{ files: File[] }> = ({
  files,
}) => {
  const root: FileWithChildren = useMemo(() => buildFileTree(files), [files]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(
    () => new Set<string>([root.id]),
  );

  console.log('file tree', buildFileTree(files));
  const toggleDirs = (dirId: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(dirId)) {
        next.delete(dirId);
      } else {
        next.add(dirId);
      }
      return next;
    });
  };

  const renderNode = (node: FileWithChildren, level: number) => {
    const padding = level * 20;
    return (
      <div
        key={node.id}
        style={{ paddingLeft: `${padding}px` }}
      >
        <div
          className='file-item br-1'
          onClick={node.fileType === 'directory'
            ? () => toggleDirs(node.id)
            : () => {}}
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
    <ul>
      {renderNode(root, 0)}
    </ul>
  );
};
