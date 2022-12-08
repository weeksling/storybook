<h1>Migration</h1>

- [From version 6.5.x to 7.0.0](#from-version-65x-to-700)
  - [Alpha release notes](#alpha-release-notes)
  - [7.0 breaking changes](#70-breaking-changes)
    - [React peer dependencies required](#react-peer-dependencies-required)
    - [Postcss removed](#postcss-removed)
    - [Vue3 replaced app export with setup](#vue3-replaced-app-export-with-setup)
    - [removed auto injection of @storybook/addon-actions decorator](#removed-auto-injection-of-storybookaddon-actions-decorator)
    - [register.js removed](#registerjs-removed)
    - [Change of root html IDs](#change-of-root-html-ids)
    - [No more default export from `@storybook/addons`](#no-more-default-export-from-storybookaddons)
    - [Modern browser support](#modern-browser-support)
    - [No more configuration for manager](#no-more-configuration-for-manager)
    - [start-storybook / build-storybook binaries removed](#start-storybook--build-storybook-binaries-removed)
    - [storyStoreV7 enabled by default](#storystorev7-enabled-by-default)
    - [Webpack4 support discontinued](#webpack4-support-discontinued)
    - [Framework field mandatory](#framework-field-mandatory)
    - [frameworkOptions renamed](#frameworkoptions-renamed)
    - [Framework standalone build moved](#framework-standalone-build-moved)
    - [Docs modern inline rendering by default](#docs-modern-inline-rendering-by-default)
    - [Babel mode v7 exclusively](#babel-mode-v7-exclusively)
    - [7.0 feature flags removed](#70-feature-flags-removed)
    - [CLI option `--use-npm` deprecated](#cli-option---use-npm-deprecated)
    - [Vite builder uses vite config automatically](#vite-builder-uses-vite-config-automatically)
    - [Vite cache moved to node\_modules/.cache/.vite-storybook](#vite-cache-moved-to-node_modulescachevite-storybook)
    - [SvelteKit needs the `@storybook/sveltekit` framework](#sveltekit-needs-the-storybooksveltekit-framework)
    - [Removed docs.getContainer and getPage parameters](#removed-docsgetcontainer-and-getpage-parameters)
    - [Removed STORYBOOK\_REACT\_CLASSES global](#removed-storybook_react_classes-global)
    - [Icons API changed](#icons-api-changed)
    - ['config' preset entry replaced with 'previewAnnotations'](#config-preset-entry-replaced-with-previewannotations)
    - [Dropped support for Angular 12 and below](#dropped-support-for-angular-12-and-below)
    - [Addon-backgrounds: Removed deprecated grid parameter](#addon-backgrounds-removed-deprecated-grid-parameter)
    - [Addon-docs: Removed deprecated blocks.js entry](#addon-docs-removed-deprecated-blocksjs-entry)
    - [Addon-a11y: Removed deprecated withA11y decorator](#addon-a11y-removed-deprecated-witha11y-decorator)
    - [Stories glob matches MDX files](#stories-glob-matches-mdx-files)
  - [Docs Changes](#docs-changes)
    - [Standalone docs files](#standalone-docs-files)
    - [Referencing stories in docs files](#referencing-stories-in-docs-files)
    - [Docs Page](#docs-page)
    - [Configuring the Docs Container](#configuring-the-docs-container)
    - [External Docs](#external-docs)
    - [MDX2 upgrade](#mdx2-upgrade)
    - [Default docs styles will leak into non-story user components](#default-docs-styles-will-leak-into-non-story-user-components)
    - [Explicit `<code>` elements are no longer syntax highlighted](#explicit-code-elements-are-no-longer-syntax-highlighted)
    - [Dropped source loader / storiesOf static snippets](#dropped-source-loader--storiesof-static-snippets)
    - [Dropped addon-docs manual configuration](#dropped-addon-docs-manual-configuration)
    - [Autoplay in docs](#autoplay-in-docs)
  - [7.0 Deprecations](#70-deprecations)
    - [`Story` type deprecated](#story-type-deprecated)
    - [`ComponentStory`, `ComponentStoryObj`, `ComponentStoryFn` and `ComponentMeta` types are deprecated](#componentstory-componentstoryobj-componentstoryfn-and-componentmeta-types-are-deprecated)
    - [Renamed `renderToDOM` to `renderToCanvas`](#renamed-rendertodom-to-rendertocanvas)
    - [Renamed `XFramework` to `XRenderer`](#renamed-xframework-to-xrenderer)
    - [Renamed `DecoratorFn` to `Decorator`](#renamed-decoratorfn-to-decorator)
- [From version 6.4.x to 6.5.0](#from-version-64x-to-650)
  - [Vue 3 upgrade](#vue-3-upgrade)
  - [React18 new root API](#react18-new-root-api)
  - [Renamed isToolshown to showToolbar](#renamed-istoolshown-to-showtoolbar)
  - [Dropped support for addon-actions addDecorators](#dropped-support-for-addon-actions-adddecorators)
  - [Vite builder renamed](#vite-builder-renamed)
  - [Docs framework refactor for React](#docs-framework-refactor-for-react)
  - [Opt-in MDX2 support](#opt-in-mdx2-support)
  - [CSF3 auto-title improvements](#csf3-auto-title-improvements)
    - [Auto-title filename case](#auto-title-filename-case)
    - [Auto-title redundant filename](#auto-title-redundant-filename)
    - [Auto-title always prefixes](#auto-title-always-prefixes)
  - [6.5 Deprecations](#65-deprecations)
    - [Deprecated register.js](#deprecated-registerjs)
- [From version 6.3.x to 6.4.0](#from-version-63x-to-640)
  - [Automigrate](#automigrate)
  - [CRA5 upgrade](#cra5-upgrade)
  - [CSF3 enabled](#csf3-enabled)
    - [Optional titles](#optional-titles)
    - [String literal titles](#string-literal-titles)
    - [StoryObj type](#storyobj-type)
  - [Story Store v7](#story-store-v7)
    - [Behavioral differences](#behavioral-differences)
    - [Main.js framework field](#mainjs-framework-field)
    - [Using the v7 store](#using-the-v7-store)
    - [v7-style story sort](#v7-style-story-sort)
    - [v7 Store API changes for addon authors](#v7-store-api-changes-for-addon-authors)
    - [Storyshots compatibility in the v7 store](#storyshots-compatibility-in-the-v7-store)
  - [Emotion11 quasi-compatibility](#emotion11-quasi-compatibility)
  - [Babel mode v7](#babel-mode-v7)
  - [Loader behavior with args changes](#loader-behavior-with-args-changes)
  - [6.4 Angular changes](#64-angular-changes)
    - [SB Angular builder](#sb-angular-builder)
    - [Angular13](#angular13)
    - [Angular component parameter removed](#angular-component-parameter-removed)
  - [6.4 deprecations](#64-deprecations)
    - [Deprecated --static-dir CLI flag](#deprecated---static-dir-cli-flag)
- [From version 6.2.x to 6.3.0](#from-version-62x-to-630)
  - [Webpack 5](#webpack-5)
    - [Fixing hoisting issues](#fixing-hoisting-issues)
      - [Webpack 5 manager build](#webpack-5-manager-build)
      - [Wrong webpack version](#wrong-webpack-version)
  - [Angular 12 upgrade](#angular-12-upgrade)
  - [Lit support](#lit-support)
  - [No longer inferring default values of args](#no-longer-inferring-default-values-of-args)
  - [6.3 deprecations](#63-deprecations)
    - [Deprecated addon-knobs](#deprecated-addon-knobs)
    - [Deprecated scoped blocks imports](#deprecated-scoped-blocks-imports)
    - [Deprecated layout URL params](#deprecated-layout-url-params)
- [From version 6.1.x to 6.2.0](#from-version-61x-to-620)
  - [MDX pattern tweaked](#mdx-pattern-tweaked)
  - [6.2 Angular overhaul](#62-angular-overhaul)
    - [New Angular storyshots format](#new-angular-storyshots-format)
    - [Deprecated Angular story component](#deprecated-angular-story-component)
    - [New Angular renderer](#new-angular-renderer)
    - [Components without selectors](#components-without-selectors)
  - [Packages now available as ESModules](#packages-now-available-as-esmodules)
  - [6.2 Deprecations](#62-deprecations)
    - [Deprecated implicit PostCSS loader](#deprecated-implicit-postcss-loader)
    - [Deprecated default PostCSS plugins](#deprecated-default-postcss-plugins)
    - [Deprecated showRoots config option](#deprecated-showroots-config-option)
    - [Deprecated control.options](#deprecated-controloptions)
    - [Deprecated storybook components html entry point](#deprecated-storybook-components-html-entry-point)
- [From version 6.0.x to 6.1.0](#from-version-60x-to-610)
  - [Addon-backgrounds preset](#addon-backgrounds-preset)
  - [Single story hoisting](#single-story-hoisting)
  - [React peer dependencies](#react-peer-dependencies)
  - [6.1 deprecations](#61-deprecations)
    - [Deprecated DLL flags](#deprecated-dll-flags)
    - [Deprecated storyFn](#deprecated-storyfn)
    - [Deprecated onBeforeRender](#deprecated-onbeforerender)
    - [Deprecated grid parameter](#deprecated-grid-parameter)
    - [Deprecated package-composition disabled parameter](#deprecated-package-composition-disabled-parameter)
- [From version 5.3.x to 6.0.x](#from-version-53x-to-60x)
  - [Hoisted CSF annotations](#hoisted-csf-annotations)
  - [Zero config typescript](#zero-config-typescript)
  - [Correct globs in main.js](#correct-globs-in-mainjs)
  - [CRA preset removed](#cra-preset-removed)
  - [Core-JS dependency errors](#core-js-dependency-errors)
  - [Args passed as first argument to story](#args-passed-as-first-argument-to-story)
  - [6.0 Docs breaking changes](#60-docs-breaking-changes)
    - [Remove framework-specific docs presets](#remove-framework-specific-docs-presets)
    - [Preview/Props renamed](#previewprops-renamed)
    - [Docs theme separated](#docs-theme-separated)
    - [DocsPage slots removed](#docspage-slots-removed)
    - [React prop tables with Typescript](#react-prop-tables-with-typescript)
    - [ConfigureJSX true by default in React](#configurejsx-true-by-default-in-react)
    - [User babelrc disabled by default in MDX](#user-babelrc-disabled-by-default-in-mdx)
    - [Docs description parameter](#docs-description-parameter)
    - [6.0 Inline stories](#60-inline-stories)
  - [New addon presets](#new-addon-presets)
  - [Removed babel-preset-vue from Vue preset](#removed-babel-preset-vue-from-vue-preset)
  - [Removed Deprecated APIs](#removed-deprecated-apis)
  - [New setStories event](#new-setstories-event)
  - [Removed renderCurrentStory event](#removed-rendercurrentstory-event)
  - [Removed hierarchy separators](#removed-hierarchy-separators)
  - [No longer pass denormalized parameters to storySort](#no-longer-pass-denormalized-parameters-to-storysort)
  - [Client API changes](#client-api-changes)
    - [Removed Legacy Story APIs](#removed-legacy-story-apis)
    - [Can no longer add decorators/parameters after stories](#can-no-longer-add-decoratorsparameters-after-stories)
    - [Changed Parameter Handling](#changed-parameter-handling)
  - [Simplified Render Context](#simplified-render-context)
  - [Story Store immutable outside of configuration](#story-store-immutable-outside-of-configuration)
  - [Improved story source handling](#improved-story-source-handling)
  - [6.0 Addon API changes](#60-addon-api-changes)
    - [Consistent local addon paths in main.js](#consistent-local-addon-paths-in-mainjs)
    - [Deprecated setAddon](#deprecated-setaddon)
    - [Deprecated disabled parameter](#deprecated-disabled-parameter)
    - [Actions addon uses parameters](#actions-addon-uses-parameters)
    - [Removed action decorator APIs](#removed-action-decorator-apis)
    - [Removed withA11y decorator](#removed-witha11y-decorator)
    - [Essentials addon disables differently](#essentials-addon-disables-differently)
    - [Backgrounds addon has a new api](#backgrounds-addon-has-a-new-api)
  - [6.0 Deprecations](#60-deprecations)
    - [Deprecated addon-info, addon-notes](#deprecated-addon-info-addon-notes)
    - [Deprecated addon-contexts](#deprecated-addon-contexts)
    - [Removed addon-centered](#removed-addon-centered)
    - [Deprecated polymer](#deprecated-polymer)
    - [Deprecated immutable options parameters](#deprecated-immutable-options-parameters)
    - [Deprecated addParameters and addDecorator](#deprecated-addparameters-and-adddecorator)
    - [Deprecated clearDecorators](#deprecated-cleardecorators)
    - [Deprecated configure](#deprecated-configure)
    - [Deprecated support for duplicate kinds](#deprecated-support-for-duplicate-kinds)
- [From version 5.2.x to 5.3.x](#from-version-52x-to-53x)
  - [To main.js configuration](#to-mainjs-configuration)
    - [Using main.js](#using-mainjs)
    - [Using preview.js](#using-previewjs)
    - [Using manager.js](#using-managerjs)
  - [Create React App preset](#create-react-app-preset)
  - [Description doc block](#description-doc-block)
  - [React Native Async Storage](#react-native-async-storage)
  - [Deprecate displayName parameter](#deprecate-displayname-parameter)
  - [Unified docs preset](#unified-docs-preset)
  - [Simplified hierarchy separators](#simplified-hierarchy-separators)
  - [Addon StoryShots Puppeteer uses external puppeteer](#addon-storyshots-puppeteer-uses-external-puppeteer)
- [From version 5.1.x to 5.2.x](#from-version-51x-to-52x)
  - [Source-loader](#source-loader)
  - [Default viewports](#default-viewports)
  - [Grid toolbar-feature](#grid-toolbar-feature)
  - [Docs mode docgen](#docs-mode-docgen)
  - [storySort option](#storysort-option)
- [From version 5.1.x to 5.1.10](#from-version-51x-to-5110)
  - [babel.config.js support](#babelconfigjs-support)
- [From version 5.0.x to 5.1.x](#from-version-50x-to-51x)
  - [React native server](#react-native-server)
  - [Angular 7](#angular-7)
  - [CoreJS 3](#corejs-3)
- [From version 5.0.1 to 5.0.2](#from-version-501-to-502)
  - [Deprecate webpack extend mode](#deprecate-webpack-extend-mode)
- [From version 4.1.x to 5.0.x](#from-version-41x-to-50x)
  - [sortStoriesByKind](#sortstoriesbykind)
  - [Webpack config simplification](#webpack-config-simplification)
  - [Theming overhaul](#theming-overhaul)
  - [Story hierarchy defaults](#story-hierarchy-defaults)
  - [Options addon deprecated](#options-addon-deprecated)
  - [Individual story decorators](#individual-story-decorators)
  - [Addon backgrounds uses parameters](#addon-backgrounds-uses-parameters)
  - [Addon cssresources name attribute renamed](#addon-cssresources-name-attribute-renamed)
  - [Addon viewport uses parameters](#addon-viewport-uses-parameters)
  - [Addon a11y uses parameters, decorator renamed](#addon-a11y-uses-parameters-decorator-renamed)
  - [Addon centered decorator deprecated](#addon-centered-decorator-deprecated)
  - [New keyboard shortcuts defaults](#new-keyboard-shortcuts-defaults)
  - [New URL structure](#new-url-structure)
  - [Rename of the `--secure` cli parameter to `--https`](#rename-of-the---secure-cli-parameter-to---https)
  - [Vue integration](#vue-integration)
- [From version 4.0.x to 4.1.x](#from-version-40x-to-41x)
  - [Private addon config](#private-addon-config)
  - [React 15.x](#react-15x)
- [From version 3.4.x to 4.0.x](#from-version-34x-to-40x)
  - [React 16.3+](#react-163)
  - [Generic addons](#generic-addons)
  - [Knobs select ordering](#knobs-select-ordering)
  - [Knobs URL parameters](#knobs-url-parameters)
  - [Keyboard shortcuts moved](#keyboard-shortcuts-moved)
  - [Removed addWithInfo](#removed-addwithinfo)
  - [Removed RN packager](#removed-rn-packager)
  - [Removed RN addons](#removed-rn-addons)
  - [Storyshots Changes](#storyshots-changes)
  - [Webpack 4](#webpack-4)
  - [Babel 7](#babel-7)
  - [Create-react-app](#create-react-app)
    - [Upgrade CRA1 to babel 7](#upgrade-cra1-to-babel-7)
    - [Migrate CRA1 while keeping babel 6](#migrate-cra1-while-keeping-babel-6)
  - [start-storybook opens browser](#start-storybook-opens-browser)
  - [CLI Rename](#cli-rename)
  - [Addon story parameters](#addon-story-parameters)
- [From version 3.3.x to 3.4.x](#from-version-33x-to-34x)
- [From version 3.2.x to 3.3.x](#from-version-32x-to-33x)
  - [`babel-core` is now a peer dependency #2494](#babel-core-is-now-a-peer-dependency-2494)
  - [Base webpack config now contains vital plugins #1775](#base-webpack-config-now-contains-vital-plugins-1775)
  - [Refactored Knobs](#refactored-knobs)
- [From version 3.1.x to 3.2.x](#from-version-31x-to-32x)
  - [Moved TypeScript addons definitions](#moved-typescript-addons-definitions)
  - [Updated Addons API](#updated-addons-api)
- [From version 3.0.x to 3.1.x](#from-version-30x-to-31x)
  - [Moved TypeScript definitions](#moved-typescript-definitions)
  - [Deprecated head.html](#deprecated-headhtml)
- [From version 2.x.x to 3.x.x](#from-version-2xx-to-3xx)
  - [Webpack upgrade](#webpack-upgrade)
  - [Packages renaming](#packages-renaming)
  - [Deprecated embedded addons](#deprecated-embedded-addons)

## From version 6.5.x to 7.0.0

### Alpha release notes

Storybook 7.0 is in early alpha. During the alpha, we are making a large number of breaking changes. We may also break the breaking changes based on what we learn during the development cycle. When 7.0 goes to beta, we will start stabilizing and adding various auto-migrations to help users upgrade more easily.

In the meantime, these migration notes are the best available documentation on things you should know upgrading to 7.0.

### 7.0 breaking changes

#### React peer dependencies required

Starting in 7.0, `react` and `react-dom` are now required peer dependencies of Storybook.

Storybook uses `react` in a variety of packages. In the past, we've done various trickery hide this from non-React users. However, with stricter peer dependency handling by `npm8`, `npm`, and `yarn pnp` those tricks have started to cause problems for those users. Rather than resorting to even more complicated tricks, we are making `react` and `react-dom` required peer dependencies.

To upgrade manually, add any version of `react` and `react-dom` as devDependencies using your package manager of choice, e.g.

```
npm add react react-dom --dev
```
#### Postcss removed

Storybook 6.x installed postcss by default. In 7.0 built-in support has been removed. IF you need it, you can add it back using [`@storybook/addon-postcss`](https://github.com/storybookjs/addon-postcss).

#### Vue3 replaced app export with setup

In 6.x `@storybook/vue3` exported a Vue application instance called `app`. In 7.0, this has been replaced by a `setup` function that can be used to initialize the application in your `.storybook/preview.js`:

Before:

```js
import { app } from '@storybook/vue3';
import Button from './Button.vue';

app.component('GlobalButton', Button);
```

After:

```js
import { setup } from '@storybook/vue3';
import Button from './Button.vue';

setup((app) => {
  app.component('GlobalButton', Button);
});
```

#### removed auto injection of @storybook/addon-actions decorator

The `withActions` decorator is no longer automatically added to stories. This is because it is really only used in the html renderer, for all other renderers it's redundant.
If you are using the html renderer and use the `handles` parameter, you'll need to manually add the `withActions` decorator:

```diff
import globalThis from 'global';
+import { withActions } from '@storybook/addon-actions/decorator';

export default {
  component: globalThis.Components.Button,
  args: {
    label: 'Click Me!',
  },
  parameters: {
    chromatic: { disable: true },
  },
};
export const Basic = {
  parameters: {
    handles: [{ click: 'clicked', contextmenu: 'right clicked' }],
  },
+  decorators: [withActions],
};
```

#### register.js removed

In SB 6.x and earlier, addons exported a `register.js` entry point by convention, and users would import this in `.storybook/manager.js`. This was [deprecated in SB 6.5](#deprecated-registerjs)

In 7.0, most of Storybook's addons now export a `manager.js` entry point, which is automatically registered in Storybook's manager when the addon is listed in `.storybook/main.js`'s `addons` field.

If your `.manager.js` config references `register.js` of any of the following addons, you can remove it: `a11y`, `actions`, `backgrounds`, `controls`, `interactions`, `jest`, `links`, `measure`, `outline`, `toolbars`, `viewport`.

#### Change of root html IDs

The root ID unto which storybook renders stories is renamed from `root` to `#storybook-root` to avoid conflicts with user's code.

#### No more default export from `@storybook/addons`

The default export from `@storybook/addons` has been removed. Please use the named exports instead:

```js
import { addons } from '@storybook/addons';
```

The named export has been available since 6.0 or earlier, so your updated code will be backwards-compatible with older versions of Storybook.

#### Modern browser support

Starting in storybook 7.0, storybook will no longer support IE11, amongst other legacy browser versions.
We now transpile our code with a target of `chrome >= 100` and node code is transpiled with a target of `node >= 14`.

This means code-features such as (but not limited to) `async/await`, arrow-functions, `const`,`let`, etc will exists in the code at runtime, and thus the runtime environment must support it.
Not just the runtime needs to support it, but some legacy loaders for webpack or other transpilation tools might need to be updated as well. For example certain versions of webpack 4 had parsers that could not parse the new syntax (e.g. optional chaining).

Some addons or libraries might depended on this legacy browser support, and thus might break. You might get an error like:

```
regeneratorRuntime is not defined
```

To fix these errors, the addon will have to be re-released with a newer browser-target for transpilation. This often looks something like this (but it's dependent on the build system the addon uses):

```js
// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        shippedProposals: true,
        useBuiltIns: 'usage',
        corejs: '3',
        modules: false,
        targets: { chrome: '100' },
      },
    ],
  ],
};
```

Here's an example PR to one of the storybook addons: https://github.com/storybookjs/addon-coverage/pull/3 doing just that.

#### No more configuration for manager

The storybook manager is no longer built with webpack. Now it's built with esbuild.
Therefore, it's no longer possible to configure the manager. Esbuild comes preconfigured to handle importing CSS, and images.

If you're currently loading files other than CSS or images into the manager, you'll need to make changes so the files get converted to JS before publishing your addon.

This means the preset value `managerWebpack` is no longer respected, and should be removed from presets and `main.js` files.

Addons that run in the manager can depend on `react` and `@storybook/*` packages directly. They do not need to be peerDependencies.
But very importantly, the build system ensures there will only be 1 version of these packages at runtime. The version will come from the `@storybook/ui` package, and not from the addon.
For this reason it's recommended to have these dependencies as `devDependencies` in your addon's `package.json`.

The full list of packages that Storybook's manager bundler makes available for addons is here: https://github.com/storybookjs/storybook/blob/next/code/lib/ui/src/globals/types.ts

Addons in the manager will no longer be bundled together anymore, which means that if 1 fails, it doesn't break the whole manager.
Each addon is imported into the manager as an ESM module that's bundled separately.

#### start-storybook / build-storybook binaries removed

SB6.x framework packages shipped binaries called `start-storybook` and `build-storybook`.

In SB7.0, we've removed these binaries and replaced them with new commands in Storybook's CLI: `storybook dev` and `storybook build`. These commands will look for the `framework` field in your `.storybook/main.js` config--[which is now required](#framework-field-mandatory)--and use that to determine how to start/build your storybook. The benefit of this change is that it is now possible to install multiple frameworks in a project without having to worry about hoisting issues.

A typical storybook project includes two scripts in your projects `package.json`:

```json
{
  "scripts": {
    "storybook": "start-storybook <some flags>",
    "build-storybook": "build-storybook <some flags>"
  }
}
```

To convert this project to 7.0:

```json
{
  "scripts": {
    "storybook": "storybook dev <some flags>",
    "build-storybook": "storybook build <some flags>"
  },
  "devDependencies": {
    "storybook": "next"
  }
}
```

The new CLI commands remove the following flags:

| flag     | migration                                                                                     |
| -------- | --------------------------------------------------------------------------------------------- |
| --modern | No migration needed. [All ESM code is modern in SB7](#modern-esm--ie11-support-discontinued). |

#### storyStoreV7 enabled by default

SB6.4 introduced [Story Store V7](#story-store-v7), an optimization which allows code splitting for faster build and load times. This was an experimental, opt-in change and you can read more about it in [the migration notes below](#story-store-v7). TLDR: you can't use the legacy `storiesOf` API or dynamic titles in CSF.

Now in 7.0, Story Store V7 is the default. You can opt-out of it by setting the feature flag in `.storybook/main.js`:

```js
module.exports = {
  features: {
    storyStoreV7: false,
  },
};
```

During the 7.0 dev cycle we will be preparing recommendations and utilities to make it easier for `storiesOf` users to upgrade.

#### Webpack4 support discontinued

SB7.0 no longer supports Webpack4.

Depending on your project specifics, it might be possible to run your Storybook using the webpack5 builder without error.

If you are running into errors, you can upgrade your project to Webpack5 or you can try debugging those errors.

To upgrade:

- If you're configuring webpack directly, see the Webpack5 [release announcement](https://webpack.js.org/blog/2020-10-10-webpack-5-release/) and [migration guide](https://webpack.js.org/migrate/5).
- If you're using Create React App, see the [migration notes](https://github.com/facebook/create-react-app/blob/main/CHANGELOG.md#migrating-from-40x-to-500) to upgrade from V4 (Webpack4) to 5

During the 7.0 dev cycle we will be updating this section with useful resources as we run across them.

#### Framework field mandatory

In 6.4 we introduced a new `main.js` field called [`framework`](#mainjs-framework-field). Starting in 7.0, this field is mandatory.
The value of the `framework` field has also changed.

In 6.4, valid values included `@storybook/react`, `@storybook/vue`, etc.

In 7.0, frameworks also specify the builder to be used. For example, The current list of frameworks include:

- `@storybook/angular`
- `@storybook/html-webpack5`
- `@storybook/preact-webpack5`
- `@storybook/react-webpack5`
- `@storybook/react-vite`
- `@storybook/server-webpack5`
- `@storybook/svelte-webpack5`
- `@storybook/svelte-vite`
- `@storybook/sveltekit`
- `@storybook/vue-webpack5`
- `@storybook/vue-vite`
- `@storybook/vue3-webpack5`
- `@storybook/vue3-vite`
- `@storybook/web-components-webpack5`
- `@storybook/web-components-vite`

We will be expanding this list over the course of the 7.0 development cycle. More info on the rationale here: [Frameworks RFC](https://www.notion.so/chromatic-ui/Frameworks-RFC-89f8aafe3f0941ceb4c24683859ed65c).

#### frameworkOptions renamed

In 7.0, the `main.js` fields `reactOptions` and `angularOptions` have been renamed. They are now options on the `framework` field:

```js
module.exports = {
  framework: {
    name: '@storybook/react-webpack5',
    options: { fastRefresh: true },
  },
};
```

#### Framework standalone build moved

In 7.0 the location of the standalone node API has moved to `@storybook/core-server`.

If you used the React standalone API, for example, you might have written:

```js
const { buildStandalone } = require('@storybook/react/standalone');
const options = {};
buildStandalone(options).then(() => console.log('done'));
```

In 7.0, you would now use:

```js
const build = require('@storybook/core-server/standalone');
const options = {};
build(options).then(() => console.log('done'));
```

#### Docs modern inline rendering by default

Storybook docs has a new rendering mode called "modern inline rendering" which unifies the way stories are rendered in Docs mode and in the canvas (aka story mode). It is still being stabilized in 7.0 dev cycle. If you run into trouble with inline rendering in docs, you can opt out of modern inline rendering in your `.storybook/main.js`:

```js
module.exports = {
  features: {
    modernInlineRender: false,
  },
};
```

#### Babel mode v7 exclusively

Storybook now uses [Babel mode v7](#babel-mode-v7) exclusively. In 6.x, Storybook provided its own babel settings out of the box. Now, Storybook's uses your project's babel settings (`.babelrc`, `babel.config.js`, etc.) instead.

In the new mode, Storybook expects you to provide a configuration file. If you want a configuration file that's equivalent to the 6.x default, you can run the following command in your project directory:

```sh
npx sb@next babelrc
```

This will create a `.babelrc.json` file. This file includes a bunch of babel plugins, so you may need to add new package devDependencies accordingly.

#### 7.0 feature flags removed

Storybook uses temporary feature flags to opt-in to future breaking changes or opt-in to legacy behaviors. For example:

```js
module.exports = {
  features: {
    emotionAlias: false,
  },
};
```

In 7.0 we've removed the following feature flags:

| flag                | migration instructions                               |
| ------------------- | ---------------------------------------------------- |
| `emotionAlias`      | This flag is no longer needed and should be deleted. |
| `breakingChangesV7` | This flag is no longer needed and should be deleted. |

#### CLI option `--use-npm` deprecated

With increased support for more package managers (pnpm), we have introduced the `--package-manager` CLI option. Please use `--package-manager=npm` to force NPM to be used to install dependencies when running Storybook CLI commands. Other valid options are `pnpm`, `yarn1`, and `yarn2` (`yarn2` is for versions 2 and higher).

#### Vite builder uses vite config automatically

When using a [Vite-based framework](#framework-field-mandatory), Storybook will automatically use your `vite.config.(ctm)js` config file starting in 7.0.  
Some settings will be overridden by storybook so that it can function properly, and the merged settings can be modified using `viteFinal` in `.storybook/main.js` (see the [Storybook Vite configuration docs](https://storybook.js.org/docs/react/builders/vite#configuration)).  
If you were using `viteFinal` in 6.5 to simply merge in your project's standard vite config, you can now remove it.

#### Vite cache moved to node_modules/.cache/.vite-storybook

Previously, Storybook's Vite builder placed cache files in node_modules/.vite-storybook. However, it's more common for tools to place cached files into `node_modules/.cache`, and putting them there makes it quick and easy to clear the cache for multiple tools at once. We don't expect this change will cause any problems, but it's something that users of Storybook Vite projects should know about. It can be configured by setting `cacheDir` in `viteFinal` within `.storybook/main.js` [Storybook Vite configuration docs](https://storybook.js.org/docs/react/builders/vite#configuration)).

#### SvelteKit needs the `@storybook/sveltekit` framework

SvelteKit projects need to use the `@storybook/sveltekit` framework in the `main.js` file. Previously it was enough to just setup Storybook with Svelte+Vite, but that is no longer the case.

```js
// .storybook/main.js
export default {
  framework: '@storybook/sveltekit',
};
```

#### Removed docs.getContainer and getPage parameters

It is no longer possible to set `parameters.docs.getContainer()` and `getPage()`. Instead use `parameters.docs.container` or `parameters.docs.page` directly.

#### Removed STORYBOOK_REACT_CLASSES global

This was a legacy global variable from the early days of react docgen. If you were using this variable, you can instead use docgen information which is added directly to components using `.__docgenInfo`.

#### Icons API changed

For addon authors who use the `Icons` component, its API has been updated in Storybook 7.

```diff
export interface IconsProps extends ComponentProps<typeof Svg> {
-  icon?: IconKey;
-  symbol?: IconKey;
+  icon: IconType;
+  useSymbol?: boolean;
}
```

Full change here: https://github.com/storybookjs/storybook/pull/18809

#### 'config' preset entry replaced with 'previewAnnotations'

The preset field `'config'` has been replaced with `'previewAnnotations'`. `'config'` is now deprecated and will be removed in Storybook 8.0.

Additionally, the internal field `'previewEntries'` has been removed. If you need a preview entry, just use a `'previewAnnotations'` file and don't export anything.

#### Dropped support for Angular 12 and below

Official [Angular 12 LTS support ends Nov 2022](https://angular.io/guide/releases#actively-supported-versions). With that, Storybook also drops its support
for Angular 12 and below.

In order to use Storybook 7.0, you need to upgrade to at least Angular 13.

#### Addon-backgrounds: Removed deprecated grid parameter

Starting in 7.0 the `grid.cellSize` parameter should now be `backgrounds.grid.cellSize`. This was [deprecated in SB 6.1](#deprecated-grid-parameter).

#### Addon-docs: Removed deprecated blocks.js entry

Removed `@storybook/addon-docs/blocks` entry. Import directly from `@storybook/addon-docs` instead. This was [deprecated in SB 6.3](#deprecated-scoped-blocks-imports).

#### Addon-a11y: Removed deprecated withA11y decorator

We removed the deprecated `withA11y` decorator. This was [deprecated in 6.0](#removed-witha11y-decorator)

#### Stories glob matches MDX files

If you used a directory based stories glob, in 6.x it would match `.stories.js` (and other JS extensions) and `.stories.mdx` files. For instance:

```js
// in main.js
export default {
  stories: ['../path/to/directory']
};

// or
export default {
  stories: [{ directory: '../path/to/directory' }]
};
```

In 7.0, this pattern will also match `.mdx` files (the new extension for docs files - see docs changes below). If you have `.mdx` files you don't want to appear in your storybook, either move them out of the directory, or add a `files` specifier with the old pattern (`"**/*.stories.@(mdx|tsx|ts|jsx|js)"`):

```js
export default {
  stories: [{ directory: '../path/to/directory', files: '**/*.stories.@(mdx|tsx|ts|jsx|js)' }],
};
```

### Docs Changes

The information hierarchy of docs in Storybook has changed in 7.0. The main difference is that each docs is listed in the sidebar as a separate entry, rather than attached to individual stories.

These changes are encapsulated in the following:

#### Standalone docs files

In Storybook 6.x, to create a standalone docs MDX file, you'd have to create a `.stories.mdx` file, and describe its location with the `Meta` doc block:

```mdx
import { Meta } from '@storybook/addon-docs';

<Meta title="Introduction" />
```

In 7.0, things are a little simpler -- you should call the file `.mdx` (drop the `.stories`). This will mean behind the scenes there is no story attached to this entry. You may also drop the `title` and use autotitle (and leave the `Meta` component out entirely).

Additionally, you can attach a standalone docs entry to a component, using the new `of={}` syntax on the `Meta` component:

```mdx
import { Meta } from '@storybook/blocks';
import * as ComponentStories from './some-component.stories';

<Meta of={ComponentStories} />
```

You can create as many docs entries as you like for a given component. Note that if you attach a docs entry to a component it will replace the automatically generated entry from `DocsPage` (See below).

By default docs entries are listed first for the component. You can sort them using story sorting.

#### Referencing stories in docs files

To reference a story in a MDX file, you should reference it with `of`:

```mdx
import { Meta, Story } from '@storybook/blocks';
import * as ComponentStories from './some-component.stories';

<Meta of={ComponentStories} />

<Story of={ComponentStories.standard} />
```

You can also reference a story from a different component:

```mdx
import { Meta, Story } from '@storybook/blocks';
import * as ComponentStories from './some-component.stories';
import * as SecondComponentStories from './second-component.stories';

<Meta of={ComponentStories} />

<Story of={SecondComponentStories.standard} meta={SecondComponentStories} />
```

#### Docs Page

In 7.0, rather than rendering each story in "docs view mode", Docs Page operates by adding additional sidebar entries for each component. By default it uses the same template as was used in 6.x, and the entries are entitled `Docs`.

You can configure Docs Page in `main.js`:

```js
module.exports = {
  docs: {
    docsPage: 'automatic', // see below for alternatives
    defaultName: 'Docs', // set to change the name of generated docs entries
  },
};
```

If you are migrating from 6.x your `docs.docsPage` option will have been set to `'automatic'`, which has the effect of enabling docs page for _every_ CSF file. However, as of 7.0, the new default is `true`, which requires opting into DocsPage per-CSF file, with the `docsPage` **tag** on your component export:

```ts
export default {
  component: MyComponent
  // Tags are a new feature coming in 7.1, that we are using to drive this behaviour.
  tags: ['docsPage']
}
```

You can also set `docsPage: false` to opt-out of docs page entirely.

You can change the default template in the same way as in 6.x, using the `docs.page` parameter.

#### Configuring the Docs Container

As in 6.x, you can override the docs container to configure docs further. This the container that each docs entry is rendered inside:

```js
// in preview.js

export const parameters = {
  docs: {
    container: // your container
  }
}
```

You likely want to use the `DocsContainer` component exported by `@storybook/blocks` and consider the following examples:

**Overriding theme**:

To override the theme, you can continue to use the `docs.theme` parameter.

**Overriding MDX components**

If you want to override the MDX components supplied to your docs page, use the `MDXProvider` from `@mdx-js/react`:

```js
import { MDXProvider } from '@mdx-js/react';
import { DocsContainer } from '@storybook/blocks';
import * as DesignSystem from 'your-design-system';

export const MyDocsContainer = (props) => (
  <MDXProvider
    components={{
      h1: DesignSystem.H1,
      h2: DesignSystem.H2,
    }}
  >
    <DocsContainer {...props} />
  </MDXProvider>
);
```

**_NOTE_**: due to breaking changes in MDX2, such override will _only_ apply to elements you create via the MDX syntax, not pure HTML -- ie. `## content` not `<h2>content</h2>`.

#### External Docs

Storybook 7.0 can be used in the above way in externally created projects (i.e. custom docs sites). Your `.mdx` files defined as above should be portable to other contexts. You simply need to render them in an `ExternalDocs` component:

```js
// In your project somewhere:
import { ExternalDocs } from '@storybook/blocks';

// Import all the preview entries from addons that need to operate in your external docs,
// at a minimum likely your project's and your renderer's.
import * as reactAnnotations from '@storybook/react/preview';
import * as previewAnnotations from '../.storybook/preview';

export default function App({ Component, pageProps }) {
  return (
    <ExternalDocs projectAnnotationsList={[reactAnnotations, previewAnnotations]}>
      <Component {...pageProps} />
    </ExternalDocs>
  );
}
```

#### MDX2 upgrade

Storybook 7 Docs uses MDXv2 instead of MDXv1. This means an improved syntax, support for inline JS expression, and improved performance among [other benefits](https://mdxjs.com/blog/v2/).

If you use `.stories.mdx` files in your project, you may need to edit them since MDX2 contains [breaking changes](https://mdxjs.com/migrating/v2/#update-mdx-files).

We will update this section with specific pointers based on user feedback during the prerelease period and probably add an codemod to help streamline the upgrade before final 7.0 release.

As part of the upgrade we deleted the codemod `mdx-to-csf` and will be replacing it with a more sophisticated version prior to release.

#### Default docs styles will leak into non-story user components

Storybook's default styles in docs are now globally applied to any element instead of using classes. This means that any component that you add directly in a docs file will also get the default styles.

To mitigate this you need to wrap any content you don't want styled with the `Unstyled` block like this:

```mdx
import { Unstyled } from '@storybook/blocks';
import { MyComponent } from './MyComponent';

# This is a header

<Unstyled>
  <MyComponent />
</Unstyled>
```

Components that are part of your stories or in a canvas will not need this mitigation, as the `Story` and `Canvas` blocks already have this built-in.

#### Explicit `<code>` elements are no longer syntax highlighted

Due to how MDX2 works differently from MDX1, manually defined `<code>` elements are no longer transformed to the `Code` component, so it will not be syntax highlighted. This is not the case for markdown \`\`\` code-fences, that will still end up as `Code` with syntax highlighting.

Luckily [MDX2 supports markdown (like code-fences) inside elements better now](https://mdxjs.com/blog/v2/#improvements-to-the-mdx-format), so most cases where you needed a `<code>` element before, you can use code-fences instead:

<!-- prettier-ignore-start -->
````md
<code>This will now be an unstyled line of code</code>

```js
const a = 'This is still a styled code block.';
```

<div style={{ background: 'red', padding: '10px' }}>
  ```js
  const a = 'MDX2 supports markdown in elements better now, so this is possible.';
  ```
</div>
````
<!-- prettier-ignore-end -->

#### Dropped source loader / storiesOf static snippets

In SB 6.x, Storybook Docs used a webpack loader called `source-loader` to help display static code snippets. This was configurable using the `options.sourceLoaderOptions` field.

In SB 7.0, we've moved to a faster, simpler alternative called `csf-plugin` that **only supports CSF**. It is configurable using the `options.csfPluginOptions` field.

If you're using `storiesOf` and want to restore the previous behavior, you can add `source-loader` by hand to your webpack config using the following snippet in `main.js`:

```js
module.exports = {
  webpackFinal: (config) => {
    config.modules.rules.push({
      test: /\.stories\.[tj]sx?$/,
      use: [
        {
          loader: require.resolve('@storybook/source-loader'),
          options: {} /* your sourceLoaderOptions here */,
        },
      ],
      enforce: 'pre',
    });
    return config;
  },
};
```

#### Dropped addon-docs manual configuration

Storybook Docs 5.x shipped with instructions for how to manually configure webpack and storybook without the use of Storybook's "presets" feature. Over time, these docs went out of sync. Now in Storybook 7 we have removed support for manual configuration entirely.

#### Autoplay in docs

Running play functions in docs is generally tricky, as they can steal focus and cause the window to scroll. Consequently, we've disabled play functions in docs by default.

If your story depends on a play function to render correctly, _and_ you are confident the function autoplaying won't mess up your docs, you can set `parameters.docs.autoplay = true` to have it auto play.

### 7.0 Deprecations

#### `Story` type deprecated

In 6.x you were able to do this:

```ts
import type { Story } from '@storybook/react';

export const MyStory: Story = () => <div />;
```

But this will produce a deprecation warning in 7.0 because `Story` has been deprecated.
To fix the deprecation warning, use the `StoryFn` type:

```ts
import type { StoryFn } from '@storybook/react';

export const MyStory: StoryFn = () => <div />;
```

This change is part of our move to CSF3, which uses objects instead of functions to represent stories.
You can read more about the CSF3 format here: https://storybook.js.org/blog/component-story-format-3-0/

#### `ComponentStory`, `ComponentStoryObj`, `ComponentStoryFn` and `ComponentMeta` types are deprecated

The type of StoryObj and StoryFn have been changed in 7.0 so that both the "component" as "the props of the component" will be accepted as the generic parameter.

```ts
import type { Story } from '@storybook/react';
import { Button, ButtonProps } from './Button';

// This works in 7.0, making the ComponentX types redundant.
const meta: Meta<typeof Button> = { component: Button };

export const CSF3Story: StoryObj<typeof Button> = { args: { label: 'Label' } };

export const CSF2Story: StoryFn<typeof Button> = (args) => <Button {...args} />;
CSF2Story.args = { label: 'Label' };

// Passing props directly still works as well.
const meta: Meta<ButtonProps> = { component: Button };

export const CSF3Story: StoryObj<ButtonProps> = { args: { label: 'Label' } };

export const CSF2Story: StoryFn<ButtonProps> = (args) => <Button {...args} />;
CSF2Story.args = { label: 'Label' };
```

#### Renamed `renderToDOM` to `renderToCanvas`

The "rendering" function that renderers (ex-frameworks) must export (`renderToDOM`) has been renamed to `renderToCanvas` to acknowledge that some consumers of frameworks/the preview do not work with DOM elements.

#### Renamed `XFramework` to `XRenderer`

In 6.x you could import XFramework types:

```ts
import type { ReactFramework } from '@storybook/react';
import type { VueFramework } from '@storybook/vue';
import type { SvelteFramework } from '@storybook/svelte';

// etc.
```

Those are deprecated in 7.0 as they are renamed to:

```ts
import type { ReactRenderer } from '@storybook/react';
import type { VueRenderer } from '@storybook/vue';
import type { SvelteRenderer } from '@storybook/svelte';

// etc.
```

#### Renamed `DecoratorFn` to `Decorator`

In 6.x you could import the type `DecoratorFn`:

```ts
import type { DecoratorFn } from '@storybook/react';
```

This type is deprecated in 7.0, instead you can use the type `Decorator`, which is now available for all renderers:

```ts
import type { Decorator } from '@storybook/react';
// or
import type { Decorator } from '@storybook/vue';
// or
import type { Decorator } from '@storybook/svelte';
// etc.
```

The type `Decorator` accepts a generic parameter `TArgs`. This can be used like this:

```tsx
import type { Decorator } from '@storybook/react';
import { LocaleProvider } from './locale';

const withLocale: Decorator<{ locale: 'en' | 'es' }> = (Story, { args }) => (
  <LocaleProvider lang={args.locale}>
    <Story />
  </LocaleProvider>
);
```

If you want to use `Decorator` in a backwards compatible way to `DecoratorFn`, you can use:

```tsx
import type { Args, Decorator } from '@storybook/react';

// Decorator<Args> behaves the same as DecoratorFn (without generic)
const withLocale: Decorator<Args> = (Story, { args }) => // args has type { [name: string]: any }
```

## From version 6.4.x to 6.5.0

### Vue 3 upgrade

Storybook 6.5 supports Vue 3 out of the box when you install it fresh. However, if you're upgrading your project from a previous version, you'll need to [follow the steps for opting-in to webpack 5](#webpack-5).

### React18 new root API

React 18 introduces a [new root API](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis). Starting in 6.5, Storybook for React will auto-detect your react version and use the new root API automatically if you're on React18.

If you wish to opt out of the new root API, set the `reactOptions.legacyRootApi` flag in your `.storybook/main.js` config:

```js
module.exports = {
  reactOptions: { legacyRootApi: true },
};
```

### Renamed isToolshown to showToolbar

Storybook's [manager API](docs/addons/addons-api.md) has deprecated the `isToolshown` option (to show/hide the toolbar) and renamed it to `showToolbar` for consistency with other similar UI options.

Example:

```js
// .storybook/manager.js
import { addons } from '@storybook/addons';

addons.setConfig({
  showToolbar: false,
});
```

### Dropped support for addon-actions addDecorators

Prior to SB6.5, `addon-actions` provided an option called `addDecorators`. In SB6.5, decorators are applied always. This is technically a breaking change, so if this affects you please file an issue in Github and we can consider reverting this in a patch release.

### Vite builder renamed

SB6.5 renames Storybook's [Vite builder](https://github.com/storybookjs/builder-vite) from `storybook-builder-vite` to `@storybook/builder-vite`. This move is part of a larger effort to improve Vite support in Storybook.

Storybook's `automigrate` command can migrate for you. To manually migrate:

1. Remove `storybook-builder-vite` from your `package.json` dependencies
2. Install `@storybook/builder-vite`
3. Update your `core.builder` setting in `.storybook/main.js` to `@storybook/builder-vite`.

### Docs framework refactor for React

SB6.5 moves framework specializations (e.g. ArgType inference, dynamic snippet rendering) out of `@storybook/addon-docs` and into the specific framework packages to which they apply (e.g. `@storybook/react`).

This change should not require any specific migrations on your part if you are using the docs addon as described in the documentation. However, if you are using `react-docgen` or `react-docgen-typescript` information in some custom way outside of `addon-docs`, you should be aware of this change.

In SB6.4, `@storybook/react` added `react-docgen` to its babel settings and `react-docgen-typescript` to its webpack settings. In SB6.5, this only happens if you are using `addon-docs` or `addon-controls`, either directly or indirectly through `addon-essentials`. If you're not using either of those addons, but require that information for some other addon, please configure that manually in your `.storybook/main.js` configuration. You can see the docs configuration here: https://github.com/storybookjs/storybook/blob/next/code/presets/react-webpack/src/framework-preset-react-docs.ts

### Opt-in MDX2 support

SB6.5 adds experimental opt-in support for MDXv2. To install:

```sh
yarn add @storybook/mdx2-csf -D
```

Then add the `previewMdx2` feature flag to your `.storybook/main.js` config:

```js
module.exports = {
  features: {
    previewMdx2: true,
  },
};
```

### CSF3 auto-title improvements

SB 6.4 introduced experimental "auto-title", in which a story's location in the sidebar (aka `title`) can be automatically inferred from its location on disk. For example, the file `atoms/Button.stories.js` might result in the title `Atoms/Button`.

We've made two improvements to Auto-title based on user feedback:

- Auto-title preserves filename case
- Auto-title removes redundant filenames from the path

#### Auto-title filename case

SB 6.4's implementation of auto-title ran `startCase` on each path component. For example, the file `atoms/MyButton` would be transformed to `Atoms/My Button`.

We've changed this in SB 6.5 to preserve the filename case, so that instead it the same file would result in the title `atoms/MyButton`. The rationale is that this gives more control to users about what their auto-title will be.

This might be considered a breaking change. However, we feel justified to release this in 6.5 because:

1. We consider it a bug in the initial auto-title implementation
2. CSF3 and the auto-title feature are experimental, and we reserve the right to make breaking changes outside of semver (tho we try to avoid it)

If you want to restore the old titles in the UI, you can customize your sidebar with the following code snippet in `.storybook/manager.js`:

```js
import { addons } from '@storybook/addons';
import startCase from 'lodash/startCase';

addons.setConfig({
  sidebar: {
    renderLabel: ({ name, type }) => (type === 'story' ? name : startCase(name)),
  },
});
```

#### Auto-title redundant filename

The heuristic failed in the common scenario in which each component gets its own directory, e.g. `atoms/Button/Button.stories.js`, which would result in the redundant title `Atoms/Button/Button`. Alternatively, `atoms/Button/index.stories.js` would result in `Atoms/Button/Index`.

To address this problem, 6.5 introduces a new heuristic to removes the filename if it matches the directory name or `index`. So `atoms/Button/Button.stories.js` and `atoms/Button/index.stories.js` would both result in the title `Atoms/Button` (or `atoms/Button` if `autoTitleFilenameCase` is set, see above).

Since CSF3 is experimental, we are introducing this technically breaking change in a minor release. If you desire the old structure, you can manually specify the title in file. For example:

```js
// atoms/Button/Button.stories.js
export default { title: 'Atoms/Button/Button' };
```

#### Auto-title always prefixes

When the user provides a `prefix` in their `main.js` `stories` field, it now prefixes all titles to matching stories, whereas in 6.4 and earlier it only prefixed auto-titles.

Consider the following example:

```js
// main.js
module.exports = {
  stories: [{ directory: '../src', titlePrefix: 'Custom' }]
}

// ../src/NoTitle.stories.js
export default { component: Foo };

// ../src/Title.stories.js
export default { component: Bar, title: 'Bar' }
```

In 6.4, the final titles would be:

- `NoTitle.stories.js` => `Custom/NoTitle`
- `Title.stories.js` => `Bar`

In 6.5, the final titles would be:

- `NoTitle.stories.js` => `Custom/NoTitle`
- `Title.stories.js` => `Custom/Bar`

<!-- markdown-link-check-disable -->

### 6.5 Deprecations

#### Deprecated register.js

In ancient versions of Storybook, addons were registered by referring to `addon-name/register.js`. This is going away in SB7.0. Instead you should just add `addon-name` to the `addons` array in `.storybook/main.js`.

Before:

```js
module.exports = { addons: ['my-addon/register.js'] };
```

After:

```js
module.exports = { addons: ['my-addon'] };
```

## From version 6.3.x to 6.4.0

### Automigrate

Automigrate is a new 6.4 feature that provides zero-config upgrades to your dependencies, configurations, and story files.

Each automigration analyzes your project, and if it's is applicable, propose a change alongside relevant documentation. If you accept the changes, the automigration will update your files accordingly.

For example, if you're in a webpack5 project but still use Storybook's default webpack4 builder, the automigration can detect this and propose an upgrade. If you opt-in, it will install the webpack5 builder and update your `main.js` configuration automatically.

You can run the existing suite of automigrations to see which ones apply to your project. This won't update any files unless you accept the changes:

```

npx sb@next automigrate

```

The automigration suite also runs when you create a new project (`sb init`) or when you update storybook (`sb upgrade`).

### CRA5 upgrade

Storybook 6.3 supports CRA5 out of the box when you install it fresh. However, if you're upgrading your project from a previous version, you'll need to upgrade the configuration. You can do this automatically by running:

```

npx sb@next automigrate

```

Or you can do the following steps manually to force Storybook to use webpack 5 for building your project:

```shell
yarn add @storybook/builder-webpack5 @storybook/manager-webpack5 --dev
# Or
npm install @storybook/builder-webpack5 @storybook/manager-webpack5 --save-dev
```

Then edit your `.storybook/main.js` config:

```js
module.exports = {
  core: {
    builder: 'webpack5',
  },
};
```

### CSF3 enabled

SB6.3 introduced a feature flag, `features.previewCsfV3`, to opt-in to experimental [CSF3 syntax support](https://storybook.js.org/blog/component-story-format-3-0/). In SB6.4, CSF3 is supported regardless of `previewCsfV3`'s value. This should be a fully backwards-compatible change. The `previewCsfV3` flag has been deprecated and will be removed in SB7.0.

#### Optional titles

In SB6.3 and earlier, component titles were required in CSF default exports. Starting in 6.4, they are optional.
If you don't specify a component file, it will be inferred from the file's location on disk.

Consider a project configuration `/path/to/project/.storybook/main.js` containing:

```js
module.exports = { stories: ['../src/**/*.stories.*'] };
```

And the file `/path/to/project/src/components/Button.stories.tsx` containing the default export:

```js
import { Button } from './Button';
export default { component: Button };
// named exports...
```

The inferred title of this file will be `components/Button` based on the stories glob in the configuration file.
We will provide more documentation soon on how to configure this.

#### String literal titles

Starting in 6.4 CSF component [titles are optional](#optional-titles). However, if you do specify titles, title handing is becoming more strict in V7 and is limited to string literals.

Earlier versions of Storybook supported story titles that are dynamic Javascript expressions

```js
// ✅ string literals 6.3 OK / 7.0 OK
export default {
  title: 'Components/Atoms/Button',
};

// ✅ undefined 6.3 OK / 7.0 OK
export default {
  component: Button,
};

// ❌ expressions: 6.3 OK / 7.0 KO
export default {
  title: foo('bar'),
};

// ❌ template literals 6.3 OK / 7.0 KO
export default {
  title: `${bar}`,
};
```

#### StoryObj type

The TypeScript type for CSF3 story objects is `StoryObj`, and this will become the default in Storybook 7.0. In 6.x, the `StoryFn` type is the default, and `Story` is aliased to `StoryFn`.

If you are migrating to experimental CSF3, the following is compatible with 6.4 and requires the least amount of change to your code today:

```ts
// CSF2 function stories, current API, will break in 7.0
import type { Story } from '@storybook/<framework>';

// CSF3 object stories, will persist in 7.0
import type { StoryObj } from '@storybook/<framework>';
```

The following is compatible with 6.4 and also forward-compatible with anticipated 7.0 changes:

```ts
// CSF2 function stories, forward-compatible mode
import type { StoryFn } from '@storybook/<framework>';

// CSF3 object stories, using future 7.0 types
import type { Story } from '@storybook/<framework>/types-7-0';
```

### Story Store v7

SB6.4 introduces an opt-in feature flag, `features.storyStoreV7`, which loads stories in an "on demand" way (that is when rendered), rather than up front when the Storybook is booted. This way of operating will become the default in 7.0 and will likely be switched to opt-out in that version.

The key benefit of the on demand store is that stories are code-split automatically (in `builder-webpack4` and `builder-webpack5`), which allows for much smaller bundle sizes, faster rendering, and improved general performance via various opt-in Webpack features.

The on-demand store relies on the "story index" data structure which is generated in the server (node) via static code analysis. As such, it has the following limitations:

- Does not work with `storiesOf()`
- Does not work if you use dynamic story names or component titles.

However, the `autoTitle` feature is supported.

#### Behavioral differences

The key behavioral differences of the v7 store are:

- `SET_STORIES` is not emitted on boot up. Instead the manager loads the story index independently.
- A new event `STORY_PREPARED` is emitted when a story is rendered for the first time, which contains metadata about the story, such as `parameters`.
- All "entire" store APIs such as `extract()` need to be proceeded by an async call to `loadAllCSFFiles()` which fetches all CSF files and processes them.

#### Main.js framework field

In earlier versions of Storybook, each framework package (e.g. `@storybook/react`) provided its own `start-storybook` and `build-storybook` binaries, which automatically filled in various settings.

In 7.0, we're moving towards a model where the user specifies their framework in `main.js`.

```js
module.exports = {
  // ... your existing config
  framework: '@storybook/react', // OR whatever framework you're using
};
```

Each framework must export a `renderToDOM` function and `parameters.framework`. We'll be adding more documentation for framework authors in a future release.

#### Using the v7 store

To activate the v7 mode set the feature flag in your `.storybook/main.js` config:

```js
module.exports = {
  // ... your existing config
  framework: '@storybook/react', // OR whatever framework you're using
  features: {
    storyStoreV7: true,
  },
};
```

NOTE: `features.storyStoreV7` implies `features.buildStoriesJson` and has the same limitations.

#### v7-style story sort

If you've written a custom `storySort` function, you'll need to rewrite it for V7.

SB6.x supports a global story function specified in `.storybook/preview.js`. It accepts two arrays which each contain:

- The story ID
- A story object that contains the name, title, etc.
- The component's parameters
- The project-level parameters

SB 7.0 streamlines the story function. It now accepts a `StoryIndexEntry` which is
an object that contains only the story's `id`, `title`, `name`, and `importPath`.

Consider the following example, before and after:

```js
// v6-style sort
function storySort(a, b) {
  return a[1].kind === b[1].kind
    ? 0
    : a[1].id.localeCompare(b[1].id, undefined, { numeric: true });
},
```

And the after version using `title` instead of `kind` and not receiving the full parameters:

```js
// v7-style sort
function storySort(a, b) {
  return a.title === b.title
    ? 0
    : a.id.localeCompare(b.id, undefined, { numeric: true });
},
```

#### v7 Store API changes for addon authors

The Story Store in v7 mode is async, so synchronous story loading APIs no longer work. In particular:

- `store.fromId()` has been replaced by `store.loadStory()`, which is async (i.e. returns a `Promise` you will need to await).
- `store.raw()/store.extract()` and friends that list all stories require a prior call to `store.cacheAllCSFFiles()` (which is async). This will load all stories, and isn't generally a good idea in an addon, as it will force the whole store to load.

#### Storyshots compatibility in the v7 store

Storyshots is not currently compatible with the v7 store. However, you can use the following workaround to opt-out of the v7 store when running storyshots; in your `main.js`:

```js
module.exports = {
  features: {
    storyStoreV7: !global.navigator?.userAgent?.match?.('jsdom'),
  },
};
```

There are some caveats with the above approach:

- The code path in the v6 store is different to the v7 store and your mileage may vary in identical behavior. Buyer beware.
- The story sort API [changed between the stores](#v7-style-story-sort). If you are using a custom story sort function, you will need to ensure it works in both contexts (perhaps using the check `global.navigator.userAgent.match('jsdom')`).

### Emotion11 quasi-compatibility

Now that the web is moving to Emotion 11 for styling, popular libraries like MUI5 and ChakraUI are breaking with Storybook 6.3 which only supports emotion@10.

Unfortunately we're unable to upgrade Storybook to Emotion 11 without a semver major release, and we're not ready for that. So, as a workaround, we've created a feature flag which opts-out of the previous behavior of pinning the Emotion version to v10. To enable this workaround, add the following to your `.storybook/main.js` config:

```js
module.exports = {
  features: {
    emotionAlias: false,
  },
};
```

Setting this should unlock theming for emotion11-based libraries in Storybook 6.4.

### Babel mode v7

SB6.4 introduces an opt-in feature flag, `features.babelModeV7`, that reworks the way Babel is configured in Storybook to make it more consistent with the Babel is configured in your app. This breaking change will become the default in SB 7.0, but we encourage you to migrate today.

> NOTE: CRA apps using `@storybook/preset-create-react-app` use CRA's handling, so the new flag has no effect on CRA apps.

In SB6.x and earlier, Storybook provided its own default configuration and inconsistently handled configurations from the user's babelrc file. This resulted in a final configuration that differs from your application's configuration AND is difficult to debug.

In `babelModeV7`, Storybook no longer provides its own default configuration and is primarily configured via babelrc file, with small, incremental updates from Storybook addons.

In 6.x, Storybook supported a `.storybook/babelrc` configuration option. This is no longer supported and it's up to you to reconcile this with your project babelrc.

To activate the v7 mode set the feature flag in your `.storybook/main.js` config:

```js
module.exports = {
  // ... your existing config
  features: {
    babelModeV7: true,
  },
};
```

In the new mode, Storybook expects you to provide a configuration file. If you want a configuration file that's equivalent to the 6.x default, you can run the following command in your project directory:

```sh
npx sb@next babelrc
```

This will create a `.babelrc.json` file. This file includes a bunch of babel plugins, so you may need to add new package devDependencies accordingly.

### Loader behavior with args changes

In 6.4 the behavior of loaders when arg changes occurred was tweaked so loaders do not re-run. Instead the previous value of the loader is passed to the story, irrespective of the new args.

### 6.4 Angular changes

#### SB Angular builder

Since SB6.3, Storybook for Angular supports a builder configuration in your project's `angular.json`. This provides an Angular-style configuration for running and building your Storybook. The full builder documentation will be shown in the [main documentation page](https://storybook.js.org/docs/angular) soon, but for now you can check out an example here:

- `start-storybook`: [example](https://github.com/storybookjs/storybook/blob/next/examples/angular-cli/angular.json#L78) [schema](https://github.com/storybookjs/storybook/blob/next/app/angular/src/builders/start-storybook/schema.json)
- `build-storybook`: [example](https://github.com/storybookjs/storybook/blob/next/examples/angular-cli/angular.json#L86) [schema](https://github.com/storybookjs/storybook/blob/next/app/angular/src/builders/build-storybook/schema.json)

#### Angular13

Angular 13 introduces breaking changes that require updating your Storybook configuration if you are migrating from a previous version of Angular.

Most notably, the documented way of including global styles is no longer supported by Angular13. Previously you could write the following in your `.storybook/preview.js` config:

```
import '!style-loader!css-loader!sass-loader!./styles.scss';
```

If you use Angular 13 and above, you should use the builder configuration instead:

```json
   "my-default-project": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "styles": ["src/styles.css", "src/styles.scss"],
          }
        }
      },
   },
```

If you need storybook-specific styles separate from your app, you can configure the styles in the [SB Angular builder](#sb-angular-builder), which completely overrides your project's styles:

```json
      "storybook": {
        "builder": "@storybook/angular:start-storybook",
        "options": {
          "browserTarget": "my-default-project:build",
          "styles": [".storybook/custom-styles.scss"],
        },
      }
```

Then, once you've set this up, you should run Storybook through the builder:

```sh
ng run my-default-project:storybook
ng run my-default-project:build-storybook
```

#### Angular component parameter removed

In SB6.3 and earlier, the `default.component` metadata was implemented as a parameter, meaning that stories could set `parameters.component` to override the default export. This was an internal implementation that was never documented, but it was mistakenly used in some Angular examples.

If you have Angular stories of the form:

```js
export const MyStory = () => ({ ... })
SomeStory.parameters = { component: MyComponent };
```

You should rewrite them as:

```js
export const MyStory = () => ({ component: MyComponent, ... })
```

[More discussion here.](https://github.com/storybookjs/storybook/pull/16010#issuecomment-917378595)

### 6.4 deprecations

#### Deprecated --static-dir CLI flag

In 6.4 we've replaced the `--static-dir` CLI flag with the the `staticDirs` field in `.storybook/main.js`. Note that the CLI directories are relative to the current working directory, whereas the `staticDirs` are relative to the location of `main.js`.

Before:

```sh
start-storybook --static-dir ./public,./static,./foo/assets:/assets
```

After:

```js
// .storybook/main.js
module.exports = {
  staticDirs: ['../public', '../static', { from: '../foo/assets', to: '/assets' }],
};
```

The `--static-dir` flag has been deprecated and will be removed in Storybook 7.0.

## From version 6.2.x to 6.3.0

### Webpack 5

Storybook 6.3 brings opt-in support for building both your project and the manager UI with webpack 5. To do so, there are two ways:

1 - Upgrade command

If you're upgrading your Storybook version, run this command, which will both upgrade your dependencies but also detect whether you should migrate to webpack5 builders and apply the changes automatically:

```shell
npx sb upgrade
```

2 - Automigrate command

If you don't want to change your Storybook version but want Storybook to detect whether you should migrate to webpack5 builders and apply the changes automatically:

```shell
npx sb automigrate
```

3 - Manually

If either methods did not work or you just want to proceed manually, do the following steps:

Install the dependencies:

```shell
yarn add @storybook/builder-webpack5 @storybook/manager-webpack5 --dev
# Or
npm install @storybook/builder-webpack5 @storybook/manager-webpack5 --save-dev
```

Then edit your `.storybook/main.js` config:

```js
module.exports = {
  core: {
    builder: 'webpack5',
  },
};
```

> NOTE: If you're using `@storybook/preset-create-react-app` make sure to update it to version 4.0.0 as well.

#### Fixing hoisting issues

##### Webpack 5 manager build

Storybook 6.2 introduced **experimental** webpack5 support for building user components. Storybook 6.3 also supports building the manager UI in webpack 5 to avoid strange hoisting issues.

If you're upgrading from 6.2 and already using the experimental webpack5 feature, this might be a breaking change (hence the 'experimental' label) and you should try adding the manager builder:

```shell
yarn add @storybook/manager-webpack5 --dev
# Or
npm install @storybook/manager-webpack5 --save-dev
```

##### Wrong webpack version

Because Storybook uses `webpack@4` as the default, it's possible for the wrong version of webpack to get hoisted by your package manager. If you receive an error that looks like you might be using the wrong version of webpack, install `webpack@5` explicitly as a dev dependency to force it to be hoisted:

```shell
yarn add webpack@5 --dev
# Or
npm install webpack@5 --save-dev
```

Alternatively or additionally you might need to add a resolution to your package.json to ensure that a consistent webpack version is provided across all of storybook packages. Replacing the {app} with the app (react, vue, etc.) that you're using:

```js
// package.json
...
resolutions: {
  "@storybook/{app}/webpack": "^5"
}
...
```

### Angular 12 upgrade

Storybook 6.3 supports Angular 12 out of the box when you install it fresh. However, if you're upgrading your project from a previous version, you'll need to [follow the steps for opting-in to webpack 5](#webpack-5).

### Lit support

Storybook 6.3 introduces Lit 2 support in a non-breaking way to ease migration from `lit-html`/`lit-element` to `lit`.

To do so, it relies on helpers added in the latest minor versions of `lit-html`/`lit-element`. So when upgrading to Storybook 6.3, please ensure your project is using `lit-html` 1.4.x or `lit-element` 2.5.x.

According to the package manager you are using, it can be handled automatically when updating Storybook or can require to manually update the versions and regenerate the lockfile.

### No longer inferring default values of args

Previously, unset `args` were set to the `argType.defaultValue` if set or inferred from the component's prop types (etc.). In 6.3 we no longer infer default values and instead set arg values to `undefined` when unset, allowing the framework to supply the default value.

If you were using `argType.defaultValue` to fix issues with the above inference, it should no longer be necessary, you can remove that code.

If you were using `argType.defaultValue` or relying on inference to set a default value for an arg, you should now set a value for the arg at the component level:

```js
export default {
  component: MyComponent,
  args: {
    argName: 'default-value',
  },
};
```

To manually configure the value that is shown in the ArgsTable doc block, you can configure the `table.defaultValue` setting:

```js
export default {
  component: MyComponent,
  argTypes: {
    argName: {
      table: { defaultValue: { summary: 'SomeType<T>' } },
    },
  },
};
```

### 6.3 deprecations

#### Deprecated addon-knobs

We are replacing `@storybook/addon-knobs` with `@storybook/addon-controls`.

- [Rationale & discussion](https://github.com/storybookjs/storybook/discussions/15060)
- [Migration notes](https://github.com/storybookjs/storybook/blob/next/addons/controls/README.md#how-do-i-migrate-from-addon-knobs)

#### Deprecated scoped blocks imports

In 6.3, we changed doc block imports from `@storybook/addon-docs/blocks` to `@storybook/addon-docs`. This makes it possible for bundlers to automatically choose the ESM or CJS version of the library depending on the context.

To update your code, you should be able to global replace `@storybook/addon-docs/blocks` with `@storybook/addon-docs`. Example:

```js
// before
import { Meta, Story } from '@storybook/addon-docs/blocks';

// after
import { Meta, Story } from '@storybook/addon-docs';
```

#### Deprecated layout URL params

Several URL params to control the manager layout have been deprecated and will be removed in 7.0:

- `addons=0`: use `panel=false` instead
- `panelRight=1`: use `panel=right` instead
- `stories=0`: use `nav=false` instead

Additionally, support for legacy URLs using `selectedKind` and `selectedStory` will be removed in 7.0. Use `path` instead.

## From version 6.1.x to 6.2.0

### MDX pattern tweaked

In 6.2 files ending in `stories.mdx` or `story.mdx` are now processed with Storybook's MDX compiler. Previously it only applied to files ending in `.stories.mdx` or `.story.mdx`. See more here: [#13996](https://github.com/storybookjs/storybook/pull/13996).

### 6.2 Angular overhaul

#### New Angular storyshots format

We've updated the Angular storyshots format in 6.2, which is technically a breaking change. Apologies to semver purists: if you're using storyshots, you'll need to [update your snapshots](https://jestjs.io/docs/en/snapshot-testing#updating-snapshots).

The new format hides the implementation details of `@storybook/angular` so that we can evolve its renderer without breaking your snapshots in the future.

#### Deprecated Angular story component

Storybook 6.2 for Angular uses `parameters.component` as the preferred way to specify your stories' components. The previous method, in which the component was a return value of the story, has been deprecated.

Consider the existing story from 6.1 or earlier:

```ts
export default { title: 'Button' };
export const Basic = () => ({
  component: Button,
  props: { label: 'Label' },
});
```

From 6.2 this should be rewritten as:

```ts
export default { title: 'Button', component: Button };
export const Basic = () => ({
  props: { label: 'Label' },
});
```

The new convention is consistent with how other frameworks and addons work in Storybook. The old way will be supported until 7.0. For a full discussion see <https://github.com/storybookjs/storybook/issues/8673>.

#### New Angular renderer

We've rewritten the Angular renderer in Storybook 6.2. It's meant to be entirely backwards compatible, but if you need to use the legacy renderer it's still available via a [parameter](https://storybook.js.org/docs/angular/writing-stories/parameters). To opt out of the new renderer, add the following to `.storybook/preview.ts`:

```ts
export const parameters = {
  angularLegacyRendering: true,
};
```

Please also file an issue if you need to opt out. We plan to remove the legacy renderer in 7.0.

#### Components without selectors

When the new Angular renderer is used, all Angular Story components must either have a selector, or be added to the `entryComponents` array of the story's `moduleMetadata`. If the component has any `Input`s or `Output`s to be controlled with `args`, a selector should be added.

### Packages now available as ESModules

Many Storybook packages are now available as ESModules in addition to CommonJS. If your jest tests stop working, this is likely why. One common culprit is doc blocks, which [is fixed in 6.3](#deprecated-scoped-blocks-imports). In 6.2, you can configure jest to transform the packages like so ([more info](https://jestjs.io/docs/configuration#transformignorepatterns-arraystring)):

```json
// In your jest config
transformIgnorePatterns: ['/node_modules/(?!@storybook)']
```

### 6.2 Deprecations

#### Deprecated implicit PostCSS loader

Previously, `@storybook/core` would automatically add the `postcss-loader` to your preview. This caused issues for consumers when PostCSS upgraded to v8 and tools, like Autoprefixer and Tailwind, starting requiring the new version. Implicitly adding `postcss-loader` will be removed in Storybook 7.0.

Instead of continuing to include PostCSS inside the core library, it has been moved to [`@storybook/addon-postcss`](https://github.com/storybookjs/addon-postcss). This addon provides more fine-grained customization and will be upgraded more flexibly to track PostCSS upgrades.

If you require PostCSS support, please install `@storybook/addon-postcss` in your project, add it to your list of addons inside `.storybook/main.js`, and configure a `postcss.config.js` file.

Further information is available at <https://github.com/storybookjs/storybook/issues/12668> and <https://github.com/storybookjs/storybook/pull/13669>.

If you're not using Postcss and you don't want to see the warning, you can disable it by adding the following to your `.storybook/main.js`:

```js
module.exports = {
  features: {
    postcss: false,
  },
};
```

#### Deprecated default PostCSS plugins

When relying on the [implicit PostCSS loader](#deprecated-implicit-postcss-loader), it would also add [autoprefixer v9](https://www.npmjs.com/package/autoprefixer/v/9.8.6) and [postcss-flexbugs-fixes v4](https://www.npmjs.com/package/postcss-flexbugs-fixes/v/4.2.1) plugins to the `postcss-loader` configuration when you didn't have a PostCSS config file (such as `postcss.config.js`) within your project.

They will no longer be applied when switching to `@storybook/addon-postcss` and the implicit PostCSS features will be removed in Storybook 7.0.

If you depend upon these plugins being applied, install them and create a `postcss.config.js` file within your project that contains:

```js
module.exports = {
  plugins: [
    require('postcss-flexbugs-fixes'),
    require('autoprefixer')({
      flexbox: 'no-2009',
    }),
  ],
};
```

#### Deprecated showRoots config option

Config options for the sidebar are now under the `sidebar` namespace. The `showRoots` option should be set as follows:

```js
addons.setConfig({
  sidebar: {
    showRoots: false,
  },
  // showRoots: false   <- this is deprecated
});
```

The top-level `showRoots` option will be removed in Storybook 7.0.

#### Deprecated control.options

Possible `options` for a radio/check/select controls has been moved up to the argType level, and no longer accepts an object. Instead, you should specify `options` as an array. You can use `control.labels` to customize labels. Additionally, you can use a `mapping` to deal with complex values.

```js
argTypes: {
  answer:
    options: ['yes', 'no'],
    mapping: {
      yes: <Check />,
      no: <Cross />,
    },
    control: {
      type: 'radio',
      labels: {
        yes: 'да',
        no: 'нет',
      }
    }
  }
}
```

Keys in `control.labels` as well as in `mapping` should match the values in `options`. Neither object has to be exhaustive, in case of a missing property, the option value will be used directly.

If you are currently using an object as value for `control.options`, be aware that the key and value are reversed in `control.labels`.

#### Deprecated storybook components html entry point

Storybook HTML components are now exported directly from '@storybook/components' for better ESM and Typescript compatibility. The old entry point will be removed in SB 7.0.

```js
// before
import { components } from '@storybook/components/html';

// after
import { components } from '@storybook/components';
```

## From version 6.0.x to 6.1.0

### Addon-backgrounds preset

In 6.1 we introduced an unintentional breaking change to `addon-backgrounds`.

The addon uses decorators which are set up automatically by a preset. The required preset is ignored if you register the addon in `main.js` with the `/register` entry point. This used to be valid in `v6.0.x` and earlier:

```js
module.exports = {
  stories: ['../**/*.stories.js'],
  addons: ['@storybook/addon-backgrounds/register'],
};
```

To fix it, just replace `@storybook/addon-backgrounds/register` with `@storybook/addon-backgrounds`:

```js
module.exports = {
  stories: ['../**/*.stories.js'],
  addons: ['@storybook/addon-backgrounds'],
};
```

### Single story hoisting

Stories which have **no siblings** (i.e. the component has only one story) and which name **exactly matches** the component name will now be hoisted up to replace their parent component in the sidebar. This means you can have a hierarchy like this:

```
DESIGN SYSTEM   [root]
- Atoms         [group]
  - Button      [component]
    - Button    [story]
  - Checkbox    [component]
    - Checkbox  [story]
```

This will then be visually presented in the sidebar like this:

```
DESIGN SYSTEM   [root]
- Atoms         [group]
  - Button      [story]
  - Checkbox    [story]
```

See [Naming components and hierarchy](https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting) for details.

### React peer dependencies

Starting in 6.1, `react` and `react-dom` are required peer dependencies of `@storybook/react`, meaning that if your React project does not have dependencies on them, you need to add them as `devDependencies`. If you don't you'll see errors like this:

```
Error: Cannot find module 'react-dom/package.json'
```

They were also peer dependencies in earlier versions, but due to the package structure they would be installed by Storybook if they were not required by the user's project. For more discussion: <https://github.com/storybookjs/storybook/issues/13269>

### 6.1 deprecations

#### Deprecated DLL flags

Earlier versions of Storybook used Webpack DLLs as a performance crutch. In 6.1, we've removed Storybook's built-in DLLs and have deprecated the command-line parameters `--no-dll` and `--ui-dll`. They will be removed in 7.0.

#### Deprecated storyFn

Each item in the story store contains a field called `storyFn`, which is a fully decorated story that's applied to the denormalized story parameters. Starting in 6.0 we've stopped using this API internally, and have replaced it with a new field called `unboundStoryFn` which, unlike `storyFn`, must passed a story context, typically produced by `applyLoaders`;

Before:

```js
const { storyFn } = store.fromId('some--id');
console.log(storyFn());
```

After:

```js
const { unboundStoryFn, applyLoaders } = store.fromId('some--id');
const context = await applyLoaders();
console.log(unboundStoryFn(context));
```

If you're not using loaders, `storyFn` will work as before. If you are, you'll need to use the new approach.

> NOTE: If you're using `@storybook/addon-docs`, this deprecation warning is triggered by the Docs tab in 6.1. It's safe to ignore and we will be providing a proper fix in a future release. You can track the issue at <https://github.com/storybookjs/storybook/issues/13074>.

#### Deprecated onBeforeRender

The `@storybook/addon-docs` previously accepted a `jsx` option called `onBeforeRender`, which was unfortunately named as it was called after the render.

We've renamed it `transformSource` and also allowed it to receive the `StoryContext` in case source rendering requires additional information.

#### Deprecated grid parameter

Previously when using `@storybook/addon-backgrounds` if you wanted to customize the grid, you would define a parameter like this:

```js
export const Basic = () => <Button />
Basic.parameters: {
  grid: {
    cellSize: 10
  }
},
```

As grid is not an addon, but rather backgrounds is, the grid configuration was moved to be inside `backgrounds` parameter instead. Also, there are new properties that can be used to further customize the grid. Here's an example with the default values:

```js
export const Basic = () => <Button />
Basic.parameters: {
  backgrounds: {
    grid: {
      disable: false,
      cellSize: 20,
      opacity: 0.5,
      cellAmount: 5,
      offsetX: 16, // default is 0 if story has 'fullscreen' layout, 16 if layout is 'padded'
      offsetY: 16, // default is 0 if story has 'fullscreen' layout, 16 if layout is 'padded'
    }
  }
},
```

#### Deprecated package-composition disabled parameter

Like [Deprecated disabled parameter](#deprecated-disabled-parameter). The `disabled` parameter has been deprecated, please use `disable` instead.

For more information, see the [the related documentation](https://storybook.js.org/docs/react/workflows/package-composition#configuring).

## From version 5.3.x to 6.0.x

### Hoisted CSF annotations

Storybook 6 introduces hoisted CSF annotations and deprecates the `StoryFn.story` object-style annotation.

In 5.x CSF, you would annotate a story like this:

```js
export const Basic = () => <Button />
Basic.story = {
  name: 'foo',
  parameters: { ... },
  decorators: [ ... ],
};
```

In 6.0 CSF this becomes:

```js
export const Basic = () => <Button />
Basic.storyName = 'foo';
Basic.parameters = { ... };
Basic.decorators = [ ... ];
```

1. The new syntax is slightly more compact/ergonomic compared the the old one
2. Similar to React's `displayName`, `propTypes`, `defaultProps` annotations
3. We're introducing a new feature, [Storybook Args](https://docs.google.com/document/d/1Mhp1UFRCKCsN8pjlfPdz8ZdisgjNXeMXpXvGoALjxYM/edit?usp=sharing), where the new syntax will be significantly more ergonomic

To help you upgrade your stories, we've created a codemod:

```
npx @storybook/cli@next migrate csf-hoist-story-annotations --glob="**/*.stories.js"
```

For more information, [see the documentation](https://github.com/storybookjs/storybook/blob/next/lib/codemod/README.md#csf-hoist-story-annotations).

### Zero config typescript

Storybook has built-in Typescript support in 6.0. That means you should remove your complex Typescript configurations from your `.storybook` config. We've tried to pick sensible defaults that work out of the box, especially for nice prop table generation in `@storybook/addon-docs`.

To migrate from an old setup, we recommend deleting any typescript-specific webpack/babel configurations in your project. You should also remove `@storybook/preset-typescript`, which is superceded by the built-in configuration.

If you want to override the defaults, see the [typescript configuration docs](https://storybook.js.org/docs/react/configure/typescript).

### Correct globs in main.js

In 5.3 we introduced the `main.js` file with a `stories` property. This property was documented as a "glob" pattern. This was our intention, however the implementation allowed for non valid globs to be specified and work. In fact, we promoted invalid globs in our documentation and CLI templates.

We've corrected this, the CLI templates have been changed to use valid globs.

We've also changed the code that resolves these globs, so that invalid globs will log a warning. They will break in the future, so if you see this warning, please ensure you're specifying a valid glob.

Example of an **invalid** glob:

```
stories: ['./**/*.stories.(ts|js)']
```

Example of a **valid** glob:

```
stories: ['./**/*.stories.@(ts|js)']
```

### CRA preset removed

The built-in create-react-app preset, which was [previously deprecated](#create-react-app-preset), has been fully removed.

If you're using CRA and migrating from an earlier Storybook version, please install [`@storybook/preset-create-react-app`](https://github.com/storybookjs/presets/tree/master/packages/preset-create-react-app) if you haven't already.

### Core-JS dependency errors

Some users have experienced `core-js` dependency errors when upgrading to 6.0, such as:

```
Module not found: Error: Can't resolve 'core-js/modules/web.dom-collections.iterator'
```

We think this comes from having multiple versions of `core-js` installed, but haven't isolated a good solution (see [#11255](https://github.com/storybookjs/storybook/issues/11255) for discussion).

For now, the workaround is to install `core-js` directly in your project as a dev dependency:

```sh
npm install core-js@^3.0.1 --save-dev
```

### Args passed as first argument to story

Starting in 6.0, the first argument to a story function is an [Args object](https://storybook.js.org/docs/react/api/csf#args-story-inputs). In 5.3 and earlier, the first argument was a [StoryContext](https://github.com/storybookjs/storybook/blob/next/lib/addons/src/types.ts#L49-L61), and that context is now passed as the second argument by default.

This breaking change only affects you if your stories actually use the context, which is not common. If you have any stories that use the context, you can either (1) update your stories, or (2) set a flag to opt-out of new behavior.

Consider the following story that uses the context:

```js
export const Dummy = ({ parameters }) => <div>{JSON.stringify(parameters)}</div>;
```

Here's an updated story for 6.0 that ignores the args object:

```js
export const Dummy = (_args, { parameters }) => <div>{JSON.stringify(parameters)}</div>;
```

Alternatively, if you want to opt out of the new behavior, you can add the following to your `.storybook/preview.js` config:

```js
export const parameters = {
  passArgsFirst: false,
};
```

### 6.0 Docs breaking changes

#### Remove framework-specific docs presets

In SB 5.2, each framework had its own preset, e.g. `@storybook/addon-docs/react/preset`. In 5.3 we [unified this into a single preset](#unified-docs-preset): `@storybook/addon-docs/preset`. In 6.0 we've removed the deprecated preset.

#### Preview/Props renamed

In 6.0 we renamed `Preview` to `Canvas`, `Props` to `ArgsTable`. The change should be otherwise backwards-compatible.

#### Docs theme separated

In 6.0, you should theme Storybook Docs with the `docs.theme` parameter.

In 5.x, the Storybook UI and Storybook Docs were themed using the same theme object. However, in 5.3 we introduced a new API, `addons.setConfig`, which improved UI theming but broke Docs theming. Rather than trying to keep the two unified, we introduced a separate theming mechanism for docs, `docs.theme`. [Read about Docs theming here](https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/theming.md#storybook-theming).

#### DocsPage slots removed

In SB5.2, we introduced the concept of [DocsPage slots](https://github.com/storybookjs/storybook/blob/0de8575eab73bfd5c5c7ba5fe33e53a49b92db3a/addons/docs/docs/docspage.md#docspage-slots) for customizing the DocsPage.

In 5.3, we introduced `docs.x` story parameters like `docs.prepareForInline` which get filled in by frameworks and can also be overwritten by users, which is a more natural/convenient way to make global customizations.

We also introduced [Custom DocsPage](https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/docspage.md#replacing-docspage), which makes it possible to add/remove/update DocBlocks on the page.

These mechanisms are superior to slots, so we've removed slots in 6.0. For each slot, we provide a migration path here:

| Slot        | Slot function     | Replacement                                  |
| ----------- | ----------------- | -------------------------------------------- |
| Title       | `titleSlot`       | Custom DocsPage                              |
| Subtitle    | `subtitleSlot`    | Custom DocsPage                              |
| Description | `descriptionSlot` | `docs.extractComponentDescription` parameter |
| Primary     | `primarySlot`     | Custom DocsPage                              |
| Props       | `propsSlot`       | `docs.extractProps` parameter                |
| Stories     | `storiesSlot`     | Custom DocsPage                              |

#### React prop tables with Typescript

Props handling in React has changed in 6.0 and should be much less error-prone. This is not a breaking change per se, but documenting the change here since this is an area that has a lot of issues and we've gone back and forth on it.

Starting in 6.0, we have [zero-config typescript support](#zero-config-typescript). The out-of-box experience should be much better now, since the default configuration is designed to work well with `addon-docs`.

There are also two typescript handling options that can be set in `.storybook/main.js`. `react-docgen-typescript` (default) and `react-docgen`. This is [discussed in detail in the docs](https://github.com/storybookjs/storybook/blob/next/addons/docs/react/README.md#typescript-props-with-react-docgen).

#### ConfigureJSX true by default in React

In SB 6.0, the Storybook Docs preset option `configureJSX` is now set to `true` for all React projects. It was previously `false` by default for React only in 5.x). This `configureJSX` option adds `@babel/plugin-transform-react-jsx`, to process the output of the MDX compiler, which should be a safe change for all projects.

If you need to restore the old JSX handling behavior, you can configure `.storybook/main.js`:

```js
module.exports = {
  addons: [
    {
      name: '@storybook/addon-docs',
      options: { configureJSX: false },
    },
  ],
};
```

#### User babelrc disabled by default in MDX

In SB 6.0, the Storybook Docs no longer applies the user's babelrc by default when processing MDX files. It caused lots of hard-to-diagnose bugs.

To restore the old behavior, or pass any MDX-specific babel options, you can configure `.storybook/main.js`:

```js
module.exports = {
  addons: [
    {
      name: '@storybook/addon-docs',
      options: { mdxBabelOptions: { babelrc: true, configFile: true } },
    },
  ],
};
```

#### Docs description parameter

In 6.0, you can customize a component description using the `docs.description.component` parameter, and a story description using `docs.description.story` parameter.

Example:

```js
import { Button } from './Button';

export default {
  title: 'Button'
  parameters: { docs: { description: { component: 'some component **markdown**' }}}
}

export const Basic = () => <Button />
Basic.parameters = { docs: { description: { story: 'some story **markdown**' }}}
```

In 5.3 you customized a story description with the `docs.storyDescription` parameter. This has been deprecated, and support will be removed in 7.0.

#### 6.0 Inline stories

The following frameworks now render stories inline on the Docs tab by default, rather than in an iframe: `react`, `vue`, `web-components`, `html`.

To disable inline rendering, set the `docs.inlineStories` parameter to `false`.

### New addon presets

In Storybook 5.3 we introduced a declarative [main.js configuration](#to-mainjs-configuration), which is now the recommended way to configure Storybook. Part of the change is a simplified syntax for registering addons, which in 6.0 automatically registers many addons _using a preset_, which is a slightly different behavior than in earlier versions.

This breaking change currently applies to: `addon-a11y`, `addon-actions`, `addon-knobs`, `addon-links`, `addon-queryparams`.

Consider the following `main.js` config for `addon-knobs`:

```js
module.exports = {
  stories: ['../**/*.stories.js'],
  addons: ['@storybook/addon-knobs'],
};
```

In earlier versions of Storybook, this would automatically call `@storybook/addon-knobs/register`, which adds the the knobs panel to the Storybook UI. As a user you would also add a decorator:

```js
import { withKnobs } from '../index';

addDecorator(withKnobs);
```

Now in 6.0, `addon-knobs` comes with a preset, `@storybook/addon-knobs/preset`, that does this automatically for you. This change simplifies configuration, since now you don't need to add that decorator.

If you wish to disable this new behavior, you can modify your `main.js` to force it to use the `register` logic rather than the `preset`:

```js
module.exports = {
  stories: ['../**/*.stories.js'],
  addons: ['@storybook/addon-knobs/register'],
};
```

If you wish to selectively disable `knobs` checks for a subset of stories, you can control this with story parameters:

```js
export const MyNonCheckedStory = () => <SomeComponent />;
MyNonCheckedStory.story = {
  parameters: {
    knobs: { disable: true },
  },
};
```

### Removed babel-preset-vue from Vue preset

`babel-preset-vue` is not included by default anymore when using Storybook with Vue.
This preset is outdated and [caused problems](https://github.com/storybookjs/storybook/issues/4475) with more modern setups.

If you have an older Vue setup that relied on this preset, make sure it is included in your babel config
(install `babel-preset-vue` and add it to the presets).

```json
{
  "presets": ["babel-preset-vue"]
}
```

However, please take a moment to review why this preset is necessary in your setup.
One usecase used to be to enable JSX in your stories. For this case, we recommend to use `@vue/babel-preset-jsx` instead.

### Removed Deprecated APIs

In 6.0 we removed a number of APIs that were previously deprecated.

See the migration guides for further details:

- [Addon a11y uses parameters, decorator renamed](#addon-a11y-uses-parameters-decorator-renamed)
- [Addon backgrounds uses parameters](#addon-backgrounds-uses-parameters)
- [Source-loader](#source-loader)
- [Unified docs preset](#unified-docs-preset)
- [Addon centered decorator deprecated](#addon-centered-decorator-deprecated)

### New setStories event

The `setStories`/`SET_STORIES` event has changed and now denormalizes global and kind-level parameters. The new format of the event data is:

```js
{
  globalParameters: { p: 'q' },
  kindParameters: { kind: { p: 'q' } },
  stories: /* as before but with only story-level parameters */
}
```

If you want the full denormalized parameters for a story, you can do something like:

```js
import { combineParameters } from '@storybook/api';

const story = data.stories[storyId];
const parameters = combineParameters(
  data.globalParameters,
  data.kindParameters[story.kind],
  story.parameters
);
```

### Removed renderCurrentStory event

The story store no longer emits `renderCurrentStory`/`RENDER_CURRENT_STORY` to tell the renderer to render the story. Instead it emits a new declarative `CURRENT_STORY_WAS_SET` (in response to the existing `SET_CURRENT_STORY`) which is used to decide to render.

### Removed hierarchy separators

We've removed the ability to specify the hierarchy separators (how you control the grouping of story kinds in the sidebar). From Storybook 6.0 we have a single separator `/`, which cannot be configured.

If you are currently using custom separators, we encourage you to migrate to using `/` as the sole separator. If you are using `|` or `.` as a separator currently, we provide a codemod, [`upgrade-hierarchy-separators`](https://github.com/storybookjs/storybook/blob/next/lib/codemod/README.md#upgrade-hierarchy-separators), that can be used to rename your components. **Note: the codemod will not work for `.mdx` components, you will need to make the changes by hand.**

```
npx sb@next migrate upgrade-hierarchy-separators --glob="*/**/*.stories.@(tsx|jsx|ts|js)"
```

We also now default to showing "roots", which are non-expandable groupings in the sidebar for the top-level groups. If you'd like to disable this, set the `showRoots` option in `.storybook/manager.js`:

```js
import { addons } from '@storybook/addons';

addons.setConfig({
  showRoots: false,
});
```

### No longer pass denormalized parameters to storySort

The `storySort` function (set via the `parameters.options.storySort` parameter) previously compared two entries `[storyId, storeItem]`, where `storeItem` included the full "denormalized" set of parameters of the story (i.e. the global, kind and story parameters that applied to that story).

For performance reasons, we now store the parameters uncombined, and so pass the format: `[storyId, storeItem, kindParameters, globalParameters]`.

### Client API changes

#### Removed Legacy Story APIs

In 6.0 we removed a set of APIs from the underlying `StoryStore` (which wasn't publicly accessible):

- `getStories`, `getStoryFileName`, `getStoryAndParameters`, `getStory`, `getStoryWithContext`, `hasStoryKind`, `hasStory`, `dumpStoryBook`, `size`, `clean`

Although these were private APIs, if you were using them, you could probably use the newer APIs (which are still private): `getStoriesForKind`, `getRawStory`, `removeStoryKind`, `remove`.

#### Can no longer add decorators/parameters after stories

You can no longer add decorators and parameters globally after you added your first story, and you can no longer add decorators and parameters to a kind after you've added your first story to it.

It's unclear and confusing what would happened if you did. If you want to disable a decorator for certain stories, use a parameter to do so:

```js
export StoryOne = ...;
StoryOne.story = { parameters: { addon: { disable: true } } };
```

If you want to use a parameter for a subset of stories in a kind, simply use a variable to do so:

```js
const commonParameters = { x: { y: 'z' } };
export StoryOne = ...;
StoryOne.story = { parameters: { ...commonParameters, other: 'things' } };
```

> NOTE: also the use of `addParameters` and `addDecorator` at arbitrary points is also deprecated, see [the deprecation warning](#deprecated-addparameters-and-adddecorator).

#### Changed Parameter Handling

There have been a few rationalizations of parameter handling in 6.0 to make things more predictable and fit better with the intention of parameters:

_All parameters are now merged recursively to arbitrary depth._

In 5.3 we sometimes merged parameters all the way down and sometimes did not depending on where you added them. It was confusing. If you were relying on this behaviour, let us know.

_Array parameters are no longer "merged"._

If you override an array parameter, the override will be the end product. If you want the old behaviour (appending a new value to an array parameter), export the original and use array spread. This will give you maximum flexibility:

```js
import { allBackgrounds } from './util/allBackgrounds';

export StoryOne = ...;
StoryOne.story = { parameters: { backgrounds: [...allBackgrounds, '#zyx' ] } };
```

_You cannot set parameters from decorators_

Parameters are intended to be statically set at story load time. So setting them via a decorator doesn't quite make sense. If you were using this to control the rendering of a story, chances are using the new `args` feature is a more idiomatic way to do this.

_You can only set storySort globally_

If you want to change the ordering of stories, use `export const parameters = { options: { storySort: ... } }` in `preview.js`.

### Simplified Render Context

The `RenderContext` that is passed to framework rendering layers in order to render a story has been simplified, dropping a few members that were not used by frameworks to render stories. In particular, the following have been removed:

- `selectedKind`/`selectedStory` -- replaced by `kind`/`name`
- `configApi`
- `storyStore`
- `channel`
- `clientApi`

### Story Store immutable outside of configuration

You can no longer change the contents of the StoryStore outside of a `configure()` call. This is to ensure that any changes are properly published to the manager. If you want to add stories "out of band" you can call `store.startConfiguring()` and `store.finishConfiguring()` to ensure that your changes are published.

### Improved story source handling

The story source code handling has been improved in both `addon-storysource` and `addon-docs`.

In 5.x some users used an undocumented _internal_ API, `mdxSource` to customize source snippetization in `addon-docs`. This has been removed in 6.0.

The preferred way to customize source snippets for stories is now:

```js
export const Example = () => <Button />;
Example.story = {
  parameters: {
    storySource: {
      source: 'custom source',
    },
  },
};
```

The MDX analog:

```jsx
<Story name="Example" parameters={{ storySource: { source: 'custom source' } }}>
  <Button />
</Story>
```

### 6.0 Addon API changes

#### Consistent local addon paths in main.js

If you use `.storybook/main.js` config and have locally-defined addons in your project, you need to update your file paths.

In 5.3, `addons` paths were relative to the project root, which was inconsistent with `stories` paths, which were relative to the `.storybook` folder. In 6.0, addon paths are now relative to the config folder.

So, for example, if you had:

```js
module.exports = { addons: ['./.storybook/my-local-addon/register'] };
```

You'd need to update this to:

```js
module.exports = { addons: ['./my-local-addon/register'] };
```

#### Deprecated setAddon

We've deprecated the `setAddon` method of the `storiesOf` API and plan to remove it in 7.0.

Since early versions, Storybook shipped with a `setAddon` API, which allows you to extend `storiesOf` with arbitrary code. We've removed this from all core addons long ago and recommend writing stories in [Component Story Format](https://medium.com/storybookjs/component-story-format-66f4c32366df) rather than using the internal Storybook API.

#### Deprecated disabled parameter

Starting in 6.0.17, we've renamed the `disabled` parameter to `disable` to resolve an inconsistency where `disabled` had been used to hide the addon panel, whereas `disable` had been used to disable an addon's execution. Since `disable` was much more widespread in the code, we standardized on that.

So, for example:

```
Story.parameters = { actions: { disabled: true } }
```

Should be rewritten as:

```
Story.parameters = { actions: { disable: true } }
```

#### Actions addon uses parameters

Leveraging the new preset `@storybook/addon-actions` uses parameters to pass action options. If you previously had:

```js
import { withActions } from `@storybook/addon-actions`;

export StoryOne = ...;
StoryOne.story = {
  decorators: [withActions('mouseover', 'click .btn')],
}

```

You should replace it with:

```js
export StoryOne = ...;
StoryOne.story = {
  parameters: { actions: ['mouseover', 'click .btn'] },
}
```

#### Removed action decorator APIs

In 6.0 we removed the actions addon decorate API. Actions handles can be configured globally, for a collection of stories or per story via parameters. The ability to manipulate the data arguments of an event is only relevant in a few frameworks and is not a common enough usecase to be worth the complexity of supporting.

#### Removed withA11y decorator

In 6.0 we removed the `withA11y` decorator. The code that runs accessibility checks is now directly injected in the preview.

To configure a11y now, you have to specify configuration using story parameters, e.g. in `.storybook/preview.js`:

```js
export const parameters = {
  a11y: {
    element: '#storybook-root',
    config: {},
    options: {},
    manual: true,
  },
};
```

#### Essentials addon disables differently

In 6.0, `addon-essentials` doesn't configure addons if the user has already configured them in `main.js`. In 5.3 it previously checked to see whether the package had been installed in `package.json` to disable configuration. The new setup is preferably because now users' can install essential packages and import from them without disabling their configuration.

#### Backgrounds addon has a new api

Starting in 6.0, the backgrounds addon now receives an object instead of an array as parameter, with a property to define the default background.

Consider the following example of its usage in `Button.stories.js`:

```jsx
// Button.stories.js
export default {
  title: 'Button',
  parameters: {
    backgrounds: [
      { name: 'twitter', value: '#00aced', default: true },
      { name: 'facebook', value: '#3b5998' },
    ],
  },
};
```

Here's an updated version of the example, using the new api:

```jsx
// Button.stories.js
export default {
  title: 'Button',
  parameters: {
    backgrounds: {
      default: 'twitter',
      values: [
        { name: 'twitter', value: '#00aced' },
        { name: 'facebook', value: '#3b5998' },
      ],
    },
  },
};
```

In addition, backgrounds now ships with the following defaults:

- no selected background (transparent)
- light/dark options

### 6.0 Deprecations

We've deprecated the following in 6.0: `addon-info`, `addon-notes`, `addon-contexts`, `addon-centered`, `polymer`.

#### Deprecated addon-info, addon-notes

The info/notes addons have been replaced by [addon-docs](https://github.com/storybookjs/storybook/tree/next/addons/docs). We've documented a migration in the [docs recipes](https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md#migrating-from-notesinfo-addons).

Both addons are still widely used, and their source code is still available in the [deprecated-addons repo](https://github.com/storybookjs/deprecated-addons). We're looking for maintainers for both addons. If you're interested, please get in touch on [our Discord](https://discord.gg/storybook).

#### Deprecated addon-contexts

The contexts addon has been replaced by [addon-toolbars](https://github.com/storybookjs/storybook/blob/next/addons/toolbars), which is simpler, more ergonomic, and compatible with all Storybook frameworks.

The addon's source code is still available in the [deprecated-addons repo](https://github.com/storybookjs/deprecated-addons). If you're interested in maintaining it, please get in touch on [our Discord](https://discord.gg/storybook).

#### Removed addon-centered

In 6.0 we removed the centered addon. Centering is now core feature of storybook, so we no longer need an addon.

Remove the addon-centered decorator and instead add a `layout` parameter:

```js
export const MyStory = () => <div>my story</div>;
MyStory.story = {
  parameters: { layout: 'centered' },
};
```

Other possible values are: `padded` (default) and `fullscreen`.

#### Deprecated polymer

We've deprecated `@storybook/polymer` and are focusing on `@storybook/web-components`. If you use Polymer and are interested in maintaining it, please get in touch on [our Discord](https://discord.gg/storybook).

#### Deprecated immutable options parameters

The UI options `sidebarAnimations`, `enableShortcuts`, `theme`, `showRoots` should not be changed on a per-story basis, and as such there is no reason to set them via parameters.

You should use `addon.setConfig` to set them:

```js
// in .storybook/manager.js
import { addons } from '@storybook/addons';

addons.setConfig({
  showRoots: false,
});
```

#### Deprecated addParameters and addDecorator

The `addParameters` and `addDecorator` APIs to add global decorators and parameters, exported by the various frameworks (e.g. `@storybook/react`) and `@storybook/client` are now deprecated.

Instead, use `export const parameters = {};` and `export const decorators = [];` in your `.storybook/preview.js`. Addon authors similarly should use such an export in a preview entry file (see [Preview entries](https://github.com/storybookjs/storybook/blob/next/docs/api/writing-presets.md#preview-entries)).

#### Deprecated clearDecorators

Similarly, `clearDecorators`, exported by the various frameworks (e.g. `@storybook/react`) is deprecated.

#### Deprecated configure

The `configure` API to load stories from `preview.js`, exported by the various frameworks (e.g. `@storybook/react`) is now deprecated.

To load stories, use the `stories` field in `main.js`. You can pass a glob or array of globs to load stories like so:

```js
// in .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.js'],
};
```

You can also pass an array of single file names if you want to be careful about loading files:

```js
// in .storybook/main.js
module.exports = {
  stories: [
    '../src/components/Button.stories.js',
    '../src/components/Table.stories.js',
    '../src/components/Page.stories.js',
  ],
};
```

#### Deprecated support for duplicate kinds

In 6.0 we deprecated the ability to split a kind's (component's) stories into multiple files because it was causing issues in hot module reloading (HMR). It will likely be removed completely in 7.0.

If you had N stories that contained `export default { title: 'foo/bar' }` (or the MDX equivalent `<Meta title="foo/bar">`), Storybook will now raise the warning `Duplicate title '${kindName}' used in multiple files`.

To split a component's stories into multiple files, e.g. for the `foo/bar` example above:

- Create a single file with the `export default { title: 'foo/bar' }` export, which is the primary file
- Comment out or delete the default export from the other files
- Re-export the stories from the other files in the primary file

So the primary example might look like:

```js
export default { title: 'foo/bar' };
export * from './Bar1.stories'
export * from './Bar2.stories'
export * from './Bar3.stories'

export const SomeStory = () => ...;
```

## From version 5.2.x to 5.3.x

### To main.js configuration

In storybook 5.3 3 new files for configuration were introduced, that replaced some previous files.

These files are now soft-deprecated, (_they still work, but over time we will promote users to migrate_):

- `presets.js` has been renamed to `main.js`. `main.js` is the main point of configuration for storybook.
- `config.js` has been renamed to `preview.js`. `preview.js` configures the "preview" iframe that renders your components.
- `addons.js` has been renamed to `manager.js`. `manager.js` configures Storybook's "manager" UI that wraps the preview, and also configures addons panel.

#### Using main.js

`main.js` is now the main point of configuration for Storybook. This is what a basic `main.js` looks like:

```js
module.exports = {
  stories: ['../**/*.stories.js'],
  addons: ['@storybook/addon-knobs'],
};
```

You remove all "register" import from `addons.js` and place them inside the array. You can also safely remove the `/register` suffix from these entries, for a cleaner, more readable configuration. If this means `addons.js` is now empty for you, it's safe to remove.

Next you remove the code that imports/requires all your stories from `config.js`, and change it to a glob-pattern and place that glob in the `stories` array. If this means `config.js` is empty, it's safe to remove.

If you had a `presets.js` file before you can add the array of presets to the main.js file and remove `presets.js` like so:

```js
module.exports = {
  stories: ['../**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    {
      name: '@storybook/addon-docs',
      options: { configureJSX: true },
    },
  ],
};
```

By default, adding a package to the `addons` array will first try to load its `preset` entry, then its `register` entry, and finally, it will just assume the package itself is a preset.

If you want to load a specific package entry, for example you want to use `@storybook/addon-docs/register`, you can also include that in the addons array and Storybook will do the right thing.

#### Using preview.js

If after migrating the imports/requires of your stories to `main.js` you're left with some code in `config.js` it's likely the usage of `addParameters` & `addDecorator`.

This is fine, rename `config.js` to `preview.js`.

This file can also be used to inject global stylesheets, fonts etc, into the preview bundle.

#### Using manager.js

If you are setting storybook options in `config.js`, especially `theme`, you should migrate it to `manager.js`:

```js
import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'My custom title',
});

addons.setConfig({
  panelPosition: 'bottom',
  theme,
});
```

This makes storybook load and use the theme in the manager directly.
This allows for richer theming in the future, and has a much better performance!

> If you're using addon-docs, you should probably not do this. Docs uses the theme as well, but this change makes the theme inaccessible to addon-docs. We'll address this in 6.0.0.

### Create React App preset

You can now move to the new preset for [Create React App](https://create-react-app.dev/). The in-built preset for Create React App will be disabled in Storybook 6.0.

Simply install [`@storybook/preset-create-react-app`](https://github.com/storybookjs/presets/tree/master/packages/preset-create-react-app) and it will be used automatically.

### Description doc block

In 5.3 we've changed `addon-docs`'s `Description` doc block's default behavior. Technically this is a breaking change, but MDX was not officially released in 5.2 and we reserved the right to make small breaking changes. The behavior of `DocsPage`, which was officially released, remains unchanged.

The old behavior of `<Description of={Component} />` was to concatenate the info parameter or notes parameter, if available, with the docgen information loaded from source comments. If you depend on the old behavior, it's still available with `<Description of={Component} type='legacy-5.2' />`. This description type will be removed in Storybook 6.0.

The new default behavior is to use the framework-specific description extractor, which for React/Vue is still docgen, but may come from other places (e.g. a JSON file) for other frameworks.

The description doc block on DocsPage has also been updated. To see how to configure it in 5.3, please see [the updated recipe](https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md#migrating-from-notesinfo-addons)

### React Native Async Storage

Starting from version React Native 0.59, Async Storage is deprecated in React Native itself. The new @react-native-async-storage/async-storage module requires native installation, and we don't want to have it as a dependency for React Native Storybook.

To avoid that now you have to manually pass asyncStorage to React Native Storybook with asyncStorage prop. To notify users we are displaying a warning about it.

Solution:

- Use `require('@react-native-async-storage/async-storage').default` for React Native v0.59 and above.
- Use `require('react-native').AsyncStorage` for React Native v0.58 or below.
- Use `null` to disable Async Storage completely.

```javascript
getStorybookUI({
  ...
  asyncStorage: require('@react-native-async-storage/async-storage').default || require('react-native').AsyncStorage || null
});
```

The benefit of using Async Storage is so that when users refresh the app, Storybook can open their last visited story.

### Deprecate displayName parameter

In 5.2, the story parameter `displayName` was introduced as a publicly visible (but internal) API. Storybook's Component Story Format (CSF) loader used it to modify a story's display name independent of the story's `name`/`id` (which were coupled).

In 5.3, the CSF loader decouples the story's `name`/`id`, which means that `displayName` is no longer necessary. Unfortunately, this is a breaking change for any code that uses the story `name` field. Storyshots relies on story `name`, and the appropriate migration is to simply update your snapshots. Apologies for the inconvenience!

### Unified docs preset

Addon-docs configuration gets simpler in 5.3. In 5.2, each framework had its own preset, e.g. `@storybook/addon-docs/react/preset`. Starting in 5.3, everybody should use `@storybook/addon-docs/preset`.

### Simplified hierarchy separators

We've deprecated the ability to specify the hierarchy separators (how you control the grouping of story kinds in the sidebar). From Storybook 6.0 we will have a single separator `/`, which cannot be configured.

If you are currently using custom separators, we encourage you to migrate to using `/` as the sole separator. If you are using `|` or `.` as a separator currently, we provide a codemod, [`upgrade-hierarchy-separators`](https://github.com/storybookjs/storybook/blob/next/lib/codemod/README.md#upgrade-hierarchy-separators), that can be used to rename all your components.

```
yarn sb migrate upgrade-hierarchy-separators --glob="*.stories.js"
```

If you were using `|` and wish to keep the "root" behavior, use the `showRoots: true` option to re-enable roots:

```js
addParameters({
  options: {
    showRoots: true,
  },
});
```

NOTE: it is no longer possible to have some stories with roots and others without. If you want to keep the old behavior, simply add a root called "Others" to all your previously unrooted stories.

### Addon StoryShots Puppeteer uses external puppeteer

To give you more control on the Chrome version used when running StoryShots Puppeteer, `puppeteer` is no more included in the addon dependencies. So you can now pick the version of `puppeteer` you want and set it in your project.

If you want the latest version available just run:

```sh
yarn add puppeteer --dev
OR
npm install puppeteer --save-dev
```

## From version 5.1.x to 5.2.x

### Source-loader

Addon-storysource contains a loader, `@storybook/addon-storysource/loader`, which has been deprecated in 5.2. If you use it, you'll see the warning:

```
@storybook/addon-storysource/loader is deprecated, please use @storybook/source-loader instead.
```

To upgrade to `@storybook/source-loader`, run `npm install -D @storybook/source-loader` (or use `yarn`), and replace every instance of `@storybook/addon-storysource/loader` with `@storybook/source-loader`.

### Default viewports

The default viewports have been reduced to a smaller set, we think is enough for most use cases.
You can get the old default back by adding the following to your `config.js`:

```js
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});
```

### Grid toolbar-feature

The grid feature in the toolbar has been relocated to [addon-background](https://github.com/storybookjs/storybook/tree/next/addons/backgrounds), follow the setup instructions on that addon to get the feature again.

### Docs mode docgen

This isn't a breaking change per se, because `addon-docs` is a new feature. However it's intended to replace `addon-info`, so if you're migrating from `addon-info` there are a few things you should know:

1. Support for only one prop table
2. Prop table docgen info should be stored on the component and not in the global variable `STORYBOOK_REACT_CLASSES` as before.

### storySort option

In 5.0.x the global option `sortStoriesByKind` option was [inadvertently removed](#sortstoriesbykind). In 5.2 we've introduced a new option, `storySort`, to replace it. `storySort` takes a comparator function, so it is strictly more powerful than `sortStoriesByKind`.

For example, here's how to sort by story ID using `storySort`:

```js
addParameters({
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
});
```

## From version 5.1.x to 5.1.10

### babel.config.js support

SB 5.1.0 added [support for project root `babel.config.js` files](https://github.com/storybookjs/storybook/pull/6634), which was an [unintentional breaking change](https://github.com/storybookjs/storybook/issues/7058#issuecomment-515398228). 5.1.10 fixes this, but if you relied on project root `babel.config.js` support, this bugfix is a breaking change. The workaround is to copy the file into your `.storybook` config directory. We may add back project-level support in 6.0.

## From version 5.0.x to 5.1.x

### React native server

Storybook 5.1 contains a major overhaul of `@storybook/react-native` as compared to 4.1 (we didn't ship a version of RN in 5.0 due to timing constraints). Storybook for RN consists of an an UI for browsing stories on-device or in a simulator, and an optional webserver which can also be used to browse stories and web addons.

5.1 refactors both pieces:

- `@storybook/react-native` no longer depends on the Storybook UI and only contains on-device functionality
- `@storybook/react-native-server` is a new package for those who wish to run a web server alongside their device UI

In addition, both packages share more code with the rest of Storybook, which will reduce bugs and increase compatibility (e.g. with the latest versions of babel, etc.).

As a user with an existing 4.1.x RN setup, no migration should be necessary to your RN app. Upgrading the library should be enough.

If you wish to run the optional web server, you will need to do the following migration:

- Add `babel-loader` as a dev dependency
- Add `@storybook/react-native-server` as a dev dependency
- Change your "storybook" `package.json` script from `storybook start [-p ...]` to `start-storybook [-p ...]`

And with that you should be good to go!

### Angular 7

Storybook 5.1 relies on `core-js@^3.0.0` and therefore causes a conflict with Angular 7 that relies on `core-js@^2.0.0`. In order to get Storybook running on Angular 7 you can either update to Angular 8 (which dropped `core-js` as a dependency) or follow these steps:

- Remove `node_modules/@storybook`
- `npm i core-js@^3.0.0` / `yarn add core-js@^3.0.0`
- Add the following paths to your `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "core-js/es7/reflect": ["node_modules/core-js/proposals/reflect-metadata"],
      "core-js/es6/*": ["node_modules/core-js/es"]
    }
  }
}
```

You should now be able to run Storybook and Angular 7 without any errors.

Reference issue: [https://github.com/angular/angular-cli/issues/13954](https://github.com/angular/angular-cli/issues/13954)

### CoreJS 3

Following the rest of the JS ecosystem, Storybook 5.1 upgrades [CoreJS](https://github.com/zloirock/core-js) 2 to 3, which is a breaking change.

This upgrade is problematic because many apps/libraries still rely on CoreJS 2, and many users get corejs-related errors due to bad resolution. To address this, we're using [corejs-upgrade-webpack-plugin](https://github.com/ndelangen/corejs-upgrade-webpack-plugin), which attempts to automatically upgrade code to CoreJS 3.

After a few iterations, this approach seems to be working. However, there are a few exceptions:

- If your app uses `babel-polyfill`, try to remove it

We'll update this section as we find more problem cases. If you have a `core-js` problem, please file an issue (preferably with a repro), and we'll do our best to get you sorted.

**Update**: [corejs-upgrade-webpack-plugin](https://github.com/ndelangen/corejs-upgrade-webpack-plugin) has been removed again after running into further issues as described in [https://github.com/storybookjs/storybook/issues/7445](https://github.com/storybookjs/storybook/issues/7445).

## From version 5.0.1 to 5.0.2

### Deprecate webpack extend mode

Exporting an object from your custom webpack config puts storybook in "extend mode".

There was a bad bug in `v5.0.0` involving webpack "extend mode" that caused webpack issues for users migrating from `4.x`. We've fixed this problem in `v5.0.2` but it means that extend-mode has a different behavior if you're migrating from `5.0.0` or `5.0.1`. In short, `4.x` extended a base config with the custom config, whereas `5.0.0-1` extended the base with a richer config object that could conflict with the custom config in different ways from `4.x`.

We've also deprecated "extend mode" because it doesn't add a lot of value over "full control mode", but adds more code paths, documentation, user confusion etc. Starting in SB6.0 we will only support "full control mode" customization.

To migrate from extend-mode to full-control mode, if your extend-mode webpack config looks like this:

```js
module.exports = {
  module: {
    rules: [
      /* ... */
    ],
  },
};
```

In full control mode, you need modify the default config to have the rules of your liking:

```js
module.exports = ({ config }) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      /* your own rules "..." here and/or some subset of config.module.rules */
    ],
  },
});
```

Please refer to the [current custom webpack documentation](https://storybook.js.org/docs/react/configure/webpack) for more information on custom webpack config and to [Issue #6081](https://github.com/storybookjs/storybook/issues/6081) for more information about the change.

## From version 4.1.x to 5.0.x

Storybook 5.0 includes sweeping UI changes as well as changes to the addon API and custom webpack configuration. We've tried to keep backwards compatibility in most cases, but there are some notable exceptions documented below.

### sortStoriesByKind

In Storybook 5.0 we changed a lot of UI related code, and 1 oversight caused the `sortStoriesByKind` options to stop working.
We're working on providing a better way of sorting stories for now the feature has been removed. Stories appear in the order they are loaded.

If you're using webpack's `require.context` to load stories, you can sort the execution of requires:

```js
var context = require.context('../stories', true, /\.stories\.js$/);
var modules = context.keys();

// sort them
var sortedModules = modules.slice().sort((a, b) => {
  // sort the stories based on filename/path
  return a < b ? -1 : a > b ? 1 : 0;
});

// execute them
sortedModules.forEach((key) => {
  context(key);
});
```

### Webpack config simplification

The API for custom webpack configuration has been simplified in 5.0, but it's a breaking change. Storybook's "full control mode" for webpack allows you to override the webpack config with a function that returns a configuration object.

In Storybook 5 there is a single signature for full-control mode that takes a parameters object with the fields `config` and `mode`:

```js
module.exports = ({ config, mode }) => { config.module.rules.push(...); return config; }
```

In contrast, the 4.x configuration function accepted either two or three arguments (`(baseConfig, mode)`, or `(baseConfig, mode, defaultConfig)`). The `config` object in the 5.x signature is equivalent to 4.x's `defaultConfig`.

Please see the [current custom webpack documentation](https://storybook.js.org/docs/react/configure/webpack) for more information on custom webpack config.

### Theming overhaul

Theming has been rewritten in v5. If you used theming in v4, please consult the [theming docs](https://storybook.js.org/docs/react/configure/theming) to learn about the new API.

### Story hierarchy defaults

Storybook's UI contains a hierarchical tree of stories that can be configured by `hierarchySeparator` and `hierarchyRootSeparator` [options](https://github.com/storybookjs/deprecated-addons/blob/master/MIGRATION.md#options-addon-deprecated).

In Storybook 4.x the values defaulted to `null` for both of these options, so that there would be no hierarchy by default.

In 5.0, we now provide recommended defaults:

```js
{
  hierarchyRootSeparator: '|',
  hierarchySeparator: /\/|\./,
}
```

This means if you use the characters { `|`, `/`, `.` } in your story kinds it will trigger the story hierarchy to appear. For example `storiesOf('UI|Widgets/Basics/Button')` will create a story root called `UI` containing a `Widgets/Basics` group, containing a `Button` component.

If you wish to opt-out of this new behavior and restore the flat UI, set them back to `null` in your storybook config, or remove { `|`, `/`, `.` } from your story kinds:

```js
addParameters({
  options: {
    hierarchyRootSeparator: null,
    hierarchySeparator: null,
  },
});
```

### Options addon deprecated

In 4.x we added story parameters. In 5.x we've deprecated the options addon in favor of [global parameters](https://storybook.js.org/docs/react/configure/features-and-behavior), and we've also renamed some of the options in the process (though we're maintaining backwards compatibility until 6.0).

Here's an old configuration:

```js
addDecorator(
  withOptions({
    name: 'Storybook',
    url: 'https://storybook.js.org',
    goFullScreen: false,
    addonPanelInRight: true,
  })
);
```

And here's its new counterpart:

```js
import { create } from '@storybook/theming/create';
addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'Storybook',
      brandUrl: 'https://storybook.js.org',
      // To control appearance:
      // brandImage: 'http://url.of/some.svg',
    }),
    isFullscreen: false,
    panelPosition: 'right',
    isToolshown: true,
  },
});
```

Here is the mapping from old options to new:

| Old               | New              |
| ----------------- | ---------------- |
| name              | theme.brandTitle |
| url               | theme.brandUrl   |
| goFullScreen      | isFullscreen     |
| showStoriesPanel  | showNav          |
| showAddonPanel    | showPanel        |
| addonPanelInRight | panelPosition    |
| showSearchBox     |                  |
|                   | isToolshown      |

Storybook v5 removes the search dialog box in favor of a quick search in the navigation view, so `showSearchBox` has been removed.

Storybook v5 introduce a new tool bar above the story view and you can show\hide it with the new `isToolshown` option.

### Individual story decorators

The behavior of adding decorators to a kind has changed in SB5 ([#5781](https://github.com/storybookjs/storybook/issues/5781)).

In SB4 it was possible to add decorators to only a subset of the stories of a kind.

```js
storiesOf('Stories', module)
  .add('noncentered', () => 'Hello')
  .addDecorator(centered)
  .add('centered', () => 'Hello');
```

The semantics has changed in SB5 so that calling `addDecorator` on a kind adds a decorator to all its stories, no matter the order. So in the previous example, both stories would be centered.

To allow for a subset of the stories in a kind to be decorated, we've added the ability to add decorators to individual stories using parameters:

```js
storiesOf('Stories', module)
  .add('noncentered', () => 'Hello')
  .add('centered', () => 'Hello', { decorators: [centered] });
```

### Addon backgrounds uses parameters

Similarly, `@storybook/addon-backgrounds` uses parameters to pass background options. If you previously had:

```js
import { withBackgrounds } from `@storybook/addon-backgrounds`;

storiesOf('Stories', module)
  .addDecorator(withBackgrounds(options));
```

You should replace it with:

```js
storiesOf('Stories', module).addParameters({ backgrounds: options });
```

You can pass `backgrounds` parameters at the global level (via `addParameters` imported from `@storybook/react` et al.), and the story level (via the third argument to `.add()`).

### Addon cssresources name attribute renamed

In the options object for `@storybook/addon-cssresources`, the `name` attribute for each resource has been renamed to `id`. If you previously had:

```js
import { withCssResources } from '@storybook/addon-cssresources';
import { addDecorator } from '@storybook/react';

addDecorator(
  withCssResources({
    cssresources: [
      {
        name: `bluetheme`, // Previous
        code: `<style>body { background-color: lightblue; }</style>`,
        picked: false,
      },
    ],
  })
);
```

You should replace it with:

```js
import { withCssResources } from '@storybook/addon-cssresources';
import { addDecorator } from '@storybook/react';

addDecorator(
  withCssResources({
    cssresources: [
      {
        id: `bluetheme`, // Renamed
        code: `<style>body { background-color: lightblue; }</style>`,
        picked: false,
      },
    ],
  })
);
```

### Addon viewport uses parameters

Similarly, `@storybook/addon-viewport` uses parameters to pass viewport options. If you previously had:

```js
import { configureViewport } from `@storybook/addon-viewport`;

configureViewport(options);
```

You should replace it with:

```js
import { addParameters } from '@storybook/react'; // or others

addParameters({ viewport: options });
```

The `withViewport` decorator is also no longer supported and should be replaced with a parameter based API as above. Also the `onViewportChange` callback is no longer supported.

See the [viewport addon README](https://github.com/storybookjs/storybook/blob/master/addons/viewport/README.md) for more information.

### Addon a11y uses parameters, decorator renamed

Similarly, `@storybook/addon-a11y` uses parameters to pass a11y options. If you previously had:

```js
import { configureA11y } from `@storybook/addon-a11y`;

configureA11y(options);
```

You should replace it with:

```js
import { addParameters } from '@storybook/react'; // or others

addParameters({ a11y: options });
```

You can also pass `a11y` parameters at the component level (via `storiesOf(...).addParameters`), and the story level (via the third argument to `.add()`).

Furthermore, the decorator `checkA11y` has been deprecated and renamed to `withA11y` to make it consistent with other Storybook decorators.

See the [a11y addon README](https://github.com/storybookjs/storybook/blob/master/addons/a11y/README.md) for more information.

### Addon centered decorator deprecated

If you previously had:

```js
import centered from '@storybook/addon-centered';
```

You should replace it with the React or Vue version as appropriate

```js
import centered from '@storybook/addon-centered/react';
```

or

```js
import centered from '@storybook/addon-centered/vue';
```

### New keyboard shortcuts defaults

Storybook's keyboard shortcuts are updated in 5.0, but they are configurable via the menu so if you want to set them back you can:

| Shortcut               | Old         | New   |
| ---------------------- | ----------- | ----- |
| Toggle sidebar         | cmd-shift-X | S     |
| Toggle addons panel    | cmd-shift-Z | A     |
| Toggle addons position | cmd-shift-G | D     |
| Toggle fullscreen      | cmd-shift-F | F     |
| Next story             | cmd-shift-→ | alt-→ |
| Prev story             | cmd-shift-← | alt-← |
| Next component         |             | alt-↓ |
| Prev component         |             | alt-↑ |
| Search                 |             | /     |

### New URL structure

We've update Storybook's URL structure in 5.0. The old structure used URL parameters to save the UI state, resulting in long ugly URLs. v5 respects the old URL parameters, but largely does away with them.

The old structure encoded `selectedKind` and `selectedStory` among other parameters. Storybook v5 respects these parameters but will issue a deprecation message in the browser console warning of potential future removal.

The new URL structure looks like:

```
https://url-of-storybook?path=/story/<storyId>
```

The structure of `storyId` is a slugified `<selectedKind>--<selectedStory>` (slugified = lowercase, hyphen-separated). Each `storyId` must be unique. We plan to build more features into Storybook in upcoming versions based on this new structure.

### Rename of the `--secure` cli parameter to `--https`

Storybook for React Native's start commands & the Web versions' start command were a bit different, for no reason.
We've changed the start command for Reactnative to match the other.

This means that when you previously used the `--secure` flag like so:

```sh
start-storybook --secure
# or
start-storybook --s
```

You have to replace it with:

```sh
start-storybook --https
```

### Vue integration

The Vue integration was updated, so that every story returned from a story or decorator function is now being normalized with `Vue.extend` **and** is being wrapped by a functional component. Returning a string from a story or decorator function is still supported and is treated as a component with the returned string as the template.

Currently there is no recommended way of accessing the component options of a story inside a decorator.

## From version 4.0.x to 4.1.x

There are are a few migrations you should be aware of in 4.1, including one unintentionally breaking change for advanced addon usage.

### Private addon config

If your Storybook contains custom addons defined that are defined in your app (as opposed to installed from packages) and those addons rely on reconfiguring webpack/babel, Storybook 4.1 may break for you. There's a workaround [described in the issue](https://github.com/storybookjs/storybook/issues/4995), and we're working on official support in the next release.

### React 15.x

Storybook 4.1 supports React 15.x (which had been [lost in the 4.0 release](#react-163)). So if you've been blocked on upgrading, we've got you covered. You should be able to upgrade according to the 4.0 migration notes below, or following the [4.0 upgrade guide](https://medium.com/storybookjs/migrating-to-storybook-4-c65b19a03d2c).

## From version 3.4.x to 4.0.x

With 4.0 as our first major release in over a year, we've collected a lot of cleanup tasks. Most of the deprecations have been marked for months, so we hope that there will be no significant impact on your project. We've also created a [step-by-step guide to help you upgrade](https://medium.com/storybookjs/migrating-to-storybook-4-c65b19a03d2c).

### React 16.3+

Storybook uses [Emotion](https://emotion.sh/) for styling which currently requires React 16.3 and above.

If you're using Storybook for anything other than React, you probably don't need to worry about this.

However, if you're developing React components, this means you need to upgrade to 16.3 or higher to use Storybook 4.0.

> **NOTE:** This is a temporary requirement, and we plan to restore 15.x compatibility in a near-term 4.x release.

Also, here's the error you'll get if you're running an older version of React:

```

core.browser.esm.js:15 Uncaught TypeError: Object(...) is not a function
at Module../node_modules/@emotion/core/dist/core.browser.esm.js (core.browser.esm.js:15)
at **webpack_require** (bootstrap:724)
at fn (bootstrap:101)
at Module../node_modules/@emotion/styled-base/dist/styled-base.browser.esm.js (styled-base.browser.esm.js:1)
at **webpack_require** (bootstrap:724)
at fn (bootstrap:101)
at Module../node_modules/@emotion/styled/dist/styled.esm.js (styled.esm.js:1)
at **webpack_require** (bootstrap:724)
at fn (bootstrap:101)
at Object../node_modules/@storybook/components/dist/navigation/MenuLink.js (MenuLink.js:12)

```

### Generic addons

4.x introduces generic addon decorators that are not tied to specific view layers [#3555](https://github.com/storybookjs/storybook/pull/3555). So for example:

```js
import { number } from '@storybook/addon-knobs/react';
```

Becomes:

```js
import { number } from '@storybook/addon-knobs';
```

### Knobs select ordering

4.0 also reversed the order of addon-knob's `select` knob keys/values, which had been called `selectV2` prior to this breaking change. See the knobs [package README](https://github.com/storybookjs/storybook/blob/master/addons/knobs/README.md#select) for usage.

### Knobs URL parameters

Addon-knobs no longer updates the URL parameters interactively as you edit a knob. This is a UI change but it shouldn't break any code because old URLs are still supported.

In 3.x, editing knobs updated the URL parameters interactively. The implementation had performance and architectural problems. So in 4.0, we changed this to a "copy" button in the addon which generates a URL with the updated knob values and copies it to the clipboard.

### Keyboard shortcuts moved

- Addon Panel to `Z`
- Stories Panel to `X`
- Show Search to `O`
- Addon Panel right side to `G`

### Removed addWithInfo

`Addon-info`'s `addWithInfo` has been marked deprecated since 3.2. In 4.0 we've removed it completely. See the package [README](https://github.com/storybookjs/storybook/blob/master/addons/info/README.md) for the proper usage.

### Removed RN packager

Since storybook version v4.0 packager is removed from storybook. The suggested storybook usage is to include it inside your app.
If you want to keep the old behaviour, you have to start the packager yourself with a different project root.
`npm run storybook start -p 7007 | react-native start --projectRoot storybook`

Removed cli options: `--packager-port --root --projectRoots -r, --reset-cache --skip-packager --haul --platform --metro-config`

### Removed RN addons

The `@storybook/react-native` had built-in addons (`addon-actions` and `addon-links`) that have been marked as deprecated since 3.x. They have been fully removed in 4.x. If your project still uses the built-ins, you'll need to add explicit dependencies on `@storybook/addon-actions` and/or `@storybook/addon-links` and import directly from those packages.

### Storyshots Changes

1. `imageSnapshot` test function was extracted from `addon-storyshots`
   and moved to a new package - `addon-storyshots-puppeteer` that now will
   be dependant on puppeteer. [README](https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-puppeteer)
2. `getSnapshotFileName` export was replaced with the `Stories2SnapsConverter`
   class that now can be overridden for a custom implementation of the
   snapshot-name generation. [README](https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core#stories2snapsconverter)
3. Storybook that was configured with Webpack's `require.context()` feature
   will need to add a babel plugin to polyfill this functionality.
   A possible plugin might be [babel-plugin-require-context-hook](https://github.com/smrq/babel-plugin-require-context-hook).
   [README](https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core#configure-jest-to-work-with-webpacks-requirecontext)

### Webpack 4

Storybook now uses webpack 4. If you have a [custom webpack config](https://storybook.js.org/docs/react/configure/webpack), make sure that all the loaders and plugins you use support webpack 4.

### Babel 7

Storybook now uses Babel 7. There's a couple of cases when it can break with your app:

- If you aren't using Babel yourself, and don't have .babelrc, install following dependencies:

  ```
  npm i -D @babel/core babel-loader@next
  ```

- If you're using Babel 6, make sure that you have direct dependencies on `babel-core@6` and `babel-loader@7` and that you have a `.babelrc` in your project directory.

### Create-react-app

If you are using `create-react-app` (aka CRA), you may need to do some manual steps to upgrade, depending on the setup.

- `create-react-app@1` may require manual migrations.
  - If you're adding storybook for the first time: `sb init` should add the correct dependencies.
  - If you're upgrading an existing project, your `package.json` probably already uses Babel 6, making it incompatible with `@storybook/react@4` which uses Babel 7. There are two ways to make it compatible, each of which is spelled out in detail in the next section:
    - Upgrade to Babel 7 if you are not dependent on Babel 6-specific features.
    - Migrate Babel 6 if you're heavily dependent on some Babel 6-specific features).
- `create-react-app@2` should be compatible as is, since it uses babel 7.

#### Upgrade CRA1 to babel 7

```
yarn remove babel-core babel-runtime
yarn add @babel/core babel-loader --dev
```

#### Migrate CRA1 while keeping babel 6

```
yarn add babel-loader@7
```

Also, make sure you have a `.babelrc` in your project directory. You probably already do if you are using Babel 6 features (otherwise you should consider upgrading to Babel 7 instead). If you don't have one, here's one that works:

```json
{
  "presets": ["env", "react"]
}
```

### start-storybook opens browser

If you're using `start-storybook` on CI, you may need to opt out of this using the new `--ci` flag.

### CLI Rename

We've deprecated the `getstorybook` CLI in 4.0. The new way to install storybook is `sb init`. We recommend using `npx` for convenience and to make sure you're always using the latest version of the CLI:

```
npx -p @storybook/cli sb init
```

### Addon story parameters

Storybook 4 introduces story parameters, a more convenient way to configure how addons are configured.

```js
storiesOf('My component', module)
  .add('story1', withNotes('some notes')(() => <Component ... />))
  .add('story2', withNotes('other notes')(() => <Component ... />));
```

Becomes:

```js
// config.js
addDecorator(withNotes);

// Component.stories.js
storiesOf('My component', module)
  .add('story1', () => <Component ... />, { notes: 'some notes' })
  .add('story2', () => <Component ... />, { notes: 'other notes' });
```

This example applies notes globally to all stories. You can apply it locally with `storiesOf(...).addDecorator(withNotes)`.

The story parameters correspond directly to the old withX arguments, so it's less demanding to migrate your code. See the parameters documentation for the packages that have been upgraded:

- [Notes](https://github.com/storybookjs/storybook/blob/master/addons/notes/README.md)
- [Jest](https://github.com/storybookjs/storybook/blob/master/addons/jest/README.md)
- [Knobs](https://github.com/storybookjs/storybook/blob/master/addons/knobs/README.md)
- [Viewport](https://github.com/storybookjs/storybook/blob/master/addons/viewport/README.md)
- [Backgrounds](https://github.com/storybookjs/storybook/blob/master/addons/backgrounds/README.md)
- [Options](https://github.com/storybookjs/storybook/blob/master/addons/options/README.md)

## From version 3.3.x to 3.4.x

There are no expected breaking changes in the 3.4.x release, but 3.4 contains a major refactor to make it easier to support new frameworks, and we will document any breaking changes here if they arise.

## From version 3.2.x to 3.3.x

It wasn't expected that there would be any breaking changes in this release, but unfortunately it turned out that there are some. We're revisiting our [release strategy](https://github.com/storybookjs/storybook/blob/master/RELEASES.md) to follow semver more strictly.
Also read on if you're using `addon-knobs`: we advise an update to your code for efficiency's sake.

### `babel-core` is now a peer dependency #2494

This affects you if you don't use babel in your project. You may need to add `babel-core` as dev dependency:

```sh
yarn add babel-core --dev
```

This was done to support different major versions of babel.

### Base webpack config now contains vital plugins #1775

This affects you if you use custom webpack config in [Full Control Mode](https://storybook.js.org/docs/react/configure/webpack#full-control-mode) while not preserving the plugins from `storybookBaseConfig`. Before `3.3`, preserving them was a recommendation, but now it [became](https://github.com/storybookjs/storybook/pull/2578) a requirement.

### Refactored Knobs

Knobs users: there was a bug in 3.2.x where using the knobs addon imported all framework runtimes (e.g. React and Vue). To fix the problem, we [refactored knobs](https://github.com/storybookjs/storybook/pull/1832). Switching to the new style is only takes one line of code.

In the case of React or React-Native, import knobs like this:

```js
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';
```

In the case of Vue: `import { ... } from '@storybook/addon-knobs/vue';`

In the case of Angular: `import { ... } from '@storybook/addon-knobs/angular';`

## From version 3.1.x to 3.2.x

**NOTE:** technically this is a breaking change, but only if you use TypeScript. Sorry people!

### Moved TypeScript addons definitions

TypeScript users: we've moved the rest of our addons type definitions into [DefinitelyTyped](http://definitelytyped.org/). Starting in 3.2.0 make sure to use the right addons types:

```sh
yarn add @types/storybook__addon-notes @types/storybook__addon-options @types/storybook__addon-knobs @types/storybook__addon-links --dev
```

See also [TypeScript definitions in 3.1.x](#moved-typescript-definitions).

### Updated Addons API

We're in the process of upgrading our addons APIs. As a first step, we've upgraded the Info and Notes addons. The old API will still work with your existing projects but will be deprecated soon and removed in Storybook 4.0.

Here's an example of using Notes and Info in 3.2 with the new API.

```js
storiesOf('composition', module).add(
  'new addons api',
  withInfo('see Notes panel for composition info')(
    withNotes({ text: 'Composition: Info(Notes())' })((context) => (
      <MyComponent name={context.story} />
    ))
  )
);
```

It's not beautiful, but we'll be adding a more convenient/idiomatic way of using these [withX primitives](https://gist.github.com/shilman/792dc25550daa9c2bf37238f4ef7a398) in Storybook 3.3.

## From version 3.0.x to 3.1.x

**NOTE:** technically this is a breaking change and should be a 4.0.0 release according to semver. However, we're still figuring things out and didn't think this change necessitated a major release. Please bear with us!

### Moved TypeScript definitions

TypeScript users: we are in the process of moving our typescript definitions into [DefinitelyTyped](http://definitelytyped.org/). If you're using TypeScript, starting in 3.1.0 you need to make sure your type definitions are installed:

```sh
yarn add @types/node @types/react @types/storybook__react --dev
```

### Deprecated head.html

We have deprecated the use of `head.html` for including scripts/styles/etc. into stories, though it will still work with a warning.

Now we use:

- `preview-head.html` for including extra content into the preview pane.
- `manager-head.html` for including extra content into the manager window.

[Read our docs](https://storybook.js.org/docs/react/configure/story-rendering#adding-to-head) for more details.

## From version 2.x.x to 3.x.x

This major release is mainly an internal restructuring.
Upgrading requires work on behalf of users, this was unavoidable.
We're sorry if this inconveniences you, we have tried via this document and provided tools to make the process as easy as possible.

### Webpack upgrade

Storybook will now use webpack 2 (and only webpack 2).
If you are using a custom `webpack.config.js` you need to change this to be compatible.
You can find the guide to upgrading your webpack config [on webpack.js.org](https://webpack.js.org/guides/migrating/).

### Packages renaming

All our packages have been renamed and published to npm as version 3.0.0 under the `@storybook` namespace.

To update your app to use the new package names, you can use the cli:

```bash
npx -p @storybook/cli sb init
```

**Details**

If the above doesn't work, or you want to make the changes manually, the details are below:

> We have adopted the same versioning strategy that has been adopted by babel, jest and apollo.
> It's a strategy best suited for ecosystem type tools, which consist of many separately installable features / packages.
> We think this describes storybook pretty well.

The new package names are:

| old                                          | new                              |
| -------------------------------------------- | -------------------------------- |
| `getstorybook`                               | `@storybook/cli`                 |
| `@kadira/getstorybook`                       | `@storybook/cli`                 |
|                                              |                                  |
| `@kadira/storybook`                          | `@storybook/react`               |
| `@kadira/react-storybook`                    | `@storybook/react`               |
| `@kadira/react-native-storybook`             | `@storybook/react-native`        |
|                                              |                                  |
| `storyshots`                                 | `@storybook/addon-storyshots`    |
| `@kadira/storyshots`                         | `@storybook/addon-storyshots`    |
|                                              |                                  |
| `@kadira/storybook-ui`                       | `@storybook/ui`                  |
| `@kadira/storybook-addons`                   | `@storybook/addons`              |
| `@kadira/storybook-channels`                 | `@storybook/channels`            |
| `@kadira/storybook-channel-postmsg`          | `@storybook/channel-postmessage` |
| `@kadira/storybook-channel-websocket`        | `@storybook/channel-websocket`   |
|                                              |                                  |
| `@kadira/storybook-addon-actions`            | `@storybook/addon-actions`       |
| `@kadira/storybook-addon-links`              | `@storybook/addon-links`         |
| `@kadira/storybook-addon-info`               | `@storybook/addon-info`          |
| `@kadira/storybook-addon-knobs`              | `@storybook/addon-knobs`         |
| `@kadira/storybook-addon-notes`              | `@storybook/addon-notes`         |
| `@kadira/storybook-addon-options`            | `@storybook/addon-options`       |
| `@kadira/storybook-addon-graphql`            | `@storybook/addon-graphql`       |
| `@kadira/react-storybook-decorator-centered` | `@storybook/addon-centered`      |

If your codebase is small, it's probably doable to replace them by hand (in your codebase and in `package.json`).

But if you have a lot of occurrences in your codebase, you can use a [codemod we created](./lib/codemod) for you.

> A codemod makes automatic changed to your app's code.

You have to change your `package.json`, prune old and install new dependencies by hand.

`npm prune` will remove all dependencies from `node_modules` which are no longer referenced in `package.json`.

### Deprecated embedded addons

We used to ship 2 addons with every single installation of storybook: `actions` and `links`. But in practice not everyone is using them, so we decided to deprecate this and in the future, they will be completely removed. If you use `@storybook/react/addons` you will get a deprecation warning.

If you **are** using these addons, it takes two steps to migrate:

- add the addons you use to your `package.json`.
- update your code:
  change `addons.js` like so:

  ```js
  import '@storybook/addon-actions/register';
  import '@storybook/addon-links/register';
  ```

  change `x.story.js` like so:

  ```js
  import React from 'react';
  import { storiesOf } from '@storybook/react';
  import { action } from '@storybook/addon-actions';
  import { linkTo } from '@storybook/addon-links';
  ```

  <!-- markdown-link-check-enable -->

```

```
