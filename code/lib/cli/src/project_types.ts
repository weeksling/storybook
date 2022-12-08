import { minVersion, validRange } from 'semver';

function ltMajor(versionRange: string, major: number) {
  // Uses validRange to avoid a throw from minVersion if an invalid range gets passed
  return validRange(versionRange) && minVersion(versionRange).major < major;
}

function gtMajor(versionRange: string, major: number) {
  // Uses validRange to avoid a throw from minVersion if an invalid range gets passed
  return validRange(versionRange) && minVersion(versionRange).major > major;
}

function eqMajor(versionRange: string, major: number) {
  // Uses validRange to avoid a throw from minVersion if an invalid range gets passed
  return validRange(versionRange) && minVersion(versionRange).major === major;
}

// Should match @storybook/<framework>
export type SupportedFrameworks = 'nextjs' | 'angular' | 'sveltekit';

// Should match @storybook/<renderer>
export type SupportedRenderers =
  | 'react'
  | 'react-native'
  | 'vue'
  | 'vue3'
  | 'angular'
  | 'mithril'
  | 'riot'
  | 'ember'
  | 'marionette'
  | 'marko'
  | 'preact'
  | 'svelte'
  | 'rax'
  | 'aurelia'
  | 'html'
  | 'web-components'
  | 'server';

export const SUPPORTED_RENDERERS: SupportedRenderers[] = [
  'react',
  'react-native',
  'vue',
  'vue3',
  'angular',
  'mithril',
  'riot',
  'ember',
  'marionette',
  'marko',
  'preact',
  'svelte',
  'rax',
  'aurelia',
];

export enum ProjectType {
  UNDETECTED = 'UNDETECTED',
  UNSUPPORTED = 'UNSUPPORTED',
  REACT_SCRIPTS = 'REACT_SCRIPTS',
  REACT = 'REACT',
  REACT_NATIVE = 'REACT_NATIVE',
  REACT_PROJECT = 'REACT_PROJECT',
  WEBPACK_REACT = 'WEBPACK_REACT',
  NEXTJS = 'NEXTJS',
  VUE = 'VUE',
  VUE3 = 'VUE3',
  SFC_VUE = 'SFC_VUE',
  ANGULAR = 'ANGULAR',
  EMBER = 'EMBER',
  ALREADY_HAS_STORYBOOK = 'ALREADY_HAS_STORYBOOK',
  WEB_COMPONENTS = 'WEB_COMPONENTS',
  MITHRIL = 'MITHRIL',
  MARIONETTE = 'MARIONETTE',
  MARKO = 'MARKO',
  HTML = 'HTML',
  RIOT = 'RIOT',
  PREACT = 'PREACT',
  SVELTE = 'SVELTE',
  SVELTEKIT = 'SVELTEKIT',
  RAX = 'RAX',
  AURELIA = 'AURELIA',
  SERVER = 'SERVER',
}

export enum CoreBuilder {
  Webpack5 = 'webpack5',
  Vite = 'vite',
}

// The `& {}` bit allows for auto-complete, see: https://github.com/microsoft/TypeScript/issues/29729
export type Builder = CoreBuilder | (string & {});

export enum SupportedLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT_LEGACY = 'typescript-legacy',
  TYPESCRIPT = 'typescript',
}

export type TemplateMatcher = {
  files?: boolean[];
  dependencies?: boolean[];
  peerDependencies?: boolean[];
};

export type TemplateConfiguration = {
  preset: ProjectType;
  /** will be checked both against dependencies and devDependencies */
  dependencies?: string[] | { [dependency: string]: (version: string) => boolean };
  peerDependencies?: string[] | { [dependency: string]: (version: string) => boolean };
  files?: string[];
  matcherFunction: (matcher: TemplateMatcher) => boolean;
};

/**
 * Configuration to match a storybook preset template.
 *
 * This has to be an array sorted in order of specificity/priority.
 * Reason: both REACT and WEBPACK_REACT have react as dependency,
 * therefore WEBPACK_REACT has to come first, as it's more specific.
 */
export const supportedTemplates: TemplateConfiguration[] = [
  {
    preset: ProjectType.SFC_VUE,
    dependencies: {
      'vue-loader': (versionRange) => ltMajor(versionRange, 16),
      vuetify: (versionRange) => ltMajor(versionRange, 3),
    },
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.VUE,
    // This Vue template only works with Vue or Nuxt under v3
    dependencies: {
      vue: (versionRange) => ltMajor(versionRange, 3),
      nuxt: (versionRange) => ltMajor(versionRange, 3),
    },
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.VUE3,
    dependencies: {
      // This Vue template works with Vue 3
      vue: (versionRange) => versionRange === 'next' || eqMajor(versionRange, 3),
    },
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.EMBER,
    dependencies: ['ember-cli'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.NEXTJS,
    dependencies: {
      next: (versionRange) => eqMajor(versionRange, 9) || gtMajor(versionRange, 9),
    },
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.REACT_PROJECT,
    peerDependencies: ['react'],
    matcherFunction: ({ peerDependencies }) => {
      return peerDependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.REACT_NATIVE,
    dependencies: ['react-native', 'react-native-scripts'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.REACT_SCRIPTS,
    // For projects using a custom/forked `react-scripts` package.
    files: ['/node_modules/.bin/react-scripts'],
    // For standard CRA projects
    dependencies: ['react-scripts'],
    matcherFunction: ({ dependencies, files }) => {
      return dependencies.every(Boolean) || files.every(Boolean);
    },
  },
  {
    preset: ProjectType.WEBPACK_REACT,
    dependencies: ['react', 'webpack'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.REACT,
    dependencies: ['react'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.ANGULAR,
    dependencies: ['@angular/core'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.WEB_COMPONENTS,
    dependencies: ['lit-element', 'lit-html', 'lit'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.some(Boolean);
    },
  },
  {
    preset: ProjectType.MITHRIL,
    dependencies: ['mithril'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.MARIONETTE,
    dependencies: ['backbone.marionette'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.MARKO,
    dependencies: ['marko'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.RIOT,
    dependencies: ['riot'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.PREACT,
    dependencies: ['preact'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    // TODO: This only works because it is before the SVELTE template. could be more explicit
    preset: ProjectType.SVELTEKIT,
    dependencies: ['@sveltejs/kit'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.SVELTE,
    dependencies: ['svelte'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.RAX,
    dependencies: ['rax'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
  {
    preset: ProjectType.AURELIA,
    dependencies: ['aurelia-bootstrapper'],
    matcherFunction: ({ dependencies }) => {
      return dependencies.every(Boolean);
    },
  },
];

// A TemplateConfiguration that matches unsupported frameworks
// Framework matchers can be added to this object to give
// users an "Unsupported framework" message
export const unsupportedTemplate: TemplateConfiguration = {
  preset: ProjectType.UNSUPPORTED,
  dependencies: {
    // TODO(blaine): Remove when we support Nuxt 3
    nuxt: (versionRange) => eqMajor(versionRange, 3),
  },
  matcherFunction: ({ dependencies }) => {
    return dependencies.some(Boolean);
  },
};

const notInstallableProjectTypes: ProjectType[] = [
  ProjectType.UNDETECTED,
  ProjectType.UNSUPPORTED,
  ProjectType.ALREADY_HAS_STORYBOOK,
];

export const installableProjectTypes = Object.values(ProjectType)
  .filter((type) => !notInstallableProjectTypes.includes(type))
  .map((type) => type.toLowerCase());
