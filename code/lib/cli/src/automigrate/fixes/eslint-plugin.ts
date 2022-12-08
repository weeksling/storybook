import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import type { ConfigFile } from '@storybook/csf-tools';
import { readConfig, writeConfig } from '@storybook/csf-tools';
import { getStorybookInfo } from '@storybook/core-common';
import { readFile, readJson, writeJson } from 'fs-extra';
import detectIndent from 'detect-indent';

import { findEslintFile, SUPPORTED_ESLINT_EXTENSIONS } from '../helpers/getEslintInfo';

import type { Fix } from '../types';

const logger = console;

interface EslintPluginRunOptions {
  main: ConfigFile;
  eslintFile: string;
  unsupportedExtension?: string;
}

/**
 * Does the user not have eslint-plugin-storybook installed?
 *
 * If so:
 * - Install it, and if possible configure it
 */
export const eslintPlugin: Fix<EslintPluginRunOptions> = {
  id: 'eslintPlugin',

  async check({ packageManager }) {
    const packageJson = packageManager.retrievePackageJson();
    const { dependencies, devDependencies } = packageJson;

    const eslintPluginStorybook =
      dependencies['eslint-plugin-storybook'] || devDependencies['eslint-plugin-storybook'];
    const eslintDependency = dependencies.eslint || devDependencies.eslint;

    if (eslintPluginStorybook || !eslintDependency) {
      return null;
    }

    const { mainConfig } = getStorybookInfo(packageJson);

    if (!mainConfig) {
      logger.warn('Unable to find storybook main.js config, skipping');
      return null;
    }

    let eslintFile;
    let unsupportedExtension;
    try {
      eslintFile = findEslintFile();
    } catch (err) {
      unsupportedExtension = err.message;
    }

    if (!eslintFile && !unsupportedExtension) {
      logger.warn('Unable to find .eslintrc config file, skipping');
      return null;
    }

    // If in the future the eslint plugin has a framework option, using main to extract the framework field will be very useful
    const main = await readConfig(mainConfig);

    return { eslintFile, main, unsupportedExtension };
  },

  prompt() {
    return dedent`
      We've detected you are not using our eslint-plugin.

      In order to have the best experience with Storybook and follow best practices, we advise you to install eslint-plugin-storybook.

      More info: ${chalk.yellow('https://github.com/storybookjs/eslint-plugin-storybook#readme')}
    `;
  },

  async run({ result: { eslintFile, unsupportedExtension }, packageManager, dryRun }) {
    const deps = [`eslint-plugin-storybook`];

    logger.info(`✅ Adding dependencies: ${deps}`);
    if (!dryRun) packageManager.addDependencies({ installAsDevDependencies: true }, deps);

    if (!dryRun && unsupportedExtension) {
      logger.info(dedent`
          ⚠️ The plugin was successfully installed but failed to configure.
          
          Found an eslint config file with an unsupported automigration format: .eslintrc.${unsupportedExtension}.
          The supported formats for this automigration are: ${SUPPORTED_ESLINT_EXTENSIONS.join(
            ', '
          )}.

          Please refer to https://github.com/storybookjs/eslint-plugin-storybook#usage to finish setting up the plugin manually.
      `);
      return;
    }

    logger.info(`✅ Adding Storybook plugin to ${eslintFile}`);
    if (!dryRun) {
      if (eslintFile.endsWith('json')) {
        const eslintConfig = (await readJson(eslintFile)) as { extends?: string[] };
        const existingConfigValue = Array.isArray(eslintConfig.extends)
          ? eslintConfig.extends
          : [eslintConfig.extends];
        eslintConfig.extends = [...(existingConfigValue || []), 'plugin:storybook/recommended'];

        const eslintFileContents = await readFile(eslintFile, 'utf8');
        const spaces = detectIndent(eslintFileContents).amount || 2;
        await writeJson(eslintFile, eslintConfig, { spaces });
      } else {
        const eslint = await readConfig(eslintFile);
        const extendsConfig = eslint.getFieldValue(['extends']) || [];
        const existingConfigValue = Array.isArray(extendsConfig) ? extendsConfig : [extendsConfig];
        eslint.setFieldValue(['extends'], [...existingConfigValue, 'plugin:storybook/recommended']);

        await writeConfig(eslint);
      }
    }
  },
};
