import path from 'path';
import fse from 'fs-extra';
import { dedent } from 'ts-dedent';
import type { NpmOptions } from '../NpmOptions';
import type { SupportedRenderers, SupportedFrameworks, Builder } from '../project_types';
import { CoreBuilder } from '../project_types';
import { getBabelDependencies, copyComponents } from '../helpers';
import { configureMain, configurePreview } from './configure';
import type { JsPackageManager } from '../js-package-manager';
import { getPackageDetails } from '../js-package-manager';
import { generateStorybookBabelConfigInCWD } from '../babel-config';
import packageVersions from '../versions';
import type { FrameworkOptions, GeneratorOptions } from './types';

const defaultOptions: FrameworkOptions = {
  extraPackages: [],
  extraAddons: [],
  staticDir: undefined,
  addScripts: true,
  addComponents: true,
  addBabel: false,
  addESLint: false,
  extraMain: undefined,
  framework: undefined,
  extensions: undefined,
  commonJs: false,
};

const getBuilderDetails = (builder: string) => {
  const map = packageVersions as Record<string, string>;

  if (map[builder]) {
    return builder;
  }

  const builderPackage = `@storybook/${builder}`;
  if (map[builderPackage]) {
    return builderPackage;
  }

  return builder;
};

const wrapForPnp = (packageName: string) =>
  `%%path.dirname(require.resolve(path.join('${packageName}', 'package.json')))%%`;

const getFrameworkDetails = (
  renderer: SupportedRenderers,
  builder: Builder,
  pnp: boolean,
  framework?: SupportedFrameworks
): {
  type: 'framework' | 'renderer';
  packages: string[];
  builder?: string;
  framework?: string;
  renderer?: string;
  rendererId: SupportedRenderers;
} => {
  const frameworkPackage = framework
    ? `@storybook/${framework}`
    : `@storybook/${renderer}-${builder}`;
  const frameworkPackagePath = pnp ? wrapForPnp(frameworkPackage) : frameworkPackage;

  const rendererPackage = `@storybook/${renderer}`;
  const rendererPackagePath = pnp ? wrapForPnp(rendererPackage) : rendererPackage;

  const builderPackage = getBuilderDetails(builder);
  const builderPackagePath = pnp ? wrapForPnp(builderPackage) : builderPackage;

  const isKnownFramework = !!(packageVersions as Record<string, string>)[frameworkPackage];
  const isKnownRenderer = !!(packageVersions as Record<string, string>)[rendererPackage];

  if (isKnownFramework) {
    return {
      packages: [frameworkPackage],
      framework: frameworkPackagePath,
      rendererId: renderer,
      type: 'framework',
    };
  }

  if (isKnownRenderer) {
    return {
      packages: [rendererPackage, builderPackage],
      builder: builderPackagePath,
      renderer: rendererPackagePath,
      rendererId: renderer,
      type: 'renderer',
    };
  }

  throw new Error(
    `Could not find the framework (${frameworkPackage}) or renderer (${rendererPackage}) package`
  );
};

const stripVersions = (addons: string[]) => addons.map((addon) => getPackageDetails(addon)[0]);

const hasInteractiveStories = (rendererId: SupportedRenderers) =>
  ['react', 'angular', 'preact', 'svelte', 'vue', 'vue3', 'html'].includes(rendererId);

const hasFrameworkTemplates = (framework?: SupportedFrameworks) =>
  ['angular', 'nextjs', 'sveltekit'].includes(framework);

export async function baseGenerator(
  packageManager: JsPackageManager,
  npmOptions: NpmOptions,
  { language, builder = CoreBuilder.Webpack5, pnp, commonJs }: GeneratorOptions,
  renderer: SupportedRenderers,
  options: FrameworkOptions = defaultOptions,
  framework?: SupportedFrameworks
) {
  const {
    extraAddons: extraAddonPackages,
    extraPackages,
    staticDir,
    addScripts,
    addComponents,
    addBabel,
    addESLint,
    extraMain,
    extensions,
  } = {
    ...defaultOptions,
    ...options,
  };

  const {
    packages: frameworkPackages,
    type,
    rendererId,
    framework: frameworkInclude,
    builder: builderInclude,
  } = getFrameworkDetails(renderer, builder, pnp, framework);

  // added to main.js
  const addons = [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    ...stripVersions(extraAddonPackages),
  ];
  // added to package.json
  const addonPackages = [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/blocks',
    ...extraAddonPackages,
  ];

  if (hasInteractiveStories(rendererId)) {
    addons.push('@storybook/addon-interactions');
    addonPackages.push('@storybook/addon-interactions', '@storybook/testing-library');
  }

  const files = await fse.readdir(process.cwd());

  const packageJson = packageManager.retrievePackageJson();
  const installedDependencies = new Set(
    Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies })
  );

  if (!installedDependencies.has('react')) {
    // we add these here because they are required by addon-essentials > addon-docs
    addonPackages.push('react');
  }
  if (!installedDependencies.has('react-dom')) {
    // we add these here because they are required by addon-essentials > addon-docs
    addonPackages.push('react-dom');
  }

  // TODO: We need to start supporting this at some point
  if (type === 'renderer') {
    throw new Error(
      dedent`
        Sorry, for now, you can not do this, please use a framework such as @storybook/react-webpack5

        https://github.com/storybookjs/storybook/issues/18360
      `
    );
  }

  const packages = [
    'storybook',
    `@storybook/${rendererId}`,
    ...frameworkPackages,
    ...addonPackages,
    ...extraPackages,
  ]
    .filter(Boolean)
    .filter(
      (packageToInstall) => !installedDependencies.has(getPackageDetails(packageToInstall)[0])
    );

  const versionedPackages = await packageManager.getVersionedPackages(packages);

  await fse.ensureDir('./.storybook');

  await configureMain({
    framework: { name: frameworkInclude, options: options.framework || {} },
    docs: { docsPage: true },
    addons: pnp ? addons.map(wrapForPnp) : addons,
    extensions,
    commonJs,
    ...(staticDir ? { staticDirs: [path.join('..', staticDir)] } : null),
    ...extraMain,
    ...(type !== 'framework'
      ? {
          core: {
            builder: builderInclude,
          },
        }
      : {}),
  });

  await configurePreview(rendererId);

  // FIXME: temporary workaround for https://github.com/storybookjs/storybook/issues/17516
  if (
    frameworkPackages.find(
      (pkg) => pkg.match(/^@storybook\/.*-vite$/) || pkg === '@storybook/sveltekit'
    )
  ) {
    const previewHead = dedent`
      <script>
        window.global = window;
      </script>
    `;
    await fse.writeFile(`.storybook/preview-head.html`, previewHead, { encoding: 'utf8' });
  }

  const babelDependencies =
    addBabel && builder !== CoreBuilder.Vite
      ? await getBabelDependencies(packageManager, packageJson)
      : [];
  const isNewFolder = !files.some(
    (fname) => fname.startsWith('.babel') || fname.startsWith('babel') || fname === 'package.json'
  );
  if (isNewFolder) {
    await generateStorybookBabelConfigInCWD();
  }
  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    ...versionedPackages,
    ...babelDependencies,
  ]);

  if (addScripts) {
    packageManager.addStorybookCommandInScripts({
      port: 6006,
    });
  }

  if (addESLint) {
    packageManager.addESLintConfig();
  }

  if (addComponents) {
    const templateLocation = hasFrameworkTemplates(framework) ? framework : rendererId;
    await copyComponents(templateLocation, language);
  }
}
