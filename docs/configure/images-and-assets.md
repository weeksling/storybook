---
title: 'Images, fonts, and assets'
---

Components often rely on images, videos, fonts, and other assets to render as the user expects. There are many ways to use these assets in your story files.

### Import assets into stories

You can import any media assets by importing (or requiring) them. It works out of the box with our default config. But, if you are using a custom webpack config, you’ll need to add the [file loader](https://v4.webpack.js.org/loaders/) to handle the required files.

Afterward, you can use any asset in your stories:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/component-story-static-asset-with-import.js.mdx',
    'react/component-story-static-asset-with-import.ts.mdx',
    'vue/component-story-static-asset-with-import.2.js.mdx',
    'vue/component-story-static-asset-with-import.ts-2.ts.mdx',
    'vue/component-story-static-asset-with-import.3.js.mdx',
    'vue/component-story-static-asset-with-import.ts-3.ts.mdx',
    'angular/component-story-static-asset-with-import.ts.mdx',
    'svelte/component-story-static-asset-with-import.js.mdx',
  ]}
  usesCsf3
  csf2Path="configure/images-and-assets#snippet-component-story-static-asset-with-import"
/>

<!-- prettier-ignore-end -->

### Serving static files via Storybook Configuration

We recommend serving static files via Storybook to ensure that your components always have the assets they need to load. We recommend this technique for assets that your components often use, like logos, fonts, and icons.

Configure a directory (or a list of directories) where your assets live when starting Storybook. Use the `staticDirs` configuration element in your main Storybook configuration file (i.e., `.storybook/main.js`) to specify the directories:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-with-single-static-dir.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Here `../public` is your static directory. Now use it in a component or story like this.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/component-story-static-asset-without-import.js.mdx',
    'react/component-story-static-asset-without-import.ts.mdx',
    'vue/component-story-static-asset-without-import.js.mdx',
    'vue/component-story-static-asset-without-import.ts.mdx',
    'angular/component-story-static-asset-without-import.ts.mdx',
    'svelte/component-story-static-asset-without-import.js.mdx',
  ]}
  usesCsf3
  csf2Path="configure/images-and-assets#snippet-component-story-static-asset-without-import"
/>

<!-- prettier-ignore-end -->

You can also pass a list of directories separated by commas without spaces instead of a single directory.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-with-multiple-static-dir.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Or even use a configuration object to define the directories:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-with-object-configuration-static-dir.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### **[⚠️ Deprecated]** Serving static files via Storybook CLI

Using `--static-dir` or `-s` option with Storybook CLI is deprecated. It is recommended to use [Storybook static directory configuration option](#serving-static-files-via-storybook-configuration) instead.

### Reference assets from a CDN

Upload your files to an online CDN and reference them. In this example, we’re using a placeholder image service.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/component-story-static-asset-cdn.js.mdx',
    'react/component-story-static-asset-cdn.ts.mdx',
    'vue/component-story-static-asset-cdn.js.mdx',
    'vue/component-story-static-asset-cdn.ts.mdx',
    'angular/component-story-static-asset-cdn.ts.mdx',
    'svelte/component-story-static-asset-cdn.js.mdx',
  ]}
  usesCsf3
  csf2Path="configure/images-and-assets#snippet-component-story-static-asset-cdn"
/>

<!-- prettier-ignore-end -->

### Absolute versus relative paths

Sometimes, you may want to deploy your Storybook into a subpath, like `https://example.com/storybook`.

In this case, you need to have all your images and media files with relative paths. Otherwise, the browser cannot locate those files.

If you load static content via importing, this is automatic, and you do not have to do anything.

Suppose you are serving assets in a [static directory](#serving-static-files-via-storybook-configuration) along with your Storybook. In that case, you need to use relative paths to load images or use the base element.
