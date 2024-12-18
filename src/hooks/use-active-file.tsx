import { useParams } from 'wouter';
import { useActiveTab } from '../contexts/tab-context';
import { useFiles } from './useFiles';
export const useActiveFile = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { files } = useFiles(projectId);
  const activeTab = useActiveTab();
  return files?.find(file => file.id === activeTab) || null;
};
