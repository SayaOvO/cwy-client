import { javascript } from '@codemirror/lang-javascript';
import { keymap } from '@codemirror/view';
import { basicSetup, EditorView } from 'codemirror';
import { useContext, useEffect, useRef } from 'react';
import { ToggleSearchContext } from '../contexts/toggle-search';

export const EditorCore = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cmRef = useRef<EditorView | null>(null);
  const { toggle } = useContext(ToggleSearchContext);

  useEffect(() => {
    if (containerRef.current && !cmRef.current) {
      cmRef.current = new EditorView({
        extensions: [
          basicSetup,
          javascript(),
          keymap.of([{
            key: 'Ctrl-s',
            run: () => {
              toggle();
              return true;
            },
          }]),
        ],
        parent: containerRef.current,
      });
    }

    return () => {
      if (cmRef.current) {
        cmRef.current.destroy();
        cmRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className='cm-container'
      ref={containerRef}
    />
  );
};
