---
title: 'Install Storybook'
---

<!-- prettier-ignore-start -->

<FeatureSnippets
  paths={[
   'get-started/installation-command-section/angular.mdx',
   'get-started/installation-command-section/ember.mdx',
   'get-started/installation-command-section/html.mdx',
   'get-started/installation-command-section/preact.mdx',
   'get-started/installation-command-section/react.mdx',
   'get-started/installation-command-section/svelte.mdx',
   'get-started/installation-command-section/vue.mdx',
   'get-started/installation-command-section/web-components.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<details>

<summary><code>storybook init</code> is not made for empty projects</summary>

Storybook needs to be installed into a project that is already set up with a framework. It will not work on an empty project. There are many ways to bootstrap an app in a given framework, including:

- 📦 [Create an Angular Workspace](https://angular.io/cli/new)
- 📦 [Create React App](https://reactjs.org/docs/create-a-new-react-app.html)
- 📦 [Create a Vue App](https://vuejs.org/guide/quick-start.html)
- 📦 [Ember CLI](https://guides.emberjs.com/release/getting-started/quick-start/)
- 📦 [Vite CLI](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- Or any other tooling available.

</details>

Storybook will look into your project's dependencies during its install process and provide you with the best configuration available.

The command above will make the following changes to your local environment:

- 📦 Install the required dependencies.
- 🛠 Setup the necessary scripts to run and build Storybook.
- 🛠 Add the default Storybook configuration.
- 📝 Add some boilerplate stories to get you started.
- 📡 Set up telemetry to help us improve Storybook. Read more about it [here](../configure/telemetry.md).

Depending on your framework, first, build your app and then check that everything worked by running:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/storybook-run-dev.with-builder.js.mdx',
    'common/storybook-run-dev.npm.js.mdx',
    'common/storybook-run-dev.yarn.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

It will start Storybook locally and output the address. Depending on your system configuration, it will automatically open the address in a new browser tab, and you'll be greeted by a welcome screen.

![Storybook welcome screen](./example-welcome.png)

There are some noteworthy items here:

- A collection of useful links for more in-depth configuration and customization options you have at your disposal.
- A second set of links for you to expand your Storybook knowledge and get involved with the ever-growing Storybook community.
- A few example stories to get you started.

<details>
<summary><h4 id="troubleshooting">Troubleshooting</h4></summary>

Below are some of the most common installation issues and instructions on how to solve them.

<!-- prettier-ignore-start -->

<FeatureSnippets
  paths={[
   'get-started/installation-problems/angular.mdx',
   'get-started/installation-problems/ember.mdx',
   'get-started/installation-problems/html.mdx',
   'get-started/installation-problems/preact.mdx',
   'get-started/installation-problems/react.mdx',
   'get-started/installation-problems/svelte.mdx',
   'get-started/installation-problems/vue.mdx',
   'get-started/installation-problems/web-components.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

Storybook collects completely anonymous data to help us improve user experience. Participation is optional, and you may [opt-out](../configure/telemetry.md#how-to-opt-out) if you'd not like to share any information.

</div>

If all else fails, try asking for [help](https://storybook.js.org/support)

</details>

Now that you installed Storybook successfully, let’s take a look at a story that was written for us.
