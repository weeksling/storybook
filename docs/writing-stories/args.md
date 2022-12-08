---
title: 'Args'
---

A story is a component with a set of arguments that define how the component should render. “Args” are Storybook’s mechanism for defining those arguments in a single JavaScript object. Args can be used to dynamically change props, slots, styles, inputs, etc. It allows Storybook and its addons to live edit components. You _do not_ need to modify your underlying component code to use args.

When an arg’s value changes, the component re-renders, allowing you to interact with components in Storybook’s UI via addons that affect args.

Learn how and why to write stories in [the introduction](./introduction.md#using-args). For details on how args work, read on.

## Args object

The `args` object can be defined at the [story](#story-args), [component](#component-args) and [global level](#global-args). It is a JSON serializable object composed of string keys with matching valid value types that can be passed into a component for your framework.

## Story args

To define the args of a single story, use the `args` CSF story key:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-story-with-args.js.mdx',
    'react/button-story-with-args.ts.mdx',
    'vue/button-story-with-args.2.js.mdx',
    'vue/button-story-with-args.ts-2.ts.mdx',
    'vue/button-story-with-args.3.js.mdx',
    'vue/button-story-with-args.ts-3.ts.mdx',
    'angular/button-story-with-args.ts.mdx',
    'svelte/button-story-with-args.js.mdx',
    'web-components/button-story-with-args.js.mdx',
    'html/button-story-with-args.ts.mdx',
    'html/button-story-with-args.js.mdx',
  ]}
  usesCsf3
  csf2Path="writing-stories/args#snippet-button-story-with-args"
/>


<!-- prettier-ignore-end -->

These args will only apply to the story for which they are attached, although you can [reuse](./build-pages-with-storybook.md#args-composition-for-presentational-screens) them via JavaScript object reuse:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-primary-long-name.js.mdx',
    'common/button-story-primary-long-name.ts.mdx',
  ]}
  usesCsf3
  csf2Path="writing-stories/args#snippet-button-story-primary-long-name"
/>

<!-- prettier-ignore-end -->

In the above example, we use the [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) feature of ES 2015.

## Component args

You can also define args at the component level; they will apply to all the component's stories unless you overwrite them. To do so, use the `args` key on the `default` CSF export:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-story-component-args-primary.js.mdx',
    'react/button-story-component-args-primary.ts.mdx',
    'vue/button-story-component-args-primary.js.mdx',
    'vue/button-story-component-args-primary.ts-2.ts.mdx',
    'vue/button-story-component-args-primary.ts-3.ts.mdx',
    'angular/button-story-component-args-primary.ts.mdx',
    'svelte/button-story-component-args-primary.js.mdx',
    'web-components/button-story-component-args-primary.js.mdx',
  ]}
  usesCsf3
  csf2Path="writing-stories/args#snippet-button-story-component-args-primary"
/>

<!-- prettier-ignore-end -->

## Global args

You can also define args at the global level; they will apply to every component's stories unless you overwrite them. To do so, export the `args` key in your `preview.js`:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-project-args-theme.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Args composition

You can separate the arguments to a story to compose in other stories. Here's how you can combine args for multiple stories of the same component.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-primary-composition.js.mdx',
    'common/button-story-primary-composition.ts.mdx',
  ]}
  usesCsf3
  csf2Path="writing-stories/args#snippet-button-story-primary-composition"
/>

<!-- prettier-ignore-end -->

<div class="aside">

💡 If you find yourself re-using the same args for most of a component's stories, you should consider using [component-level args](#component-args).

</div>

Args are useful when writing stories for composite components that are assembled from other components. Composite components often pass their arguments unchanged to their child components, and similarly, their stories can be compositions of their child components stories. With args, you can directly compose the arguments:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/page-story.js.mdx',
    'react/page-story.ts.mdx',
    'angular/page-story.ts.mdx',
    'vue/page-story.2.js.mdx',
    'vue/page-story.ts-2.ts.mdx',
    'vue/page-story.3.js.mdx',
    'vue/page-story.ts-3.ts.mdx',
    'svelte/page-story.js.mdx',
  ]}
  usesCsf3
  csf2Path="writing-stories/args#snippet-page-story"
/>

<!-- prettier-ignore-end -->

## Args can modify any aspect of your component

You can use args in your stories to configure the component's appearance, similar to what you would do in an application. For example, here's how you could use a `footer` arg to populate a child component:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/page-story-slots.js.mdx',
    'react/page-story-slots.ts.mdx',
    'vue/page-story-slots.2.js.mdx',
    'vue/page-story-slots.ts-2.ts.mdx',
    'vue/page-story-slots.3.js.mdx',
    'vue/page-story-slots.ts-3.ts.mdx',
    'angular/page-story-slots.ts.mdx',
  ]}
  usesCsf3
  csf2Path="writing-stories/args#snippet-page-story-slots"
/>

<!-- prettier-ignore-end -->

## Setting args through the URL

You can also override the set of initial args for the active story by adding an `args` query parameter to the URL. Typically you would use the [Controls addon](../essentials/controls.md) to handle this. For example, here's how you could set a `size` and `style` arg in the Storybook's URL:

```
?path=/story/avatar--default&args=style:rounded;size:100
```

As a safeguard against [XSS](https://owasp.org/www-community/attacks/xss/) attacks, the arg's keys and values provided in the URL are limited to alphanumeric characters, spaces, underscores, and dashes. Any other types will be ignored and removed from the URL, but you can still use them with the Controls addon and [within your story](#mapping-to-complex-arg-values).

The `args` param is always a set of `key: value` pairs delimited with a semicolon `;`. Values will be coerced (cast) to their respective `argTypes` (which may have been automatically inferred). Objects and arrays are supported. Special values `null` and `undefined` can be set by prefixing with a bang `!`. For example, `args=obj.key:val;arr[0]:one;arr[1]:two;nil:!null` will be interpreted as:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
   'common/storybook-args-url-params-converted.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Similarly, special formats are available for dates and colors. Date objects will be encoded as `!date(value)` with value represented as an ISO date string. Colors are encoded as `!hex(value)`, `!rgba(value)` or `!hsla(value)`. Note that rgb(a) and hsl(a) should not contain spaces or percentage signs in the URL.

Args specified through the URL will extend and override any default values of args set on the story.

## Mapping to complex arg values

Complex values such as JSX elements cannot be serialized to the manager (e.g., the Controls addon) or synced with the URL. Arg values can be "mapped" from a simple string to a complex type using the `mapping` property in `argTypes` to work around this limitation. It works in any arg but makes the most sense when used with the `select` control type.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-component-argtypes-with-mapping.js.mdx',
    'common/my-component-argtypes-with-mapping.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Note that `mapping` does not have to be exhaustive. If the arg value is not a property of `mapping`, the value will be used directly. Keys in `mapping` always correspond to arg _values_, not their index in the `options` array.

<details>
<summary>Using args in addons</summary>

If you are [writing an addon](../addons/writing-addons.md) that wants to read or update args, use the `useArgs` hook exported by `@storybook/manager-api`:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/args-usage-with-addons.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

</details>

<details>
<summary>parameters.passArgsFirst</summary>

In Storybook 6+, we pass the args as the first argument to the story function. The second argument is the “context”, which includes story parameters, globals, argTypes, and other information.

In Storybook 5 and before we passed the context as the first argument. If you’d like to revert to that functionality set the `parameters.passArgsFirst` parameter in [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-parameters-old-format.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

  <div class="aside">
  💡 Note that `args` is still available as a key in the context.
  </div>
</details>
