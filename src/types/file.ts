export interface File {
  id: string;
  projectId: string;
  name: string;
  path: string;
  parentId: string | null;
  fileType: "directory" | "regular";
}
