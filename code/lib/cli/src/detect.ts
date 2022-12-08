import path from 'path';
import fs from 'fs';
import findUp from 'find-up';
import semver from 'semver';

import type { TemplateConfiguration, TemplateMatcher } from './project_types';
import {
  ProjectType,
  supportedTemplates,
  SUPPORTED_RENDERERS,
  SupportedLanguage,
  unsupportedTemplate,
  CoreBuilder,
} from './project_types';
import { getBowerJson, paddedLog } from './helpers';
import type { JsPackageManager, PackageJson, PackageJsonWithMaybeDeps } from './js-package-manager';
import { detectNextJS } from './detect-nextjs';

const viteConfigFiles = ['vite.config.ts', 'vite.config.js', 'vite.config.mjs'];

const hasDependency = (
  packageJson: PackageJsonWithMaybeDeps,
  name: string,
  matcher?: (version: string) => boolean
) => {
  const version = packageJson.dependencies?.[name] || packageJson.devDependencies?.[name];
  if (version && typeof matcher === 'function') {
    return matcher(version);
  }
  return !!version;
};

const hasPeerDependency = (
  packageJson: PackageJsonWithMaybeDeps,
  name: string,
  matcher?: (version: string) => boolean
) => {
  const version = packageJson.peerDependencies?.[name];
  if (version && typeof matcher === 'function') {
    return matcher(version);
  }
  return !!version;
};

type SearchTuple = [string, (version: string) => boolean | undefined];

const getFrameworkPreset = (
  packageJson: PackageJsonWithMaybeDeps,
  framework: TemplateConfiguration
): ProjectType | null => {
  const matcher: TemplateMatcher = {
    dependencies: [false],
    peerDependencies: [false],
    files: [false],
  };

  const { preset, files, dependencies, peerDependencies, matcherFunction } = framework;

  let dependencySearches = [] as SearchTuple[];
  if (Array.isArray(dependencies)) {
    dependencySearches = dependencies.map((name) => [name, undefined]);
  } else if (typeof dependencies === 'object') {
    dependencySearches = Object.entries(dependencies);
  }

  // Must check the length so the `[false]` isn't overwritten if `{ dependencies: [] }`
  if (dependencySearches.length > 0) {
    matcher.dependencies = dependencySearches.map(([name, matchFn]) =>
      hasDependency(packageJson, name, matchFn)
    );
  }

  let peerDependencySearches = [] as SearchTuple[];
  if (Array.isArray(peerDependencies)) {
    peerDependencySearches = peerDependencies.map((name) => [name, undefined]);
  } else if (typeof peerDependencies === 'object') {
    peerDependencySearches = Object.entries(peerDependencies);
  }

  // Must check the length so the `[false]` isn't overwritten if `{ peerDependencies: [] }`
  if (peerDependencySearches.length > 0) {
    matcher.peerDependencies = peerDependencySearches.map(([name, matchFn]) =>
      hasPeerDependency(packageJson, name, matchFn)
    );
  }

  if (Array.isArray(files) && files.length > 0) {
    matcher.files = files.map((name) => fs.existsSync(path.join(process.cwd(), name)));
  }

  return matcherFunction(matcher) ? preset : null;
};

export function detectFrameworkPreset(
  packageJson = {} as PackageJsonWithMaybeDeps
): ProjectType | null {
  const result = [...supportedTemplates, unsupportedTemplate].find((framework) => {
    return getFrameworkPreset(packageJson, framework) !== null;
  });

  return result ? result.preset : ProjectType.UNDETECTED;
}

/**
 * Attempts to detect which builder to use, by searching for a vite config file.  If one is found, the vite builder
 * will be used, otherwise, webpack5 is the default.
 *
 * @returns CoreBuilder
 */
export function detectBuilder(packageManager: JsPackageManager) {
  const viteConfig = findUp.sync(viteConfigFiles);

  if (viteConfig) {
    paddedLog('Detected vite project, setting builder to @storybook/builder-vite');
    return CoreBuilder.Vite;
  }

  const nextJSVersion = detectNextJS(packageManager);
  if (nextJSVersion) {
    if (nextJSVersion >= 11) {
      return CoreBuilder.Webpack5;
    }
  }

  // Fallback to webpack5
  return CoreBuilder.Webpack5;
}

export function isStorybookInstalled(
  dependencies: Pick<PackageJson, 'devDependencies'> | false,
  force?: boolean
) {
  if (!dependencies) {
    return false;
  }

  if (!force && dependencies.devDependencies) {
    if (
      SUPPORTED_RENDERERS.reduce(
        (storybookPresent, framework) =>
          storybookPresent || !!dependencies.devDependencies[`@storybook/${framework}`],
        false
      )
    ) {
      return ProjectType.ALREADY_HAS_STORYBOOK;
    }
  }
  return false;
}

export function detectLanguage(packageJson?: PackageJson) {
  let language = SupportedLanguage.JAVASCRIPT;

  if (!packageJson) {
    return language;
  }

  if (
    hasDependency(packageJson, 'typescript', (version) =>
      semver.gte(semver.coerce(version), '4.9.0')
    ) &&
    (!hasDependency(packageJson, 'prettier') ||
      hasDependency(packageJson, 'prettier', (version) =>
        semver.gte(semver.coerce(version), '2.8.0')
      )) &&
    (!hasDependency(packageJson, '@babel/plugin-transform-typescript') ||
      hasDependency(packageJson, '@babel/plugin-transform-typescript', (version) =>
        semver.gte(semver.coerce(version), '7.20.0')
      )) &&
    (!hasDependency(packageJson, '@typescript-eslint/parser') ||
      hasDependency(packageJson, '@typescript-eslint/parser', (version) =>
        semver.gte(semver.coerce(version), '5.44.0')
      ))
  ) {
    // TODO: switch to TYPESCRIPT once csf-tools and eslint-plugin-storybook support `satisfies` operator
    language = SupportedLanguage.TYPESCRIPT_LEGACY;
  } else if (hasDependency(packageJson, 'typescript')) {
    language = SupportedLanguage.TYPESCRIPT_LEGACY;
  }

  return language;
}

export function detect(
  packageJson: PackageJson,
  options: { force?: boolean; html?: boolean } = {}
) {
  const bowerJson = getBowerJson();

  if (!packageJson && !bowerJson) {
    return ProjectType.UNDETECTED;
  }

  const storyBookInstalled = isStorybookInstalled(packageJson, options.force);
  if (storyBookInstalled) {
    return storyBookInstalled;
  }

  if (options.html) {
    return ProjectType.HTML;
  }

  return detectFrameworkPreset(packageJson || bowerJson);
}
