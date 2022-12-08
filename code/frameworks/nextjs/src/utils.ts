import path from 'path';
import { DefinePlugin } from 'webpack';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
import findUp from 'find-up';
import { pathExists } from 'fs-extra';
import dedent from 'ts-dedent';
import type { Configuration as WebpackConfig } from 'webpack';
import type { NextConfig } from 'next';
import { pathToFileURL } from 'node:url';

export const configureRuntimeNextjsVersionResolution = (baseConfig: WebpackConfig): void => {
  baseConfig.plugins?.push(
    new DefinePlugin({
      'process.env.__NEXT_VERSION': JSON.stringify(getNextjsVersion()),
    })
  );
};

export const getNextjsVersion = (): string => require(scopedResolve('next/package.json')).version;

const findNextConfigFile = async (configDir: string) => {
  const supportedExtensions = ['mjs', 'js'];
  return supportedExtensions.reduce<Promise<undefined | string>>(
    async (acc, ext: string | undefined) => {
      const resolved = await acc;
      if (!resolved) {
        acc = findUp(`next.config.${ext}`, { cwd: configDir });
      }

      return acc;
    },
    Promise.resolve(undefined)
  );
};

export const resolveNextConfig = async ({
  baseConfig = {},
  nextConfigPath,
  configDir,
}: {
  baseConfig?: WebpackConfig;
  nextConfigPath?: string;
  configDir: string;
}): Promise<NextConfig> => {
  const nextConfigFile = nextConfigPath || (await findNextConfigFile(configDir));

  if (!nextConfigFile || (await pathExists(nextConfigFile)) === false) {
    throw new Error(
      dedent`
        Could not find or resolve your Next config file. Please provide the next config file path as a framework option.

        More info: https://github.com/storybookjs/storybook/blob/next/code/frameworks/nextjs/README.md#options
      `
    );
  }

  const nextConfigExport = await import(pathToFileURL(nextConfigFile).href);

  const nextConfig =
    typeof nextConfigExport === 'function'
      ? nextConfigExport(PHASE_DEVELOPMENT_SERVER, {
          defaultConfig: baseConfig,
        })
      : nextConfigExport;

  return nextConfig.default || nextConfig;
};

// This is to help the addon in development
// Without it, webpack resolves packages in its node_modules instead of the example's node_modules
export const addScopedAlias = (baseConfig: WebpackConfig, name: string, alias?: string): void => {
  baseConfig.resolve ??= {};
  baseConfig.resolve.alias ??= {};
  const aliasConfig = baseConfig.resolve.alias;

  const scopedAlias = scopedResolve(`${alias ?? name}`);

  if (Array.isArray(aliasConfig)) {
    aliasConfig.push({
      name,
      alias: scopedAlias,
    });
  } else {
    aliasConfig[name] = scopedAlias;
  }
};

/**
 *
 * @param id the module id
 * @returns a path to the module id scoped to the project folder without the main script path at the end
 * @summary
 * This is to help the addon in development.
 * Without it, the addon resolves packages in its node_modules instead of the example's node_modules.
 * Because require.resolve will also include the main script as part of the path, this function strips
 * that to just include the path to the module folder
 * @example
 * // before main script path truncation
 * require.resolve('styled-jsx') === '/some/path/node_modules/styled-jsx/index.js
 * // after main script path truncation
 * scopedResolve('styled-jsx') === '/some/path/node_modules/styled-jsx'
 */
export const scopedResolve = (id: string): string => {
  const scopedModulePath = require.resolve(id, { paths: [path.resolve()] });
  const moduleFolderStrPosition = scopedModulePath.lastIndexOf(
    id.replace(/\//g /* all '/' occurances */, path.sep)
  );
  const beginningOfMainScriptPath = moduleFolderStrPosition + id.length;
  return scopedModulePath.substring(0, beginningOfMainScriptPath);
};
