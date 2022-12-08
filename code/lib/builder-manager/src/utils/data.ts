import { join } from 'path';
import type { DocsOptions, Options } from '@storybook/types';
import { getRefs } from '@storybook/core-common';

import { readTemplate } from './template';
// eslint-disable-next-line import/no-cycle
import { executor, getConfig } from '../index';
import { safeResolve } from './safeResolve';

export const getData = async (options: Options) => {
  const refs = getRefs(options);
  const features = options.presets.apply<Record<string, string | boolean>>('features');
  const logLevel = options.presets.apply<string>('logLevel');
  const title = options.presets.apply<string>('title');
  const docsOptions = options.presets.apply<DocsOptions>('docs', {});
  const template = readTemplate('template.ejs');
  const customHead = safeResolve(join(options.configDir, 'manager-head.html'));

  // we await these, because crucially if these fail, we want to bail out asap
  const [instance, config] = await Promise.all([
    //
    executor.get(),
    getConfig(options),
  ]);

  return {
    refs,
    features,
    title,
    docsOptions,
    template,
    customHead,
    instance,
    config,
    logLevel,
  };
};
