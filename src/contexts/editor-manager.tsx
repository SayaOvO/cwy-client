import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { EditorManager } from '../utils/editor-manager';

const EditorManagerContext = createContext<EditorManager | null>(null);

export const EditorManagerProvider = ({
  projectId,
  children,
}: {
  projectId: string;
  children: ReactNode;
}) => {
  const [editorManager] = useState<EditorManager>(() =>
    new EditorManager(projectId)
  );

  // Maybe there is a better solution, but I think it don't need to destory this instance
  // useEffect(() => {
  //   return () => {
  //     editorManager.destroy();
  //   };
  // }, []);
  return (
    <EditorManagerContext value={editorManager}>
      {children}
    </EditorManagerContext>
  );
};

export const useEditorManager = () => useContext(EditorManagerContext);
