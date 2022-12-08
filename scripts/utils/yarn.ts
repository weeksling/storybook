import { readJSON, writeJSON } from 'fs-extra';
import path from 'path';

import { exec } from './exec';
// TODO -- should we generate this file a second time outside of CLI?
import storybookVersions from '../../code/lib/cli/src/versions';

export type YarnOptions = {
  cwd: string;
  dryRun: boolean;
  debug: boolean;
};

const logger = console;

export const addPackageResolutions = async ({ cwd, dryRun }: YarnOptions) => {
  logger.info(`🔢 Adding package resolutions:`);
  if (dryRun) return;

  const packageJsonPath = path.join(cwd, 'package.json');
  const packageJson = await readJSON(packageJsonPath);
  packageJson.resolutions = { ...storybookVersions, 'enhanced-resolve': '~5.10.0' };
  await writeJSON(packageJsonPath, packageJson, { spaces: 2 });
};

export const installYarn2 = async ({ cwd, dryRun, debug }: YarnOptions) => {
  const command = [
    `touch yarn.lock`,
    `touch yarnrc.yml`,
    `yarn set version berry`,
    // Use the global cache so we aren't re-caching dependencies each time we run sandbox
    `yarn config set enableGlobalCache true`,
    `yarn config set nodeLinker node-modules`,
  ];

  await exec(
    command,
    { cwd },
    {
      dryRun,
      debug,
      startMessage: `🧶 Installing Yarn 2`,
      errorMessage: `🚨 Installing Yarn 2 failed`,
    }
  );
};

export const configureYarn2ForVerdaccio = async ({ cwd, dryRun, debug }: YarnOptions) => {
  const command = [
    // We don't want to use the cache or we might get older copies of our built packages
    // (with identical versions), as yarn (correctly I guess) assumes the same version hasn't changed
    `yarn config set enableGlobalCache false`,
    `yarn config set enableMirror false`,
    // ⚠️ Need to set registry because Yarn 2 is not using the conf of Yarn 1 (URL is hardcoded in CircleCI config.yml)
    `yarn config set npmScopes --json '{ "storybook": { "npmRegistryServer": "http://localhost:6001/" } }'`,
    // Some required magic to be able to fetch deps from local registry
    `yarn config set unsafeHttpWhitelist --json '["localhost"]'`,
    // Disable fallback mode to make sure everything is required correctly
    `yarn config set pnpFallbackMode none`,
    // We need to be able to update lockfile when bootstrapping the examples
    `yarn config set enableImmutableInstalls false`,
    // Discard all YN0013 - FETCH_NOT_CACHED messages
    `yarn config set logFilters --json '[ { "code": "YN0013", "level": "discard" } ]'`,
  ];

  await exec(
    command,
    { cwd },
    {
      dryRun,
      debug,
      startMessage: `🎛 Configuring Yarn 2`,
      errorMessage: `🚨 Configuring Yarn 2 failed`,
    }
  );
};
