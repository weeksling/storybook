import { logger } from '@storybook/node-logger';
import dedent from 'ts-dedent';

export function ensureReactPeerDeps() {
  try {
    require.resolve('react');
    require.resolve('react-dom');
  } catch (e) {
    logger.error(dedent`
      Starting in 7.0, react and react-dom are now required peer dependencies of Storybook.
      Please install react and react-dom in your project.

      npm:
      $ npm add react react-dom --dev

      yarn:
      $ yarn add react react-dom --dev

      pnpm:
      $ pnpm add react react-dom --dev
    `);
    process.exit(1);
  }
}
