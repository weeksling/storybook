import { dedent } from 'ts-dedent';
import { logger } from '@storybook/node-logger';
import type {
  BuilderOptions,
  CLIOptions,
  CoreCommon_ResolvedAddonPreset,
  CoreCommon_ResolvedAddonVirtual,
  LoadedPreset,
  LoadOptions,
  PresetConfig,
  Presets,
} from '@storybook/types';
import { join, parse } from 'path';
import { loadCustomPresets } from './utils/load-custom-presets';
import { safeResolve, safeResolveFrom } from './utils/safeResolve';
import { interopRequireDefault } from './utils/interpret-require';

const isObject = (val: unknown): val is Record<string, any> =>
  val != null && typeof val === 'object' && Array.isArray(val) === false;
const isFunction = (val: unknown): val is Function => typeof val === 'function';

export function filterPresetsConfig(presetsConfig: PresetConfig[]): PresetConfig[] {
  return presetsConfig.filter((preset) => {
    const presetName = typeof preset === 'string' ? preset : preset.name;
    return !/@storybook[\\\\/]preset-typescript/.test(presetName);
  });
}

function resolvePresetFunction<T = any>(
  input: T[] | Function,
  presetOptions: any,
  storybookOptions: InterPresetOptions
): T[] {
  if (isFunction(input)) {
    return [...input({ ...storybookOptions, ...presetOptions })];
  }
  if (Array.isArray(input)) {
    return [...input];
  }

  return [];
}

/**
 * Parse an addon into either a managerEntries or a preset. Throw on invalid input.
 *
 * Valid inputs:
 * - '@storybook/addon-actions/manager'
 *   =>  { type: 'virtual', item }
 *
 * - '@storybook/addon-docs/preset'
 *   =>  { type: 'presets', item }
 *
 * - '@storybook/addon-docs'
 *   =>  { type: 'presets', item: '@storybook/addon-docs/preset' }
 *
 * - { name: '@storybook/addon-docs(/preset)?', options: { ... } }
 *   =>  { type: 'presets', item: { name: '@storybook/addon-docs/preset', options } }
 */

export const resolveAddonName = (
  configDir: string,
  name: string,
  options: any
): CoreCommon_ResolvedAddonPreset | CoreCommon_ResolvedAddonVirtual | undefined => {
  const resolve = name.startsWith('/') ? safeResolve : safeResolveFrom.bind(null, configDir);
  const resolved = resolve(name);

  if (resolved) {
    const { dir: fdir, name: fname } = parse(resolved);

    if (name.match(/\/(manager|register(-panel)?)(\.(js|mjs|ts|tsx|jsx))?$/)) {
      return {
        type: 'virtual',
        name,
        // we remove the extension
        // this is a bit of a hack to try to find .mjs files
        // node can only ever resolve .js files; it does not look at the exports field in package.json
        managerEntries: [join(fdir, fname)],
      };
    }
    if (name.match(/\/(preset)(\.(js|mjs|ts|tsx|jsx))?$/)) {
      return {
        type: 'presets',
        name: resolved,
      };
    }
  }

  const checkExists = (exportName: string) => {
    if (resolve(`${name}${exportName}`)) return `${name}${exportName}`;
    return undefined;
  };

  // This is used to maintain back-compat with community addons that do not
  // re-export their sub-addons but reference the sub-addon name directly.
  //  We need to turn it into an absolute path so that webpack can
  // serve it up correctly  when yarn pnp or pnpm is being used.
  // Vite will be broken in such cases, because it does not process absolute paths,
  // and it will try to import from the bare import, breaking in pnp/pnpm.
  const absolutizeExport = (exportName: string) => {
    return resolve(`${name}${exportName}`);
  };

  const managerFile = absolutizeExport(`/manager`);
  const registerFile = absolutizeExport(`/register`) || absolutizeExport(`/register-panel`);
  const previewFile = checkExists(`/preview`);
  const previewFileAbsolute = absolutizeExport('/preview');
  const presetFile = absolutizeExport(`/preset`);

  if (!(managerFile || previewFile) && presetFile) {
    return {
      type: 'presets',
      name: presetFile,
    };
  }

  if (managerFile || registerFile || previewFile || presetFile) {
    const managerEntries = [];

    if (managerFile) {
      // we remove the extension
      // this is a bit of a hack to try to find .mjs files
      // node can only ever resolve .js files; it does not look at the exports field in package.json
      const { dir: fdir, name: fname } = parse(managerFile);
      managerEntries.push(join(fdir, fname));
    }
    // register file is the old way of registering addons
    if (!managerFile && registerFile && !presetFile) {
      // we remove the extension
      // this is a bit of a hack to try to find .mjs files
      // node can only ever resolve .js files; it does not look at the exports field in package.json
      const { dir: fdir, name: fname } = parse(registerFile);
      managerEntries.push(join(fdir, fname));
    }

    return {
      type: 'virtual',
      name,
      ...(managerEntries.length ? { managerEntries } : {}),
      ...(previewFile
        ? {
            previewAnnotations: [
              previewFileAbsolute
                ? { bare: previewFile, absolute: previewFileAbsolute }
                : previewFile,
            ],
          }
        : {}),
      ...(presetFile ? { presets: [{ name: presetFile, options }] } : {}),
    };
  }

  if (resolved) {
    return {
      type: 'presets',
      name: resolved,
    };
  }

  return undefined;
};

const map =
  ({ configDir }: InterPresetOptions) =>
  (item: any) => {
    const options = isObject(item) ? item['options'] || undefined : undefined;
    const name = isObject(item) ? item['name'] : item;
    try {
      const resolved = resolveAddonName(configDir, name, options);
      return {
        ...(options ? { options } : {}),
        ...resolved,
      };
    } catch (err) {
      logger.error(
        `Addon value should end in /manager or /preview or /register OR it should be a valid preset https://storybook.js.org/docs/react/addons/writing-presets/\n${item}`
      );
    }
    return undefined;
  };

async function getContent(input: any) {
  if (input.type === 'virtual') {
    const { type, name, ...rest } = input;
    return rest;
  }
  const name = input.name ? input.name : input;

  return interopRequireDefault(name);
}

export async function loadPreset(
  input: PresetConfig,
  level: number,
  storybookOptions: InterPresetOptions
): Promise<LoadedPreset[]> {
  try {
    // @ts-expect-error (Converted from ts-ignore)
    const name: string = input.name ? input.name : input;
    // @ts-expect-error (Converted from ts-ignore)
    const presetOptions = input.options ? input.options : {};

    let contents = await getContent(input);

    if (typeof contents === 'function') {
      // allow the export of a preset to be a function, that gets storybookOptions
      contents = contents(storybookOptions, presetOptions);
    }

    if (Array.isArray(contents)) {
      const subPresets = contents;
      return await loadPresets(subPresets, level + 1, storybookOptions);
    }

    if (isObject(contents)) {
      const { addons: addonsInput, presets: presetsInput, ...rest } = contents;

      const subPresets = resolvePresetFunction(presetsInput, presetOptions, storybookOptions);
      const subAddons = resolvePresetFunction(addonsInput, presetOptions, storybookOptions);

      return [
        ...(await loadPresets([...subPresets], level + 1, storybookOptions)),
        ...(await loadPresets(
          [...subAddons.map(map(storybookOptions))].filter(Boolean) as PresetConfig[],
          level + 1,
          storybookOptions
        )),
        {
          name,
          preset: rest,
          options: presetOptions,
        },
      ];
    }

    throw new Error(dedent`
      ${input} is not a valid preset
    `);
  } catch (e: any) {
    const warning =
      level > 0
        ? `  Failed to load preset: ${JSON.stringify(input)} on level ${level}`
        : `  Failed to load preset: ${JSON.stringify(input)}`;

    logger.warn(warning);
    logger.error(e);
    return [];
  }
}

async function loadPresets(
  presets: PresetConfig[],
  level: number,
  storybookOptions: InterPresetOptions
): Promise<LoadedPreset[]> {
  if (!presets || !Array.isArray(presets) || !presets.length) {
    return [];
  }

  return (
    await Promise.all(presets.map(async (preset) => loadPreset(preset, level, storybookOptions)))
  ).reduce((acc, loaded) => {
    return acc.concat(loaded);
  }, []);
}

function applyPresets(
  presets: LoadedPreset[],
  extension: string,
  config: any,
  args: any,
  storybookOptions: InterPresetOptions
): Promise<any> {
  const presetResult = new Promise((res) => res(config));

  if (!presets.length) {
    return presetResult;
  }

  return presets.reduce((accumulationPromise: Promise<unknown>, { preset, options }) => {
    const change = preset[extension];

    if (!change) {
      return accumulationPromise;
    }

    if (typeof change === 'function') {
      const extensionFn = change;
      const context = {
        preset,
        combinedOptions: {
          ...storybookOptions,
          ...args,
          ...options,
          presetsList: presets,
          presets: {
            apply: async (ext: string, c: any, a = {}) =>
              applyPresets(presets, ext, c, a, storybookOptions),
          },
        },
      };

      return accumulationPromise.then((newConfig) =>
        extensionFn.call(context.preset, newConfig, context.combinedOptions)
      );
    }

    return accumulationPromise.then((newConfig) => {
      if (Array.isArray(newConfig) && Array.isArray(change)) {
        return [...newConfig, ...change];
      }
      if (isObject(newConfig) && isObject(change)) {
        return { ...newConfig, ...change };
      }
      return change;
    });
  }, presetResult);
}

type InterPresetOptions = Omit<CLIOptions & LoadOptions & BuilderOptions, 'frameworkPresets'>;

export async function getPresets(
  presets: PresetConfig[],
  storybookOptions: InterPresetOptions
): Promise<Presets> {
  const loadedPresets: LoadedPreset[] = await loadPresets(presets, 0, storybookOptions);

  return {
    apply: async (extension: string, config: any, args = {}) =>
      applyPresets(loadedPresets, extension, config, args, storybookOptions),
  };
}

export async function loadAllPresets(
  options: CLIOptions &
    LoadOptions &
    BuilderOptions & {
      corePresets: PresetConfig[];
      overridePresets: PresetConfig[];
    }
) {
  const { corePresets = [], overridePresets = [], ...restOptions } = options;

  const presetsConfig: PresetConfig[] = [
    ...corePresets,
    ...loadCustomPresets(options),
    ...overridePresets,
  ];

  // Remove `@storybook/preset-typescript` and add a warning if in use.
  const filteredPresetConfig = filterPresetsConfig(presetsConfig);
  if (filteredPresetConfig.length < presetsConfig.length) {
    logger.warn(
      'Storybook now supports TypeScript natively. You can safely remove `@storybook/preset-typescript`.'
    );
  }

  return getPresets(filteredPresetConfig, restOptions);
}
