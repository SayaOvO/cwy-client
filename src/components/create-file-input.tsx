import { FC, KeyboardEvent, useState } from 'react';
import { File, FolderClosed } from 'lucide-react'

import { useClickOutside } from '../hooks/use-click-outside';
import { FileType } from '../types/file-type';

export const CreateFile: FC<{
  fileType: FileType;
  onCloseInput: () => void;
  onCreateFile: (fileName: string) => Promise<void>;
}> = ({ onCloseInput, onCreateFile, fileType }) => {
  const [fileName, setFilename] = useState('');
  const ref = useClickOutside<HTMLInputElement>(onCloseInput);

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      await onCreateFile(fileName);
      setFilename('');
    } else if (e.key === 'Escape') {
      onCloseInput();
    }
  };

  return (
    <div className='create-file-wrapper'>
      <div>
        {fileType === 'regular'
          ? <File width={18} height={18} />
          : <FolderClosed width={18} height={18} />}
      </div>
      <input
        autoFocus
        className='create-file-input'
        ref={ref}
        value={fileName}
        onChange={({ target }) => setFilename(target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
