/* eslint-disable no-console */
import { join, relative } from 'path';
import type { Options as ExecaOptions } from 'execa';
import pLimit from 'p-limit';
import prettyTime from 'pretty-hrtime';
import { copy, emptyDir, ensureDir, move, remove, rename, writeFile } from 'fs-extra';
import { program } from 'commander';
import { directory } from 'tempy';
import { execaCommand } from '../utils/exec';

import type { OptionValues } from '../utils/options';
import { createOptions } from '../utils/options';
import { allTemplates as reproTemplates } from '../../code/lib/cli/src/repro-templates';
import storybookVersions from '../../code/lib/cli/src/versions';
import { JsPackageManagerFactory } from '../../code/lib/cli/src/js-package-manager/JsPackageManagerFactory';

import { maxConcurrentTasks } from '../utils/maxConcurrentTasks';

// eslint-disable-next-line import/no-cycle
import { localizeYarnConfigFiles, setupYarn } from './utils/yarn';
import type { GeneratorConfig } from './utils/types';
import { getStackblitzUrl, renderTemplate } from './utils/template';
import type { JsPackageManager } from '../../code/lib/cli/src/js-package-manager';

const OUTPUT_DIRECTORY = join(__dirname, '..', '..', 'repros');
const BEFORE_DIR_NAME = 'before-storybook';
const AFTER_DIR_NAME = 'after-storybook';
const SCRIPT_TIMEOUT = 5 * 60 * 1000;

const sbInit = async (cwd: string, flags?: string[], debug?: boolean) => {
  const sbCliBinaryPath = join(__dirname, `../../code/lib/cli/bin/index.js`);
  console.log(`🎁 Installing storybook`);
  const env = { STORYBOOK_DISABLE_TELEMETRY: 'true', STORYBOOK_REPRO_GENERATOR: 'true' };
  const fullFlags = ['--yes', ...(flags || [])];
  await runCommand(`${sbCliBinaryPath} init ${fullFlags.join(' ')}`, { cwd, env }, debug);
};

const LOCAL_REGISTRY_URL = 'http://localhost:6001';
const withLocalRegistry = async (packageManager: JsPackageManager, action: () => Promise<void>) => {
  const prevUrl = packageManager.getRegistryURL();
  let error;
  try {
    console.log(`📦 Configuring local registry: ${LOCAL_REGISTRY_URL}`);
    packageManager.setRegistryURL(LOCAL_REGISTRY_URL);
    await action();
  } catch (e) {
    error = e;
  } finally {
    console.log(`📦 Restoring registry: ${prevUrl}`);
    packageManager.setRegistryURL(prevUrl);

    if (error) {
      // eslint-disable-next-line no-unsafe-finally
      throw error;
    }
  }
};

const addStorybook = async ({
  baseDir,
  localRegistry,
  flags,
  debug,
}: {
  baseDir: string;
  localRegistry: boolean;
  flags?: string[];
  debug?: boolean;
}) => {
  const beforeDir = join(baseDir, BEFORE_DIR_NAME);
  const afterDir = join(baseDir, AFTER_DIR_NAME);
  const tmpDir = join(baseDir, 'tmp');

  await ensureDir(tmpDir);
  await emptyDir(tmpDir);

  await copy(beforeDir, tmpDir);

  const packageManager = JsPackageManagerFactory.getPackageManager({}, tmpDir);
  if (localRegistry) {
    await withLocalRegistry(packageManager, async () => {
      packageManager.addPackageResolutions(storybookVersions);

      await sbInit(tmpDir, flags, debug);
    });
  } else {
    await sbInit(tmpDir, flags, debug);
  }
  await rename(tmpDir, afterDir);
};

export const runCommand = async (script: string, options: ExecaOptions, debug: boolean) => {
  if (debug) {
    console.log(`Running command: ${script}`);
  }

  return execaCommand(script, {
    stdout: debug ? 'inherit' : 'ignore',
    shell: true,
    ...options,
  });
};

const addDocumentation = async (
  baseDir: string,
  { name, dirName }: { name: string; dirName: string }
) => {
  const afterDir = join(baseDir, AFTER_DIR_NAME);
  const stackblitzConfigPath = join(__dirname, 'templates', '.stackblitzrc');
  const readmePath = join(__dirname, 'templates', 'item.ejs');

  await copy(stackblitzConfigPath, join(afterDir, '.stackblitzrc'));

  const stackblitzUrl = getStackblitzUrl(dirName);
  const contents = await renderTemplate(readmePath, {
    name,
    stackblitzUrl,
  });
  await writeFile(join(afterDir, 'README.md'), contents);
};

const runGenerators = async (
  generators: (GeneratorConfig & { dirName: string })[],
  localRegistry = true,
  debug = false
) => {
  console.log(`🤹‍♂️ Generating repros with a concurrency of ${maxConcurrentTasks}`);

  const limit = pLimit(maxConcurrentTasks);

  await Promise.all(
    generators.map(({ dirName, name, script, expected }) =>
      limit(async () => {
        const flags = expected.renderer === '@storybook/html' ? ['--type html'] : [];

        const time = process.hrtime();
        console.log(`🧬 generating ${name}`);

        const baseDir = join(OUTPUT_DIRECTORY, dirName);
        const beforeDir = join(baseDir, BEFORE_DIR_NAME);
        await emptyDir(baseDir);

        // We do the creation inside a temp dir to avoid yarn container problems
        const createBaseDir = directory();
        await setupYarn({ cwd: createBaseDir });

        const createBeforeDir = join(createBaseDir, BEFORE_DIR_NAME);

        // Some tools refuse to run inside an existing directory and replace the contents,
        // where as others are very picky about what directories can be called. So we need to
        // handle different modes of operation.
        if (script.includes('{{beforeDir}}')) {
          const scriptWithBeforeDir = script.replaceAll('{{beforeDir}}', BEFORE_DIR_NAME);
          await runCommand(
            scriptWithBeforeDir,
            {
              cwd: createBaseDir,
              timeout: SCRIPT_TIMEOUT,
            },
            debug
          );
        } else {
          await ensureDir(createBeforeDir);
          await runCommand(script, { cwd: createBeforeDir, timeout: SCRIPT_TIMEOUT }, debug);
        }

        await localizeYarnConfigFiles(createBaseDir, createBeforeDir);

        // Now move the created before dir into it's final location and add storybook
        await move(createBeforeDir, beforeDir);

        // Make sure there are no git projects in the folder
        await remove(join(beforeDir, '.git'));

        await addStorybook({ baseDir, localRegistry, flags, debug });

        await addDocumentation(baseDir, { name, dirName });

        // Remove node_modules to save space and avoid GH actions failing
        // They're not uploaded to the git repros repo anyway
        if (process.env.CLEANUP_REPRO_NODE_MODULES) {
          console.log(`🗑️ Removing ${join(beforeDir, 'node_modules')}`);
          await remove(join(beforeDir, 'node_modules'));
          console.log(`🗑️ Removing ${join(baseDir, AFTER_DIR_NAME, 'node_modules')}`);
          await remove(join(baseDir, AFTER_DIR_NAME, 'node_modules'));
        }

        console.log(
          `✅ Created ${dirName} in ./${relative(
            process.cwd(),
            baseDir
          )} successfully in ${prettyTime(process.hrtime(time))}`
        );
      })
    )
  );
};

export const options = createOptions({
  template: {
    type: 'string',
    description: 'Which template would you like to create?',
    values: Object.keys(reproTemplates),
  },
  localRegistry: {
    type: 'boolean',
    description: 'Generate reproduction from local registry?',
    promptType: false,
  },
  debug: {
    type: 'boolean',
    description: 'Print all the logs to the console',
    promptType: false,
  },
});

export const generate = async ({
  template,
  localRegistry,
  debug,
}: OptionValues<typeof options>) => {
  const generatorConfigs = Object.entries(reproTemplates)
    .map(([dirName, configuration]) => ({
      dirName,
      ...configuration,
    }))
    .filter(({ dirName }) => {
      if (template) {
        return dirName === template;
      }

      return true;
    });

  await runGenerators(generatorConfigs, localRegistry, debug);
};

if (require.main === module) {
  program
    .description('Create a reproduction from a set of possible templates')
    .option('--template <template>', 'Create a single template')
    .option('--debug', 'Print all the logs to the console')
    .option('--local-registry', 'Use local registry', false)
    .action((optionValues) => {
      generate(optionValues)
        .catch((e) => {
          console.trace(e);
          process.exit(1);
        })
        .then(() => {
          // FIXME: Kill dangling processes. For some reason in CI,
          // the abort signal gets executed but the child process kill
          // does not succeed?!?
          process.exit(0);
        });
    })
    .parse(process.argv);
}
