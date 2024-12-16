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
    if (file.parentId) {
      const parent = fileMap.get(file.parentId);
      if (parent) {
        parent.children.push(fileWithChildren);
      }
    } else {
      const root = fileMap.get(rootFile.id);
      if (file.id !== root.id) {
        root.children.push(fileWithChildren);
      }
    }
  });

  return fileMap.get(rootFile.id);
};
