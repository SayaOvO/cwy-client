import { memo } from 'react';

export const StatusLine = memo(({ cursorPos }: {
  cursorPos: string;
}) => {
  return <footer className='status-line'>{cursorPos}</footer>;
});
