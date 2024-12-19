import { indentWithTab } from '@codemirror/commands';
import { search } from '@codemirror/search';
import { Extension } from '@codemirror/state';
import { emmetConfig, EmmetKnownSyntax } from '@emmetio/codemirror6-plugin';
import type { Awareness } from 'y-protocols/awareness.js';
import { Text as YText } from 'yjs';

export enum LanguageType {
  JavaScript = 'javascript',
  TypeScript = 'typescript',
  JSX = 'jsx',
  TSX = 'tsx',
  CSS = 'css',
  HTML = 'html',
  JSON = 'json',
  Markdown = 'markdown',
  Plain = 'plain',
}

export class LanguageTypeManager {
  private static getFileExtension(fileName: string): string {
    return fileName.split('.').at(-1) || '';
  }

  static getLanguageType(fileName: string): LanguageType {
    const ext = this.getFileExtension(fileName);
    switch (ext) {
      case 'js':
        return LanguageType.JavaScript;
      case 'jsx':
        return LanguageType.JSX;
      case 'ts':
        return LanguageType.TypeScript;
      case 'tsx':
        return LanguageType.TSX;
      case 'css':
        return LanguageType.CSS;
      case 'html':
        return LanguageType.HTML;
      case 'json':
        return LanguageType.JSON;
      case 'md':
      case 'markdown':
        return LanguageType.Markdown;
      default:
        return LanguageType.Plain;
    }
  }
}

export class ExtensionsManager {
  private static async getLanguageExtension(
    languageType: LanguageType,
  ): Promise<Extension[]> {
    switch (languageType) {
      case LanguageType.JavaScript:
      case LanguageType.TypeScript: {
        const { javascript } = await import('@codemirror/lang-javascript');
        return [
          javascript({
            typescript: languageType === LanguageType.TypeScript,
          }),
        ];
      }
      case LanguageType.JSX:
      case LanguageType.TSX: {
        const { javascript } = await import('@codemirror/lang-javascript');
        return [
          javascript({
            typescript: languageType === LanguageType.TSX,
            jsx: true,
          }),
          emmetConfig.of({
            syntax: EmmetKnownSyntax.jsx,
          }),
        ];
      }

      case LanguageType.CSS: {
        const { css } = await import('@codemirror/lang-css');
        return [
          css(),
          emmetConfig.of({
            syntax: EmmetKnownSyntax.css,
          }),
        ];
      }
      case LanguageType.HTML: {
        const { html } = await import('@codemirror/lang-html');
        return [
          html(),
          emmetConfig.of({
            syntax: EmmetKnownSyntax.html,
          }),
        ];
      }
      case LanguageType.JSON: {
        const { json } = await import('@codemirror/lang-json');
        return [json()];
      }
      case LanguageType.Markdown: {
        const { markdown } = await import('@codemirror/lang-markdown');
        return [markdown()];
      }
      default:
        return [];
    }
  }
  private static async getBaseExtensions(
    yText: YText,
    awareness: Awareness,
  ): Promise<Extension[]> {
    const [
      { basicSetup },
      { yCollab },
      { keymap },
      { EditorView },
      { expandAbbreviation },
      { yUndoManagerKeymap },
      { search },
    ] = await Promise.all([
      import('codemirror'),
      import('y-codemirror.next'),
      import('@codemirror/view'),
      import('@codemirror/view'),
      import('@emmetio/codemirror6-plugin'),
      import('y-codemirror.next'),
      import('@codemirror/search'),
    ]);
    return [
      basicSetup,
      yCollab(yText, awareness),
      search({
        createPanel: (view) => ({
          dom: document.createElement('div'),
        }),
      }),
      keymap.of([
        indentWithTab,
        ...yUndoManagerKeymap,
        {
          key: 'Ctrl-j',
          run: expandAbbreviation,
        },
      ]),
      EditorView.theme({
        '&': { height: '100%' },
      }),
    ];
  }
  static async getExtensions(
    fileName: string,
    yText: YText,
    awareness: Awareness,
    additionalExtensions: Extension[] = [],
  ): Promise<Extension[]> {
    const fileType = LanguageTypeManager.getLanguageType(fileName);

    const [baseExtensions, languageExtension] = await Promise.all([
      this.getBaseExtensions(yText, awareness),
      this.getLanguageExtension(fileType),
    ]);

    return [...baseExtensions, ...languageExtension, ...additionalExtensions];
  }
}
