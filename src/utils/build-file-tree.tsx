import { type File } from '../types/file';

export type FileWithChildren = File & {
  children: FileWithChildren[];
};

export const buildFileTree = (files: File[]): FileWithChildren => {
  let rootFile: File = files[0];

  const fileMap = new Map();
  files.forEach(file => {
    fileMap.set(file.id, {
      ...file,
      children: [],
    });
  });

  files.forEach(file => {
    const fileWithChildren = fileMap.get(file.id);
    const isDirectory = file.fileType === 'directory';
    if (file.parentId) {
      const parent = fileMap.get(file.parentId);
      if (parent) {
        if (isDirectory) {
          parent.children.unshift(fileWithChildren);
        } else {
          parent.children.push(fileWithChildren);
        }
      }
    } else {
      const root = fileMap.get(rootFile.id);
      if (file.id !== root.id) {
        if (isDirectory) {
          root.children.unshift(fileWithChildren);
        } else {
          root.children.push(fileWithChildren);
        }
      }
    }
  });

  return fileMap.get(rootFile.id);
};
