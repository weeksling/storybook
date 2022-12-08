import type { OptionSpecifier, OptionValues } from './options';
import { createOptions, getCommand } from './options';
import { exec } from './exec';

const cliExecutable = require.resolve('../../code/lib/cli/bin/index.js');

export type CLIStep<TOptions extends OptionSpecifier> = {
  command: string;
  description: string;
  hasArgument?: boolean;
  icon: string;
  // It would be kind of great to be able to share these with `lib/cli/src/generate.ts`
  options: TOptions;
};

export const steps = {
  repro: {
    command: 'repro-next',
    description: 'Bootstrapping Template',
    icon: '👷',
    hasArgument: true,
    options: createOptions({
      output: { type: 'string' },
      // TODO allow default values for strings
      branch: { type: 'string', values: ['next'] },
      init: { type: 'boolean', inverse: true },
      debug: { type: 'boolean' },
    }),
  },
  init: {
    command: 'init',
    description: 'Initializing Storybook',
    icon: '⚙️',
    options: createOptions({
      yes: { type: 'boolean', inverse: true },
      type: { type: 'string' },
      debug: { type: 'boolean' },
    }),
  },
  add: {
    command: 'add',
    description: 'Adding addon',
    icon: '+',
    hasArgument: true,
    options: createOptions({}),
  },
  link: {
    command: 'link',
    description: 'Linking packages',
    icon: '🔗',
    hasArgument: true,
    options: createOptions({
      local: { type: 'boolean' },
      start: { type: 'boolean', inverse: true },
    }),
  },
  build: {
    command: 'build',
    description: 'Building Storybook',
    icon: '🔨',
    options: createOptions({}),
  },
  dev: {
    command: 'dev',
    description: 'Starting Storybook',
    icon: '🖥 ',
    options: createOptions({}),
  },
};

export async function executeCLIStep<TOptions extends OptionSpecifier>(
  cliStep: CLIStep<TOptions>,
  options: {
    argument?: string;
    optionValues?: Partial<OptionValues<TOptions>>;
    cwd: string;
    dryRun?: boolean;
    debug: boolean;
  }
) {
  if (cliStep.hasArgument && !options.argument)
    throw new Error(`Argument required for ${cliStep.command} command.`);

  const prefix = `node ${cliExecutable} ${cliStep.command}`;
  const command = getCommand(
    cliStep.hasArgument ? `${prefix} ${options.argument}` : prefix,
    cliStep.options,
    options.optionValues || {}
  );

  await exec(
    command,
    {
      cwd: options.cwd,
      env: {
        STORYBOOK_DISABLE_TELEMETRY: 'true',
      },
    },
    {
      startMessage: `${cliStep.icon} ${cliStep.description}`,
      errorMessage: `🚨 ${cliStep.description} failed`,
      dryRun: options.dryRun,
      debug: options.debug,
    }
  );
}
