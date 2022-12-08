import { logger } from '@storybook/node-logger';
import type { Options, StorybookConfig } from '@storybook/types';
import { getDirectoryFromWorkingDir } from '@storybook/core-common';
import chalk from 'chalk';
import express from 'express';
import { pathExists } from 'fs-extra';
import path from 'path';
import favicon from 'serve-favicon';

import { dedent } from 'ts-dedent';

const defaultFavIcon = require.resolve('@storybook/core-server/public/favicon.svg');

export async function useStatics(router: any, options: Options) {
  let hasCustomFavicon = false;
  const staticDirs = await options.presets.apply<StorybookConfig['staticDirs']>('staticDirs');

  if (staticDirs && options.staticDir) {
    throw new Error(dedent`
      Conflict when trying to read staticDirs:
      * Storybook's configuration option: 'staticDirs'
      * Storybook's CLI flag: '--staticDir' or '-s'
      
      Choose one of them, but not both.
    `);
  }

  const statics = staticDirs
    ? staticDirs.map((dir) => (typeof dir === 'string' ? dir : `${dir.from}:${dir.to}`))
    : options.staticDir;

  if (statics && statics.length > 0) {
    await Promise.all(
      statics.map(async (dir) => {
        try {
          const relativeDir = staticDirs
            ? getDirectoryFromWorkingDir({
                configDir: options.configDir,
                workingDir: process.cwd(),
                directory: dir,
              })
            : dir;
          const { staticDir, staticPath, targetEndpoint } = await parseStaticDir(relativeDir);
          logger.info(
            chalk`=> Serving static files from {cyan ${staticDir}} at {cyan ${targetEndpoint}}`
          );
          router.use(targetEndpoint, express.static(staticPath, { index: false }));

          if (!hasCustomFavicon && targetEndpoint === '/') {
            const faviconPath = path.join(staticPath, 'favicon.svg');
            if (await pathExists(faviconPath)) {
              hasCustomFavicon = true;
              router.use(favicon(faviconPath));
            }
          }
        } catch (e) {
          logger.warn(e.message);
        }
      })
    );
  }

  if (!hasCustomFavicon) {
    router.use(favicon(defaultFavIcon));
  }
}

export const parseStaticDir = async (arg: string) => {
  // Split on last index of ':', for Windows compatibility (e.g. 'C:\some\dir:\foo')
  const lastColonIndex = arg.lastIndexOf(':');
  const isWindowsAbsolute = path.win32.isAbsolute(arg);
  const isWindowsRawDirOnly = isWindowsAbsolute && lastColonIndex === 1; // e.g. 'C:\some\dir'
  const splitIndex = lastColonIndex !== -1 && !isWindowsRawDirOnly ? lastColonIndex : arg.length;

  const targetRaw = arg.substring(splitIndex + 1) || '/';
  const target = targetRaw.split(path.sep).join(path.posix.sep); // Ensure target has forward-slash path

  const rawDir = arg.substring(0, splitIndex);
  const staticDir = path.isAbsolute(rawDir) ? rawDir : `./${rawDir}`;
  const staticPath = path.resolve(staticDir);
  const targetDir = target.replace(/^\/?/, './');
  const targetEndpoint = targetDir.substring(1);

  if (!(await pathExists(staticPath))) {
    throw new Error(
      dedent(chalk`
        Failed to load static files, no such directory: {cyan ${staticPath}}
        Make sure this directory exists, or omit the {bold -s (--static-dir)} option.
      `)
    );
  }

  return { staticDir, staticPath, targetDir, targetEndpoint };
};
