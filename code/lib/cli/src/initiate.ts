import type { Package } from 'update-notifier';
import chalk from 'chalk';
import prompts from 'prompts';
import { telemetry } from '@storybook/telemetry';
import { withTelemetry } from '@storybook/core-server';

import { installableProjectTypes, ProjectType } from './project_types';
import { detect, isStorybookInstalled, detectLanguage, detectBuilder } from './detect';
import { commandLog, codeLog, paddedLog } from './helpers';
import angularGenerator from './generators/ANGULAR';
import aureliaGenerator from './generators/AURELIA';
import emberGenerator from './generators/EMBER';
import reactGenerator from './generators/REACT';
import reactNativeGenerator from './generators/REACT_NATIVE';
import reactScriptsGenerator from './generators/REACT_SCRIPTS';
import nextjsGenerator from './generators/NEXTJS';
import sfcVueGenerator from './generators/SFC_VUE';
import vueGenerator from './generators/VUE';
import vue3Generator from './generators/VUE3';
import webpackReactGenerator from './generators/WEBPACK_REACT';
import mithrilGenerator from './generators/MITHRIL';
import marionetteGenerator from './generators/MARIONETTE';
import markoGenerator from './generators/MARKO';
import htmlGenerator from './generators/HTML';
import webComponentsGenerator from './generators/WEB-COMPONENTS';
import riotGenerator from './generators/RIOT';
import preactGenerator from './generators/PREACT';
import svelteGenerator from './generators/SVELTE';
import svelteKitGenerator from './generators/SVELTEKIT';
import raxGenerator from './generators/RAX';
import serverGenerator from './generators/SERVER';
import type { JsPackageManager } from './js-package-manager';
import { JsPackageManagerFactory, useNpmWarning } from './js-package-manager';
import type { NpmOptions } from './NpmOptions';
import { automigrate } from './automigrate';
import type { CommandOptions } from './generators/types';

const logger = console;

const installStorybook = (
  projectType: ProjectType,
  packageManager: JsPackageManager,
  options: CommandOptions
): Promise<void> => {
  const npmOptions: NpmOptions = {
    installAsDevDependencies: true,
    skipInstall: options.skipInstall,
  };

  let packageJson;
  try {
    packageJson = packageManager.readPackageJson();
  } catch (err) {
    //
  }

  const language = detectLanguage(packageJson);

  const generatorOptions = {
    language,
    builder: options.builder || detectBuilder(packageManager),
    linkable: !!options.linkable,
    commonJs: options.commonJs,
    pnp: options.usePnp,
  };

  const runGenerator: () => Promise<void> = async () => {
    switch (projectType) {
      case ProjectType.ALREADY_HAS_STORYBOOK:
        logger.log();
        paddedLog('There seems to be a Storybook already available in this project.');
        paddedLog('Apply following command to force:\n');
        codeLog(['sb init [options] -f']);

        // Add a new line for the clear visibility.
        logger.log();
        return Promise.resolve();

      case ProjectType.REACT_SCRIPTS:
        return reactScriptsGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Create React App" based project')
        );

      case ProjectType.REACT:
        return reactGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "React" app\n')
        );

      case ProjectType.REACT_NATIVE: {
        return (
          options.yes
            ? Promise.resolve({ server: true })
            : (prompts([
                {
                  type: 'confirm',
                  name: 'server',
                  message:
                    'Do you want to install dependencies necessary to run Storybook server? You can manually do it later by install @storybook/react-native-server',
                  initial: false,
                },
              ]) as Promise<{ server: boolean }>)
        )
          .then(({ server }) => reactNativeGenerator(packageManager, npmOptions, server))
          .then(commandLog('Adding Storybook support to your "React Native" app\n'));
      }

      case ProjectType.WEBPACK_REACT:
        return webpackReactGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Webpack React" app\n')
        );

      case ProjectType.REACT_PROJECT:
        return reactGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "React" library\n')
        );

      case ProjectType.NEXTJS:
        return nextjsGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Next" app\n')
        );

      case ProjectType.SFC_VUE:
        return sfcVueGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Single File Components Vue" app\n')
        );

      case ProjectType.VUE:
        return vueGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Vue" app\n')
        );

      case ProjectType.VUE3:
        return vue3Generator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Vue 3" app\n')
        );

      case ProjectType.ANGULAR:
        return angularGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Angular" app\n')
        );

      case ProjectType.EMBER:
        return emberGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Ember" app\n')
        );

      case ProjectType.MITHRIL:
        return mithrilGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Mithril" app\n')
        );

      case ProjectType.MARIONETTE:
        return marionetteGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Marionette.js" app\n')
        );

      case ProjectType.MARKO:
        return markoGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Marko" app\n')
        );

      case ProjectType.HTML:
        return htmlGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "HTML" app\n')
        );

      case ProjectType.WEB_COMPONENTS:
        return webComponentsGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "web components" app\n')
        );

      case ProjectType.RIOT:
        return riotGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "riot.js" app\n')
        );

      case ProjectType.PREACT:
        return preactGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Preact" app\n')
        );

      case ProjectType.SVELTE:
        return svelteGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Svelte" app\n')
        );

      case ProjectType.SVELTEKIT:
        return svelteKitGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "SvelteKit" app\n')
        );

      case ProjectType.RAX:
        return raxGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Rax" app\n')
        );

      case ProjectType.AURELIA:
        return aureliaGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Aurelia" app\n')
        );

      case ProjectType.SERVER:
        return serverGenerator(packageManager, npmOptions, generatorOptions).then(
          commandLog('Adding Storybook support to your "Server" app\n')
        );

      case ProjectType.UNSUPPORTED:
        paddedLog(`We detected a project type that we don't support yet.`);
        paddedLog(
          `If you'd like your framework to be supported, please let use know about it at https://github.com/storybookjs/storybook/issues`
        );

        // Add a new line for the clear visibility.
        logger.log();

        return Promise.resolve();

      default:
        paddedLog(`We couldn't detect your project type. (code: ${projectType})`);
        paddedLog(
          'You can specify a project type explicitly via `sb init --type <type>`, see our docs on how to configure Storybook for your framework: https://storybook.js.org/docs/react/get-started/install'
        );

        // Add a new line for the clear visibility.
        logger.log();

        return projectTypeInquirer(options, packageManager);
    }
  };

  return runGenerator().catch((ex) => {
    logger.error(`\n     ${chalk.red(ex.stack)}`);
    process.exit(1);
  });
};

const projectTypeInquirer = async (
  options: CommandOptions & { yes?: boolean },
  packageManager: JsPackageManager
) => {
  const manualAnswer = options.yes
    ? true
    : await prompts([
        {
          type: 'confirm',
          name: 'manual',
          message: 'Do you want to manually choose a Storybook project type to install?',
        },
      ]);

  if (manualAnswer !== true && manualAnswer.manual) {
    const frameworkAnswer = await prompts([
      {
        type: 'select',
        name: 'manualFramework',
        message: 'Please choose a project type from the following list:',
        choices: installableProjectTypes.map((type) => ({
          title: type,
          value: type.toUpperCase(),
        })),
      },
    ]);
    return installStorybook(frameworkAnswer.manualFramework, packageManager, options);
  }
  return Promise.resolve();
};

async function doInitiate(options: CommandOptions, pkg: Package): Promise<void> {
  const { useNpm, packageManager: pkgMgr } = options;
  if (useNpm) {
    useNpmWarning();
  }
  const packageManager = JsPackageManagerFactory.getPackageManager({ useNpm, force: pkgMgr });
  const welcomeMessage = 'storybook init - the simplest way to add a Storybook to your project.';
  logger.log(chalk.inverse(`\n ${welcomeMessage} \n`));

  // Update notify code.
  const { default: updateNotifier } = await import('update-notifier');
  updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60, // every hour (we could increase this later on.)
  }).notify();

  let projectType;
  const projectTypeProvided = options.type;
  const infoText = projectTypeProvided
    ? `Installing Storybook for user specified project type: ${projectTypeProvided}`
    : 'Detecting project type';
  const done = commandLog(infoText);

  const packageJson = packageManager.retrievePackageJson();
  const isEsm = packageJson && packageJson.type === 'module';

  try {
    if (projectTypeProvided) {
      if (installableProjectTypes.includes(projectTypeProvided)) {
        const storybookInstalled = isStorybookInstalled(packageJson, options.force);
        projectType = storybookInstalled
          ? ProjectType.ALREADY_HAS_STORYBOOK
          : projectTypeProvided.toUpperCase();
      } else {
        done(`The provided project type was not recognized by Storybook: ${projectTypeProvided}`);
        logger.log(`\nThe project types currently supported by Storybook are:\n`);
        installableProjectTypes.sort().forEach((framework) => paddedLog(`- ${framework}`));
        logger.log();
        process.exit(1);
      }
    } else {
      projectType = detect(packageJson, options);
    }
  } catch (ex) {
    done(ex.message);
    process.exit(1);
  }
  done();

  await installStorybook(projectType as ProjectType, packageManager, {
    ...options,
    ...(isEsm ? { commonJs: true } : undefined),
  });

  if (!options.skipInstall) {
    packageManager.installDependencies();
  }

  if (!options.disableTelemetry) {
    telemetry('init', { projectType });
  }

  await automigrate({ yes: options.yes || process.env.CI === 'true', useNpm, force: pkgMgr });

  logger.log('\nTo run your Storybook, type:\n');
  codeLog([packageManager.getRunStorybookCommand()]);
  logger.log('\nFor more information visit:', chalk.cyan('https://storybook.js.org'));

  if (projectType === ProjectType.REACT_NATIVE) {
    const REACT_NATIVE_REPO = 'https://github.com/storybookjs/react-native';

    logger.log();
    logger.log(chalk.red('NOTE: installation is not 100% automated.'));
    logger.log(`To quickly run Storybook, replace contents of your app entry with:\n`);
    codeLog(["export {default} from './storybook';"]);
    logger.log('\n For more in information, see the github readme:\n');
    logger.log(chalk.cyan(REACT_NATIVE_REPO));
    logger.log();
  }

  // Add a new line for the clear visibility.
  logger.log();
}

export async function initiate(options: CommandOptions, pkg: Package): Promise<void> {
  await withTelemetry('init', { cliOptions: options }, () => doInitiate(options, pkg));
}
