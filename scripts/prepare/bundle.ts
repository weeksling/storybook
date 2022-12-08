#!/usr/bin/env ../../node_modules/.bin/ts-node

import fs from 'fs-extra';
import path, { dirname, join, relative } from 'path';
import { build } from 'tsup';
import aliasPlugin from 'esbuild-plugin-alias';
import dedent from 'ts-dedent';
import slash from 'slash';
import { exec } from '../utils/exec';

const hasFlag = (flags: string[], name: string) => !!flags.find((s) => s.startsWith(`--${name}`));

const run = async ({ cwd, flags }: { cwd: string; flags: string[] }) => {
  const {
    name,
    dependencies,
    peerDependencies,
    bundler: { entries = [], untypedEntries = [], platform, pre, post },
  } = await fs.readJson(join(cwd, 'package.json'));

  if (pre) {
    await exec(`node -r ${__dirname}/../node_modules/esbuild-register/register.js ${pre}`, { cwd });
  }

  const reset = hasFlag(flags, 'reset');
  const watch = hasFlag(flags, 'watch');
  const optimized = hasFlag(flags, 'optimized');

  if (reset) {
    await fs.emptyDir(join(process.cwd(), 'dist'));
  }

  const tsConfigPath = join(cwd, 'tsconfig.json');
  const tsConfigExists = await fs.pathExists(tsConfigPath);

  await Promise.all([
    // SHIM DTS FILES (only for development)
    ...(optimized
      ? []
      : entries.map(async (file: string) => {
          const { name: entryName, dir } = path.parse(file);

          const pathName = join(process.cwd(), dir.replace('./src', 'dist'), `${entryName}.d.ts`);
          const srcName = join(process.cwd(), file);

          const rel = relative(dirname(pathName), dirname(srcName))
            .split(path.sep)
            .join(path.posix.sep);

          await fs.ensureFile(pathName);
          await fs.writeFile(
            pathName,
            dedent`
              // dev-mode
              export * from '${rel}/${entryName}';
            `
          );
        })),

    // BROWSER EMS
    build({
      silent: true,
      entry: [...entries, ...untypedEntries].map((e: string) => slash(join(cwd, e))),
      watch,
      ...(tsConfigExists ? { tsconfig: tsConfigPath } : {}),
      outDir: join(process.cwd(), 'dist'),
      format: ['esm'],
      target: 'chrome100',
      clean: !watch,
      platform: platform || 'browser',
      esbuildPlugins: [
        aliasPlugin({
          process: path.resolve('../node_modules/process/browser.js'),
          util: path.resolve('../node_modules/util/util.js'),
        }),
      ],
      external: [name, ...Object.keys(dependencies || {}), ...Object.keys(peerDependencies || {})],

      dts:
        optimized && tsConfigExists
          ? {
              entry: entries,
              resolve: true,
            }
          : false,
      esbuildOptions: (c) => {
        /* eslint-disable no-param-reassign */
        c.conditions = ['module'];
        c.logLevel = 'error';
        c.platform = platform || 'browser';
        c.legalComments = 'none';
        c.minifyWhitespace = optimized;
        c.minifyIdentifiers = false;
        c.minifySyntax = optimized;
        /* eslint-enable no-param-reassign */
      },
    }),

    // NODE CJS
    build({
      silent: true,
      entry: [...entries, ...untypedEntries].map((e: string) => slash(join(cwd, e))),
      watch,
      outDir: join(process.cwd(), 'dist'),
      ...(tsConfigExists ? { tsconfig: tsConfigPath } : {}),
      format: ['cjs'],
      target: 'node16',
      platform: 'node',
      clean: !watch,
      external: [name, ...Object.keys(dependencies || {}), ...Object.keys(peerDependencies || {})],

      esbuildOptions: (c) => {
        /* eslint-disable no-param-reassign */
        c.logLevel = 'error';
        c.platform = 'node';
        c.legalComments = 'none';
        c.minifyWhitespace = optimized;
        c.minifyIdentifiers = optimized;
        c.minifySyntax = optimized;
        /* eslint-enable no-param-reassign */
      },
    }),
  ]);

  if (post) {
    await exec(
      `node -r ${__dirname}/../node_modules/esbuild-register/register.js ${post}`,
      { cwd },
      { debug: true }
    );
  }
};

const flags = process.argv.slice(2);
const cwd = process.cwd();

run({ cwd, flags }).catch((err: unknown) => {
  // We can't let the stack try to print, it crashes in a way that sets the exit code to 0.
  // Seems to have something to do with running JSON.parse() on binary / base64 encoded sourcemaps
  // in @cspotcode/source-map-support
  if (err instanceof Error) {
    console.error(err.stack);
  }
  process.exit(1);
});
