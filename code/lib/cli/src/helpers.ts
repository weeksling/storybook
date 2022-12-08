/* eslint-disable no-param-reassign */
import path, { join } from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import chalk from 'chalk';
import { satisfies } from 'semver';
import stripJsonComments from 'strip-json-comments';

import { getCliDir, getRendererDir } from './dirs';
import type {
  JsPackageManager,
  PackageJson,
  PackageJsonWithDepsAndDevDeps,
} from './js-package-manager';
import type { SupportedFrameworks, SupportedRenderers } from './project_types';
import { SupportedLanguage } from './project_types';
import storybookMonorepoPackages from './versions';

const logger = console;

export function getBowerJson() {
  const bowerJsonPath = path.resolve('bower.json');
  if (!fs.existsSync(bowerJsonPath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(bowerJsonPath, 'utf8');
  return JSON.parse(jsonContent);
}

export function readFileAsJson(jsonPath: string, allowComments?: boolean) {
  const filePath = path.resolve(jsonPath);
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonContent = allowComments ? stripJsonComments(fileContent) : fileContent;

  try {
    return JSON.parse(jsonContent);
  } catch (e) {
    logger.error(chalk.red(`Invalid json in file: ${filePath}`));
    throw e;
  }
}

export const writeFileAsJson = (jsonPath: string, content: unknown) => {
  const filePath = path.resolve(jsonPath);
  if (!fs.existsSync(filePath)) {
    return false;
  }

  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`);
  return true;
};

export const commandLog = (message: string) => {
  process.stdout.write(chalk.cyan(' • ') + message);

  // Need `void` to be able to use this function in a then of a Promise<void>
  return (errorMessage?: string | void, errorInfo?: string) => {
    if (errorMessage) {
      process.stdout.write(`. ${chalk.red('✖')}\n`);
      logger.error(`\n     ${chalk.red(errorMessage)}`);

      if (!errorInfo) {
        return;
      }

      const newErrorInfo = errorInfo
        .split('\n')
        .map((line) => `     ${chalk.dim(line)}`)
        .join('\n');
      logger.error(`${newErrorInfo}\n`);
      return;
    }

    process.stdout.write(`. ${chalk.green('✓')}\n`);
  };
};

export function paddedLog(message: string) {
  const newMessage = message
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n');

  logger.log(newMessage);
}

export function getChars(char: string, amount: number) {
  let line = '';
  for (let lc = 0; lc < amount; lc += 1) {
    line += char;
  }

  return line;
}

export function codeLog(codeLines: string[], leftPadAmount?: number) {
  let maxLength = 0;
  const newLines = codeLines.map((line) => {
    maxLength = line.length > maxLength ? line.length : maxLength;
    return line;
  });

  const finalResult = newLines
    .map((line) => {
      const rightPadAmount = maxLength - line.length;
      let newLine = line + getChars(' ', rightPadAmount);
      newLine = getChars(' ', leftPadAmount || 2) + chalk.inverse(` ${newLine} `);
      return newLine;
    })
    .join('\n');

  logger.log(finalResult);
}

/**
 * Detect if any babel dependencies need to be added to the project
 * @param {Object} packageJson The current package.json so we can inspect its contents
 * @returns {Array} Contains the packages and versions that need to be installed
 * @example
 * const babelDependencies = await getBabelDependencies(packageManager, npmOptions, packageJson);
 * // you can then spread the result when using installDependencies
 * installDependencies(npmOptions, [
 *   `@storybook/react@${storybookVersion}`,
 *   ...babelDependencies,
 * ]);
 */
export async function getBabelDependencies(
  packageManager: JsPackageManager,
  packageJson: PackageJsonWithDepsAndDevDeps
) {
  const dependenciesToAdd = [];
  let babelLoaderVersion = '^8.0.0-0';

  const babelCoreVersion =
    packageJson.dependencies['babel-core'] || packageJson.devDependencies['babel-core'];

  if (!babelCoreVersion) {
    if (!packageJson.dependencies['@babel/core'] && !packageJson.devDependencies['@babel/core']) {
      const babelCoreInstallVersion = await packageManager.getVersion('@babel/core');
      dependenciesToAdd.push(`@babel/core@${babelCoreInstallVersion}`);
    }
  } else {
    const latestCompatibleBabelVersion = await packageManager.latestVersion(
      'babel-core',
      babelCoreVersion
    );
    // Babel 6
    if (satisfies(latestCompatibleBabelVersion, '^6.0.0')) {
      babelLoaderVersion = '^7.0.0';
    }
  }

  if (!packageJson.dependencies['babel-loader'] && !packageJson.devDependencies['babel-loader']) {
    const babelLoaderInstallVersion = await packageManager.getVersion(
      'babel-loader',
      babelLoaderVersion
    );
    dependenciesToAdd.push(`babel-loader@${babelLoaderInstallVersion}`);
  }

  return dependenciesToAdd;
}

export function addToDevDependenciesIfNotPresent(
  packageJson: PackageJson,
  name: string,
  packageVersion: string
) {
  if (!packageJson.dependencies[name] && !packageJson.devDependencies[name]) {
    packageJson.devDependencies[name] = packageVersion;
  }
}

export function copyTemplate(templateRoot: string) {
  const templateDir = path.resolve(templateRoot, `template-csf/`);

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Couldn't find template dir`);
  }

  fse.copySync(templateDir, '.', { overwrite: true });
}

export async function copyComponents(
  renderer: SupportedFrameworks | SupportedRenderers,
  language: SupportedLanguage
) {
  const languageFolderMapping: Record<SupportedLanguage, string> = {
    [SupportedLanguage.JAVASCRIPT]: 'js',
    [SupportedLanguage.TYPESCRIPT]: 'ts',
    [SupportedLanguage.TYPESCRIPT_LEGACY]: 'ts-legacy',
  };
  const componentsPath = async () => {
    const baseDir = getRendererDir(renderer);
    const assetsDir = join(baseDir, 'template/cli');

    const assetsLanguage = join(assetsDir, languageFolderMapping[language]);
    const assetsJS = join(assetsDir, languageFolderMapping[SupportedLanguage.JAVASCRIPT]);
    const assetsTSLegacy = join(
      assetsDir,
      languageFolderMapping[SupportedLanguage.TYPESCRIPT_LEGACY]
    );
    const assetsTS = join(assetsDir, languageFolderMapping[SupportedLanguage.TYPESCRIPT]);

    if (await fse.pathExists(assetsLanguage)) {
      return assetsLanguage;
    }
    if (language === SupportedLanguage.TYPESCRIPT && (await fse.pathExists(assetsTSLegacy))) {
      return assetsTSLegacy;
    }
    if (language === SupportedLanguage.TYPESCRIPT_LEGACY && (await fse.pathExists(assetsTS))) {
      return assetsTS;
    }
    if (await fse.pathExists(assetsJS)) {
      return assetsJS;
    }
    if (await fse.pathExists(assetsDir)) {
      return assetsDir;
    }
    throw new Error(`Unsupported renderer: ${renderer}`);
  };

  const targetPath = async () => {
    if (await fse.pathExists('./src')) {
      return './src/stories';
    }
    return './stories';
  };

  const destinationPath = await targetPath();
  await fse.copy(join(getCliDir(), 'rendererAssets/common'), destinationPath, {
    overwrite: true,
  });
  await fse.copy(await componentsPath(), destinationPath, { overwrite: true });
}

// Given a package.json, finds any official storybook package within it
// and if it exists, returns the version of that package from the specified package.json
export function getStorybookVersionSpecifier(packageJson: PackageJsonWithDepsAndDevDeps) {
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const storybookPackage = Object.keys(allDeps).find(
    (name: keyof typeof storybookMonorepoPackages) => {
      return storybookMonorepoPackages[name];
    }
  );

  if (!storybookPackage) {
    throw new Error(`Couldn't find any official storybook packages in package.json`);
  }

  return allDeps[storybookPackage];
}
