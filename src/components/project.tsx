import { useParams } from 'wouter';
import { ExpandedDirsProvider } from '../contexts/expanded-dirs-context';
import { TabContextProvider } from '../contexts/tab-context';
import { ToggleSearchProvider } from '../contexts/toggle-search';
import { useFiles } from '../hooks/useFiles';
import { Editor } from './editor';
import { MainArea } from './main-area';

export const Project = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { files, isLoading } = useFiles(projectId);
  if (!files || isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <ExpandedDirsProvider files={files}>
      <TabContextProvider>
        <ToggleSearchProvider>
          <Editor>
            <MainArea />
          </Editor>
        </ToggleSearchProvider>
      </TabContextProvider>
    </ExpandedDirsProvider>
  );
};
