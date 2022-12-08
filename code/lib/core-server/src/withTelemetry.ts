import prompts from 'prompts';
import type { CLIOptions, CoreConfig } from '@storybook/types';
import { loadAllPresets, cache } from '@storybook/core-common';
import { telemetry, getPrecedingUpgrade } from '@storybook/telemetry';
import type { EventType } from '@storybook/telemetry';

type TelemetryOptions = {
  cliOptions?: CLIOptions;
  presetOptions?: Parameters<typeof loadAllPresets>[0];
};

const promptCrashReports = async () => {
  if (process.env.CI && process.env.NODE_ENV !== 'test') {
    return undefined;
  }

  const { enableCrashReports } = await prompts({
    type: 'confirm',
    name: 'enableCrashReports',
    message: `Would you like to send crash reports to Storybook?`,
    initial: true,
  });

  await cache.set('enableCrashReports', enableCrashReports);

  return enableCrashReports;
};

type ErrorLevel = 'none' | 'error' | 'full';

async function getErrorLevel({ cliOptions, presetOptions }: TelemetryOptions): Promise<ErrorLevel> {
  if (cliOptions?.disableTelemetry) return 'none';

  // If we are running init or similar, we just have to go with true here
  if (!presetOptions) return 'full';

  // should we load the preset?
  const presets = await loadAllPresets({
    corePresets: [require.resolve('./presets/common-preset')],
    overridePresets: [],
    ...presetOptions,
  });

  // If the user has chosen to enable/disable crash reports in main.js
  // or disabled telemetry, we can return that
  const core = await presets.apply<CoreConfig>('core');
  if (core?.enableCrashReports !== undefined) return core.enableCrashReports ? 'full' : 'error';
  if (core?.disableTelemetry) return 'none';

  // Deal with typo, remove in future version (7.1?)
  const valueFromCache =
    (await cache.get('enableCrashReports')) ?? (await cache.get('enableCrashreports'));
  if (valueFromCache !== undefined) return valueFromCache ? 'full' : 'error';

  const valueFromPrompt = await promptCrashReports();
  if (valueFromPrompt !== undefined) return valueFromPrompt ? 'full' : 'error';

  return 'full';
}

export async function withTelemetry(
  eventType: EventType,
  options: TelemetryOptions,
  run: () => Promise<void>
) {
  telemetry('boot', { eventType }, { stripMetadata: true });

  try {
    await run();
  } catch (error) {
    try {
      const errorLevel = await getErrorLevel(options);
      if (errorLevel !== 'none') {
        const precedingUpgrade = await getPrecedingUpgrade();

        await telemetry(
          'error',
          { eventType, precedingUpgrade, error: errorLevel === 'full' ? error : undefined },
          {
            immediate: true,
            configDir: options.cliOptions?.configDir || options.presetOptions?.configDir,
            enableCrashReports: errorLevel === 'full',
          }
        );
      }
    } catch (err) {
      // if this throws an error, we just move on
    }

    throw error;
  }
}
