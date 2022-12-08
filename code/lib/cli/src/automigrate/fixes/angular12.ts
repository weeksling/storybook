import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import semver from 'semver';
import type { ConfigFile } from '@storybook/csf-tools';
import type { Fix } from '../types';
import { webpack5 } from './webpack5';

interface Angular12RunOptions {
  angularVersion: string;
  // FIXME angularPresetVersion: string;
  storybookVersion: string;
  main: ConfigFile;
}

/**
 * Is the user upgrading to Angular12?
 *
 * If so:
 * - Run webpack5 fix
 */
export const angular12: Fix<Angular12RunOptions> = {
  id: 'angular12',

  async check({ packageManager }) {
    const packageJson = packageManager.retrievePackageJson();
    const { dependencies, devDependencies } = packageJson;
    const angularVersion = dependencies['@angular/core'] || devDependencies['@angular/core'];
    const angularCoerced = semver.coerce(angularVersion)?.version;

    if (!angularCoerced || semver.lt(angularCoerced, '12.0.0')) {
      return null;
    }

    const builderInfo = await webpack5.checkWebpack5Builder(packageJson);
    return builderInfo ? { angularVersion, ...builderInfo } : null;
  },

  prompt({ angularVersion }) {
    const angularFormatted = chalk.cyan(`Angular ${angularVersion}`);

    return dedent`
      We've detected you are running ${angularFormatted} which is powered by webpack5.
      Your Storybook's main.js files specifies webpack4, which is incompatible.

      In order to work with your version of Angular, we need to install Storybook's ${chalk.cyan(
        '@storybook/builder-webpack5'
      )}.

      More info: ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#angular12-upgrade'
      )}
    `;
  },

  async run(options) {
    return webpack5.run({
      ...options,
      result: { webpackVersion: null, ...options.result },
    });
  },
};
