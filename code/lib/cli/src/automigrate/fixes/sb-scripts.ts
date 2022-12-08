import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import semver from 'semver';
import { getStorybookInfo } from '@storybook/core-common';
import type { Fix } from '../types';
import { getStorybookVersionSpecifier } from '../../helpers';
import type { PackageJsonWithDepsAndDevDeps } from '../../js-package-manager';

interface SbScriptsRunOptions {
  storybookScripts: Record<string, { before: string; after: string }>;
  storybookVersion: string;
  packageJson: PackageJsonWithDepsAndDevDeps;
}

const logger = console;

/**
 * Slightly big function because JS regex doesn't have proper full-word boundary.
 * This goes through all the words in each script, and only return the scripts
 * that do contain the actual sb binary, and not something like "npm run start-storybook"
 * which could actually be a custom script even though the name matches the legacy binary name
 */
export const getStorybookScripts = (allScripts: Record<string, string>) => {
  return Object.keys(allScripts).reduce((acc, key) => {
    let isStorybookScript = false;
    const allWordsFromScript = allScripts[key].split(' ');
    const newScript = allWordsFromScript
      .map((currentWord, index) => {
        const previousWord = allWordsFromScript[index - 1];

        // full word check, rather than regex which could be faulty
        const isSbBinary = currentWord === 'build-storybook' || currentWord === 'start-storybook';

        // in case people have scripts like `yarn start-storybook`
        const isPrependedByPkgManager =
          previousWord && ['npx', 'run', 'yarn', 'pnpx'].some((cmd) => previousWord.includes(cmd));

        if (isSbBinary && !isPrependedByPkgManager) {
          isStorybookScript = true;
          return currentWord
            .replace('start-storybook', 'storybook dev')
            .replace('build-storybook', 'storybook build');
        }

        return currentWord;
      })
      .join(' ');

    if (isStorybookScript) {
      acc[key] = {
        before: allScripts[key],
        after: newScript,
      };
    }

    return acc;
  }, {} as Record<string, { before: string; after: string }>);
};

/**
 * Is the user using start-storybook
 *
 * If so:
 * - Add storybook dependency
 * - Change start-storybook and build-storybook scripts
 */
export const sbScripts: Fix<SbScriptsRunOptions> = {
  id: 'sb-scripts',

  async check({ packageManager }) {
    const packageJson = packageManager.retrievePackageJson();
    const { scripts = {}, devDependencies, dependencies } = packageJson;
    const { version: storybookVersion } = getStorybookInfo(packageJson);

    const allDeps = { ...dependencies, ...devDependencies };

    const storybookCoerced = storybookVersion && semver.coerce(storybookVersion)?.version;
    if (!storybookCoerced) {
      logger.warn(dedent`
        ❌ Unable to determine storybook version, skipping ${chalk.cyan('sb-scripts')} fix.
        🤔 Are you running automigrate from your project directory?
      `);
      return null;
    }

    if (allDeps.sb || allDeps.storybook) {
      return null;
    }

    const storybookScripts = getStorybookScripts(scripts);

    if (Object.keys(storybookScripts).length === 0) {
      return null;
    }

    return semver.gte(storybookCoerced, '7.0.0')
      ? { packageJson, storybookScripts, storybookVersion }
      : null;
  },

  prompt({ storybookVersion, storybookScripts }) {
    const sbFormatted = chalk.cyan(`Storybook ${storybookVersion}`);

    const newScriptsMessage = Object.keys(storybookScripts).reduce((acc, scriptKey) => {
      acc.push(
        [
          chalk.bold(scriptKey),
          'from:',
          chalk.cyan(storybookScripts[scriptKey].before),
          'to:',
          chalk.cyan(storybookScripts[scriptKey].after),
        ].join('\n')
      );
      return acc;
    }, []);

    return dedent`
      We've detected you are using ${sbFormatted} with scripts from previous versions of Storybook.
      Starting in Storybook 7, the ${chalk.yellow('start-storybook')} and ${chalk.yellow(
      'build-storybook'
    )} binaries have changed to ${chalk.magenta('storybook dev')} and ${chalk.magenta(
      'storybook build'
    )} respectively.
      In order to work with ${sbFormatted}, Storybook's ${chalk.magenta(
      'storybook'
    )} binary has to be installed and your storybook scripts have to be adjusted to use the binary. We can install the storybook binary and adjust your scripts for you:

      ${newScriptsMessage.join('\n\n')}

      In case this migration did not cover all of your scripts, or you'd like more info: ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#start-storybook--build-storybook-binaries-removed'
      )}
      `;
  },

  async run({ result: { storybookScripts, packageJson }, packageManager, dryRun }) {
    logger.log();
    logger.info(`Adding 'storybook' as dev dependency`);
    logger.log();

    if (!dryRun) {
      const versionToInstall = getStorybookVersionSpecifier(packageJson);
      packageManager.addDependencies({ installAsDevDependencies: true }, [
        `storybook@${versionToInstall}`,
      ]);
    }

    logger.info(`Updating scripts in package.json`);
    logger.log();
    if (!dryRun) {
      const newScripts = Object.keys(storybookScripts).reduce((acc, scriptKey) => {
        acc[scriptKey] = storybookScripts[scriptKey].after;
        return acc;
      }, {} as Record<string, string>);

      logger.log();

      packageManager.addScripts(newScripts);
    }
  },
};
