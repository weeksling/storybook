import MyHeader from './Header.vue';

export default {
  title: 'Example/Header',
  component: MyHeader,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/7.0/vue/writing-docs/docs-page
  tags: ['docsPage'],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: {
      MyHeader,
    },
    template:
      '<my-header :user="user" @onLogin="onLogin" @onLogout="onLogout" @onCreateAccount="onCreateAccount" />',
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/vue/configure/story-layout
    layout: 'fullscreen',
  },
};

export const LoggedIn = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
};

export const LoggedOut = {};
