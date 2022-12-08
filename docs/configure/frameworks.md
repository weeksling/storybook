---
title: 'Framework support'
---

Frameworks are packages that auto-configure Storybook to work with most common environment setups. They simplify the setup process and reduce boilerplate by mirroring your framework's conventions to create applications.

## How do frameworks work in Storybook?

You start by [installing](../get-started/install.md) Storybook into an existing project. Then, it tries to detect the framework you're using and automatically configures Storybook to work with it. That means adding the necessary libraries as dependencies and adjusting the configuration. Finally, starting Storybook will automatically load the framework configuration before loading any existing addons to match your application environment.

## Which frameworks are supported?

Storybook provides support for the leading industry builders and frameworks. However, that doesn't mean you can't use Storybook with other frameworks. Below is a list of currently supported frameworks divided by their builders.

| Builder | Framework                                                                |
| ------- | ------------------------------------------------------------------------ |
| Webpack | React, Angular, Vue, Web Components, NextJS, HTML, Ember, Preact, Svelte |
| Vite    | React, Vue, Web Components, HTML, Svelte, SvelteKit                      |

## Configure

Every modern web application has unique requirements and relies on various tools and frameworks. By default, with Storybook, you get an out-of-the-box configuration generated to work with most frameworks. However, you can extend your existing configuration file (i.e., `./storybook/main.js|ts|cjs`) and provide additional options. Below is an abridged table with available options and examples of configuring Storybook for your framework.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-framework-config-options.js.mdx',
    'common/storybook-framework-config-options.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

| Option           | Description                                                                                                                                                                                                                                                 | Framework |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `nextConfigPath` | Sets the default path for the NextJS configuration file<br/>`framework: { name: '@storybook/nextjs', options: { nextConfigPath: '../next.config.js'} }`                                                                                                     | NextJS    |
| `builder`        | Configures [Webpack 5](../builders/webpack.md#webpack-5) builder options for NextJS<br/> `core: { builder: { name:'webpack5', options: { lazyCompilation: true} }}`                                                                                         | NextJS    |
| `fastRefresh`    | Enables [fast refresh mode](https://www.npmjs.com/package/react-refresh) for React<br/>`framework: { name: '@storybook/react-webpack5', options: { fastRefresh: false } }`                                                                                  | React     |
| `strictMode`     | Enables React's [strict mode](https://reactjs.org/docs/strict-mode.html)<br/>`framework: { name: '@storybook/react-webpack5', options: { strictMode: false } }`                                                                                             | React     |
| `legacyRootApi`  | Requires React 18. Toggles support for React's [legacy root API](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis)<br/>`framework: { name: '@storybook/react-webpack5', options: { legacyRootApi: true } }` | React     |
| `enableIvy`      | Enabled by default with Angular 9+. Replaces the default compiler with the [Ivy compiler](https://docs.angular.lat/guide/ivy)<br/>`framework: { name: '@storybook/angular', options: { enableIvy: true } }`                                                 | Angular   |
| `enableNgcc`     | Enabled by default with Angular 9+. Adds support for ngcc for backwards compatibility<br/>`framework: { name: '@storybook/angular', options: { enableNgcc: false } }`                                                                                       | Angular   |

---

## Troubleshooting

### NextJS 13 doesn't work with Storybook

The latest release of [NexJS](https://nextjs.org/) introduced breaking changes (e.g., [TurboPack](https://turbo.build/pack), [Server Component](https://nextjs.org/docs/advanced-features/react-18/server-components), [SWC](https://nextjs.org/docs/advanced-features/compiler#why-swc)) that are not yet fully supported by Storybook. The Storybook team is working on adding support for these features. In the meantime, you can still use Storybook alongside your NextJS 13 project if you're not relying on them.

### My framework doesn't work with Storybook

Out of the box, most frameworks work seamlessly with Storybook. However, some frameworks (e.g., [CRACO](https://craco.js.org/)) provide their own configuration that Storybook isn't prepared to handle without additional steps, either [via addon](../addons/writing-presets.md) or integration. To learn more, read our [addons guide](../addons/introduction.md).

### How do I build a Storybook framework?

Storybook is a framework-agnostic tool. It can be used with any framework. However, to make it easier for you to get started, we provide instructions that you can use to build your framework. To learn more, read our [frameworks guide](../contribute/framework.md).

### Learn about configuring Storybook

- [Theming](./theming.md) to customize the look and feel of Storybook's UI
- [CSS](./styling-and-css.md) to configure CSS support
- [Images & assets](./images-and-assets.md) for static asset handling
- [Environment variables](./environment-variables.md) to configure environment variables
