import { Extension } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { EditorView } from '@codemirror/view';
import { LanguageType } from '../types/langauge-types';

function similarity(a: string, b: string): number {
  let score = 0;
  const minLength = Math.min(a.length, b.length);

  for (let i = 0; i < minLength; i++) {
    if (a[i] === b[i]) score++;
  }

  return score;
}

function findNewCursorPosition(
  oldCode: string,
  newCode: string,
  oldPos: number,
): number {
  const contextLength = 20;
  const oldBefore = oldCode.slice(Math.max(0, oldPos - contextLength), oldPos);
  const oldAfter = oldCode.slice(
    oldPos,
    Math.min(oldCode.length, oldPos + contextLength),
  );

  let bestPos = 0;
  let bestScore = -1;

  for (let i = 0; i < newCode.length; i++) {
    const newBefore = newCode.slice(Math.max(0, i - contextLength), i);
    const newAfter = newCode.slice(
      i,
      Math.min(newCode.length, i + contextLength),
    );

    const beforeScore = similarity(oldBefore, newBefore);
    const afterScore = similarity(oldAfter, newAfter);
    const totalScore = beforeScore + afterScore;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestPos = i;
    }
  }

  return bestPos;
}

export class FormatService {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(
      new URL('./format-worker.ts', import.meta.url),
      { type: 'module' },
    );
  }

  formatCode(code: string, fileName: string): Promise<string> {
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        const formatted = event.data;
        resolve(formatted);
        this.worker.removeEventListener('message', handler);
      };
      this.worker.addEventListener('message', handler);
      this.worker.postMessage({ code, fileName });
    });
  }
  createFormatExtension(type: LanguageType): Extension {
    return keymap.of([
      {
        key: 'Ctrl-Shift-f',
        run: (view: EditorView) => {
          try {
            const doc = view.state.doc;
            this.formatCode(
              doc.toString(),
              `temp.${type}`,
            ).then(formatted => {
              const currentCode = doc.toString();
              const currentPos = view.state.selection.main.head;
              if (currentCode !== formatted) {
                const newPos = findNewCursorPosition(
                  currentCode,
                  formatted,
                  currentPos,
                );
                view.dispatch({
                  changes: {
                    from: 0,
                    to: doc.length,
                    insert: formatted,
                  },
                  selection: { anchor: newPos },
                  scrollIntoView: true,
                });
              }
            });

            return true;
          } catch (error) {
            console.error('Format failed:', error);
            return false;
          }
        },
      },
    ]);
  }

  dispose() {
    this.worker.terminate();
  }
}
