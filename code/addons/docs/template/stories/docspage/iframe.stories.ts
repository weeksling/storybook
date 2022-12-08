import globalThis from 'global';

export default {
  component: globalThis.Components.Button,
  tags: ['docsPage'],
  args: { label: 'Rendered in iframe' },
  parameters: {
    chromatic: { disable: true },
    docs: { iframeHeight: 120, inlineStories: true },
  },
};

export const Basic = {};
