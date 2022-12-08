import { dirname, join, resolve } from 'path';
import { DefinePlugin, HotModuleReplacementPlugin, ProgressPlugin, ProvidePlugin } from 'webpack';
import type { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// @ts-expect-error (I removed this on purpose, because it's incorrect)
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import VirtualModulePlugin from 'webpack-virtual-modules';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import type { Options, CoreConfig, DocsOptions, PreviewAnnotation } from '@storybook/types';
import { globals } from '@storybook/preview/globals';
import {
  getRendererName,
  stringifyProcessEnvs,
  handlebars,
  interpolate,
  normalizeStories,
  readTemplate,
  loadPreviewOrConfigFile,
  isPreservingSymlinks,
} from '@storybook/core-common';
import { toRequireContextString, toImportFn } from '@storybook/core-webpack';
import type { BuilderOptions, TypescriptOptions } from '../types';
import { createBabelLoader } from './babel-loader-preview';

const storybookPaths: Record<string, string> = {
  global: dirname(require.resolve(`global/package.json`)),
  ...[
    // these packages are not pre-bundled because of react dependencies
    'api',
    'manager-api',
    'components',
    'router',
    'theming',
  ].reduce(
    (acc, sbPackage) => ({
      ...acc,
      [`@storybook/${sbPackage}`]: dirname(require.resolve(`@storybook/${sbPackage}/package.json`)),
    }),
    {}
  ),
  // deprecated, remove in 8.0
  [`@storybook/api`]: dirname(require.resolve(`@storybook/manager-api/package.json`)),
};

export default async (
  options: Options & Record<string, any> & { typescriptOptions: TypescriptOptions }
): Promise<Configuration> => {
  const {
    outputDir = join('.', 'public'),
    quiet,
    packageJson,
    configType,
    presets,
    previewUrl,
    babelOptions,
    typescriptOptions,
    features,
    serverChannelUrl,
  } = options;

  const isProd = configType === 'PRODUCTION';
  const workingDir = process.cwd();

  const [
    coreOptions,
    frameworkOptions,
    envs,
    logLevel,
    headHtmlSnippet,
    bodyHtmlSnippet,
    template,
    docsOptions,
    entries,
    nonNormalizedStories,
  ] = await Promise.all([
    presets.apply<CoreConfig>('core'),
    presets.apply('frameworkOptions'),
    presets.apply<Record<string, string>>('env'),
    presets.apply('logLevel', undefined),
    presets.apply('previewHead'),
    presets.apply('previewBody'),
    presets.apply<string>('previewMainTemplate'),
    presets.apply<DocsOptions>('docs'),
    presets.apply<string[]>('entries', [], options),
    presets.apply('stories', [], options),
  ]);

  const stories = normalizeStories(nonNormalizedStories, {
    configDir: options.configDir,
    workingDir,
  });

  const builderOptions: BuilderOptions =
    typeof coreOptions.builder === 'string'
      ? {}
      : coreOptions.builder?.options || ({} as BuilderOptions);

  const previewAnnotations = [
    ...(await presets.apply<PreviewAnnotation[]>('previewAnnotations', [], options)).map(
      (entry) => {
        // If entry is an object, use the absolute import specifier.
        // This is to maintain back-compat with community addons that bundle other addons
        // and package managers that "hide" sub dependencies (e.g. pnpm / yarn pnp)
        // The vite builder uses the bare import specifier.
        if (typeof entry === 'object') {
          return entry.absolute;
        }
        return entry;
      }
    ),
    loadPreviewOrConfigFile(options),
  ].filter(Boolean);

  const virtualModuleMapping: Record<string, string> = {};
  if (features?.storyStoreV7) {
    const storiesFilename = 'storybook-stories.js';
    const storiesPath = resolve(join(workingDir, storiesFilename));

    const needPipelinedImport = !!builderOptions.lazyCompilation && !isProd;
    virtualModuleMapping[storiesPath] = toImportFn(stories, { needPipelinedImport });
    const configEntryPath = resolve(join(workingDir, 'storybook-config-entry.js'));
    virtualModuleMapping[configEntryPath] = handlebars(
      await readTemplate(
        require.resolve(
          '@storybook/builder-webpack5/templates/virtualModuleModernEntry.js.handlebars'
        )
      ),
      {
        storiesFilename,
        previewAnnotations,
      }
      // We need to double escape `\` for webpack. We may have some in windows paths
    ).replace(/\\/g, '\\\\');
    entries.push(configEntryPath);
  } else {
    const rendererName = await getRendererName(options);

    const rendererInitEntry = resolve(join(workingDir, 'storybook-init-renderer-entry.js'));
    virtualModuleMapping[rendererInitEntry] = `import '${rendererName}';`;
    entries.push(rendererInitEntry);

    const entryTemplate = await readTemplate(
      join(__dirname, '..', '..', 'templates', 'virtualModuleEntry.template.js')
    );

    previewAnnotations.forEach((previewAnnotationFilename: string | undefined) => {
      if (!previewAnnotationFilename) return;
      const previewApi = storybookPaths['@storybook/preview-api'];
      const clientLogger = storybookPaths['@storybook/client-logger'];

      // Ensure that relative paths end up mapped to a filename in the cwd, so a later import
      // of the `previewAnnotationFilename` in the template works.
      const entryFilename = previewAnnotationFilename.startsWith('.')
        ? `${previewAnnotationFilename.replace(/(\w)(\/|\\)/g, '$1-')}-generated-config-entry.js`
        : `${previewAnnotationFilename}-generated-config-entry.js`;
      // NOTE: although this file is also from the `dist/cjs` directory, it is actually a ESM
      // file, see https://github.com/storybookjs/storybook/pull/16727#issuecomment-986485173
      virtualModuleMapping[entryFilename] = interpolate(entryTemplate, {
        previewAnnotationFilename,
        previewApi,
        clientLogger,
      });
      entries.push(entryFilename);
    });
    if (stories.length > 0) {
      const storyTemplate = await readTemplate(
        join(__dirname, '..', '..', 'templates', 'virtualModuleStory.template.js')
      );
      // NOTE: this file has a `.cjs` extension as it is a CJS file (from `dist/cjs`) and runs
      // in the user's webpack mode, which may be strict about the use of require/import.
      // See https://github.com/storybookjs/storybook/issues/14877
      const storiesFilename = resolve(join(workingDir, `generated-stories-entry.cjs`));
      virtualModuleMapping[storiesFilename] = interpolate(storyTemplate, {
        rendererName,
      })
        // Make sure we also replace quotes for this one
        .replace("'{{stories}}'", stories.map(toRequireContextString).join(','));
      entries.push(storiesFilename);
    }
  }

  const shouldCheckTs = typescriptOptions.check && !typescriptOptions.skipBabel;
  const tsCheckOptions = typescriptOptions.checkOptions || {};

  const cacheConfig = builderOptions.fsCache ? { cache: { type: 'filesystem' as const } } : {};
  const lazyCompilationConfig =
    builderOptions.lazyCompilation && !isProd
      ? {
          lazyCompilation: { entries: false },
        }
      : {};

  return {
    name: 'preview',
    mode: isProd ? 'production' : 'development',
    bail: isProd,
    devtool: 'cheap-module-source-map',
    entry: entries,
    output: {
      path: resolve(process.cwd(), outputDir),
      filename: isProd ? '[name].[contenthash:8].iframe.bundle.js' : '[name].iframe.bundle.js',
      publicPath: '',
    },
    stats: {
      preset: 'none',
      logging: 'error',
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    externals: globals,
    ignoreWarnings: [
      {
        message: /export '\S+' was not found in 'global'/,
      },
    ],
    plugins: [
      Object.keys(virtualModuleMapping).length > 0
        ? new VirtualModulePlugin(virtualModuleMapping)
        : (null as any),
      new HtmlWebpackPlugin({
        filename: `iframe.html`,
        // FIXME: `none` isn't a known option
        chunksSortMode: 'none' as any,
        alwaysWriteToDisk: true,
        inject: false,
        template,
        templateParameters: {
          version: packageJson.version,
          globals: {
            CONFIG_TYPE: configType,
            LOGLEVEL: logLevel,
            FRAMEWORK_OPTIONS: frameworkOptions,
            CHANNEL_OPTIONS: coreOptions.channelOptions,
            FEATURES: features,
            PREVIEW_URL: previewUrl,
            STORIES: stories.map((specifier) => ({
              ...specifier,
              importPathMatcher: specifier.importPathMatcher.source,
            })),
            DOCS_OPTIONS: docsOptions,
            SERVER_CHANNEL_URL: serverChannelUrl,
          },
          headHtmlSnippet,
          bodyHtmlSnippet,
        },
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: false,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      }),
      new DefinePlugin({
        ...stringifyProcessEnvs(envs),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),
      new ProvidePlugin({ process: require.resolve('process/browser.js') }),
      isProd ? null : new HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      quiet ? null : new ProgressPlugin({}),
      shouldCheckTs ? new ForkTsCheckerWebpackPlugin(tsCheckOptions) : null,
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.m?js$/,
          type: 'javascript/auto',
        },
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false,
          },
        },
        createBabelLoader(babelOptions, typescriptOptions),
        {
          test: /\.md$/,
          type: 'asset/source',
        },
      ],
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.cjs'],
      modules: ['node_modules'].concat(envs.NODE_PATH || []),
      mainFields: ['browser', 'module', 'main'].filter(Boolean),
      alias: storybookPaths,
      fallback: {
        path: require.resolve('path-browserify'),
        assert: require.resolve('browser-assert'),
        util: require.resolve('util'),
      },
      // Set webpack to resolve symlinks based on whether the user has asked node to.
      // This feels like it should be default out-of-the-box in webpack :shrug:
      symlinks: !isPreservingSymlinks(),
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: true,
      sideEffects: true,
      usedExports: isProd,
      moduleIds: 'named',
      minimizer: isProd
        ? [
            new TerserWebpackPlugin({
              parallel: true,
              terserOptions: {
                sourceMap: true,
                mangle: false,
                keep_fnames: true,
              },
            }),
          ]
        : [],
    },
    performance: {
      hints: isProd ? 'warning' : false,
    },
    ...cacheConfig,
    experiments: { ...lazyCompilationConfig },
  };
};
