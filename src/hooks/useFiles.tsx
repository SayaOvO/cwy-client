import { useCallback } from 'react';
import useSWR from 'swr';
import { useSetActiveTab, useSetTabs } from '../contexts/tab-context';
import { type File } from '../types/file';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

const API_URL = import.meta.env.PUBLIC_API_URL;
export const useFiles = (projectId: string) => {
  const { data, error, isLoading, mutate } = useSWR<File[]>(
    `${API_URL}/api/projects/${projectId}`,
    fetcher,
  );
  const setActiveTab = useSetActiveTab();
  const setTabs = useSetTabs();

  const createFile = useCallback(async (file: {
    name: string;
    path: string;
    parentId: string | null;
    fileType: 'directory' | 'regular';
    projectId: string;
  }) => {
    try {
      const response = await fetch(`${API_URL}/api/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          file,
        ),
      });
      const createdFile: File = await response.json();
      if (createdFile.fileType === 'regular') {
        setActiveTab(createdFile.id);
        setTabs((
          curr,
        ) => [{ id: createdFile.id, fileName: createdFile.name }, ...curr]);
      }
      mutate((currentData) => {
        return currentData ? [...currentData, createdFile] : [createdFile];
      }, { revalidate: false });
    } catch (error) {
      console.error('Failed to create file', error);
    }
  }, []);

  return {
    files: data,
    error,
    isLoading,
    createFile,
  };
};
