import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { type File } from '../types/file';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

const API_URL = import.meta.env.PUBLIC_API_URL;
export const useFiles = (projectId: string) => {
  const { data, error, isLoading, mutate } = useSWR<File[]>(
    `${API_URL}/projects/${projectId}`,
    fetcher,
  );

  const createFile = useCallback(async (file: {
    name: string;
    path: string;
    parentId: string | null;
    fileType: 'directory' | 'regular';
    projectId: string;
  }) => {
    // console.log(
    //   'name:path:parentId:fileType',
    //   file.name,
    //   file.path,
    //   file.parentId,
    //   file.fileType,
    // );
    // return;
    try {
      const response = await fetch(`${API_URL}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          file,
        ),
      });
      const createdFile = await response.json();
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
