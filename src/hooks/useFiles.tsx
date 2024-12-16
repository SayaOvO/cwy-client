import useSWR from 'swr';
import { type File } from '../types/file';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

const API_URL = import.meta.env.PUBLIC_API_URL;
export const useFiles = (projectName: string) => {
  const { data, error, isLoading } = useSWR<File[]>(
    `${API_URL}/projects/${projectName}`,
    fetcher,
  );

  return {
    files: data,
    error,
    isLoading,
  };
};
