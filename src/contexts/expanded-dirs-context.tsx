import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useLocalStorage } from '../hooks/use-localstorage';
import { type File } from '../types/file';
import { buildFileTree, FileWithChildren } from '../utils/build-file-tree';

const ExpandedDirsContext = createContext<Set<string>>(new Set());
const ToggleDirsContext = createContext<{
  toggleDirs: (id: string) => void;
  collapseAll: () => void;
}>({
  toggleDirs: () => {},
  collapseAll: () => {},
});

export const ExpandedDirsProvider = ({
  children,
  files,
}: {
  files: File[];
  children: ReactNode;
}) => {
  const root: FileWithChildren = useMemo(() => buildFileTree(files), [files]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(
    () => new Set<string>([root.id]),
  );

  const toggleDirs = useCallback((dirId: string) => {
    // work around
    // 理论上传入的 file 应该只为文件夹的，但是如果点击 tab 的话的同时将其所属的文件夹打开，我觉得放在这里实现比较简单
    // 好吧，也不简单 :(
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      const file = files.find((file) => file.id === dirId);
      if (file && file.fileType === 'regular') {
        if (!next.has(root.id)) {
          next.add(root.id);
        }
        let parent = files.find(x => x.id === file.parentId);
        while (parent) {
          if (!next.has(parent.id) && parent.fileType === 'directory') {
            next.add(parent.id);
          }
          parent = files.find(x => x.id === parent?.parentId);
        }
        return next;
      }

      if (next.has(dirId)) {
        next.delete(dirId);
      } else {
        next.add(dirId);
      }
      return next;
    });
  }, [root.id]);

  const collapseAll = useCallback(() => {
    setExpandedDirs(new Set([root.id]));
  }, []);
  const contextValue = useMemo(() => ({
    toggleDirs,
    collapseAll,
  }), [toggleDirs, collapseAll]);

  return (
    <ExpandedDirsContext value={expandedDirs}>
      <ToggleDirsContext
        value={contextValue}
      >
        {children}
      </ToggleDirsContext>
    </ExpandedDirsContext>
  );
};

export const useToggleDirs = () => {
  return useContext(ToggleDirsContext);
};

export const useExpandedDirs = () => {
  return useContext(ExpandedDirsContext);
};
