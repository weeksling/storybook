import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import type { Fix } from '../types';

interface AddReactOptions {
  dependents: string[];
  additionalDependencies: string[];
}

/**
 * is the user missing a dependency on react?
 */
export const addReact: Fix<AddReactOptions> = {
  id: 'addReact',

  async check({ packageManager }) {
    const packageJson = packageManager.retrievePackageJson();
    const installedDependencies = new Set(
      Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies })
    );

    const dependents = ['@storybook/addon-essentials', '@storybook/addon-docs'].filter((pkg) =>
      installedDependencies.has(pkg)
    );
    const additionalDependencies = [];
    if (dependents.length > 0) {
      if (!installedDependencies.has('react')) {
        // we add these here because they are required by addon-essentials > addon-docs
        additionalDependencies.push('react');
      }
      if (!installedDependencies.has('react-dom')) {
        // we add these here because they are required by addon-essentials > addon-docs
        additionalDependencies.push('react-dom');
      }
    }

    if (additionalDependencies.length > 0) {
      return { dependents, additionalDependencies };
    }
    return null;
  },

  prompt({ dependents, additionalDependencies }) {
    const dependentsFormatted = dependents.map((pkg) => chalk.cyan(pkg)).join(' & ');
    const additionalDependenciesFormatted = additionalDependencies
      .map((pkg) => `- ${chalk.cyan(pkg)}`)
      .join('\n');

    return dedent`
      We've detected that you're using ${dependentsFormatted}.
      
      Starting in Storybook 7 we now require the following peer dependencies:

      ${additionalDependenciesFormatted}

      We can add these for you automatically.
      
      More info: ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#react-peer-dependencies-required'
      )}
    `;
  },

  async run({ packageManager, result: { additionalDependencies }, dryRun }) {
    if (!dryRun) {
      packageManager.addDependencies({ installAsDevDependencies: true }, additionalDependencies);
    }
  },
};
