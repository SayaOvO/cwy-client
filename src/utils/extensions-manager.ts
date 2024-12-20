import { indentWithTab } from '@codemirror/commands';
import { Extension } from '@codemirror/state';
import { emmetConfig, EmmetKnownSyntax } from '@emmetio/codemirror6-plugin';
import * as random from 'lib0/random';
import type { Awareness } from 'y-protocols/awareness.js';
import { Text as YText } from 'yjs';
import { LanguageType } from '../types/langauge-types';
import { FormatService } from './format-service';

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
    const formatService = new FormatService();
    switch (languageType) {
      case LanguageType.JavaScript:
      case LanguageType.TypeScript: {
        const { javascript } = await import('@codemirror/lang-javascript');
        const { lintGutter } = await import('@codemirror/lint');
        const { createLinter } = await import('./create-linter');
        const linter = languageType === LanguageType.JavaScript
          ? [createLinter({}), lintGutter()]
          : [];
        return [
          javascript({
            typescript: languageType === LanguageType.TypeScript,
          }),
          formatService.createFormatExtension(LanguageType.JavaScript),
          ...linter,
        ];
      }
      case LanguageType.JSX:
      case LanguageType.TSX: {
        const { javascript } = await import('@codemirror/lang-javascript');
        const { createLinter } = await import('./create-linter');
        const { lintGutter } = await import('@codemirror/lint');

        const linter = languageType === LanguageType.JSX
          ? [createLinter({ jsx: true }), lintGutter()]
          : [];

        return [
          javascript({
            typescript: languageType === LanguageType.TSX,
            jsx: true,
          }),
          emmetConfig.of({
            syntax: EmmetKnownSyntax.jsx,
          }),
          formatService.createFormatExtension(LanguageType.JavaScript),
          ...linter,
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
        return [json(), formatService.createFormatExtension(LanguageType.JSON)];
      }
      case LanguageType.Markdown: {
        const { markdown } = await import('@codemirror/lang-markdown');
        return [
          markdown(),
          formatService.createFormatExtension(LanguageType.Markdown),
        ];
      }
      default:
        return [];
    }
  }
  private static async getBaseExtensions(
    yText: YText,
    awareness: Awareness,
  ): Promise<Extension[]> {
    const usercolors = [
      { color: '#30bced', light: '#30bced33' },
      { color: '#6eeb83', light: '#6eeb8333' },
      { color: '#ffbc42', light: '#ffbc4233' },
      { color: '#ecd444', light: '#ecd44433' },
      { color: '#ee6352', light: '#ee635233' },
      { color: '#9ac2c9', light: '#9ac2c933' },
      { color: '#8acb88', light: '#8acb8833' },
      { color: '#1be7ff', light: '#1be7ff33' },
    ];

    // select a random color for this user
    const userColor = usercolors[random.uint32() % usercolors.length];
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
    awareness.setLocalStateField('user', {
      name: 'Anonymous ' + Math.floor(Math.random() * 100),
      color: userColor.color,
      colorLight: userColor.light,
    });
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
