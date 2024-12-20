import { esLint } from '@codemirror/lang-javascript';
import { linter } from '@codemirror/lint';
import js from '@eslint/js';
import globals from 'globals';
// import ts from 'typescript-eslint';

import * as eslint from 'eslint-linter-browserify';

export const createLinter = ({ jsx = false }: {
  jsx?: boolean;
}) => {
  return linter(
    esLint(new eslint.Linter(), [
      js.configs.recommended,
      // ...ts.configs.,
      {
        languageOptions: {
          globals: {
            ...globals.browser,
          },
          parserOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            ecmaFeatures: {
              jsx,
            },
          },
        },
      },
    ]),
  );
};
