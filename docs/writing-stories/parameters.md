---
title: 'Parameters'
---

Parameters are a set of static, named metadata about a story, typically used to control the behavior of Storybook features and addons.

For example, let’s customize the backgrounds addon via a parameter. We’ll use `parameters.backgrounds` to define which backgrounds appear in the backgrounds toolbar when a story is selected.

## Story parameters

We can set a parameter for a single story with the `parameters` key on a CSF export:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
   'common/component-story-custom-params.js.mdx',
   'common/component-story-custom-params.ts.mdx',
  ]}
  usesCsf3
  csf2Path="writing-stories/parameters#snippet-component-story-custom-params"
/>

<!-- prettier-ignore-end -->

## Component parameters

We can set the parameters for all stories of a component using the `parameters` key on the default CSF export:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-story-with-blue-args.js.mdx',
    'react/button-story-with-blue-args.ts.mdx',
    'vue/button-story-with-blue-args.js.mdx',
    'vue/button-story-with-blue-args.ts-2.ts.mdx',
    'vue/button-story-with-blue-args.ts-3.ts.mdx',
    'angular/button-story-with-blue-args.ts.mdx',
    'svelte/button-story-with-blue-args.js.mdx',
    'web-components/button-story-with-blue-args.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Global parameters

We can also set the parameters for **all stories** via the `parameters` export of your [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering) file (this is the file where you configure all stories):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
   'common/preview-story-custom-params.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Setting a global parameter is a common way to configure addons. With backgrounds, you configure the list of backgrounds that every story can render in.

## Rules of parameter inheritance

The way the global, component and story parameters are combined is:

- More specific parameters take precedence (so a story parameter overwrites a component parameter which overwrites a global parameter).
- Parameters are **merged** so keys are only ever overwritten, never dropped.

The merging of parameters is important. It means it is possible to override a single specific sub-parameter on a per-story basis but still retain the majority of the parameters defined globally.

If you are defining an API that relies on parameters (e.g. an [**addon**](../addons/introduction.md)) it is a good idea to take this behavior into account.
