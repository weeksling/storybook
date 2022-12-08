import globalThis from 'global';
import type { PartialStoryFn, PlayFunctionContext, StoryContext } from '@storybook/types';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  component: globalThis.Components.Pre,
};

export const Inheritance = {
  // Compose all the globals into `object`, so the pre component only needs a single prop
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) =>
      storyFn({ args: { object: context.globals } }),
  ],
  play: async ({ canvasElement }: PlayFunctionContext) => {
    await expect(JSON.parse(within(canvasElement).getByTestId('pre').innerText)).toMatchObject({
      foo: 'fooValue',
      bar: 'barDefaultValue',
    });
  },
};

export const Events = {
  // Just pass the "foo" global to the pre
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) =>
      storyFn({ args: { text: context.globals.foo } }),
  ],
  play: async ({ canvasElement }: PlayFunctionContext) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    await within(canvasElement).findByText('fooValue');

    await channel.emit('updateGlobals', { globals: { foo: 'updated' } });
    await within(canvasElement).findByText('updated');

    // Reset it back to the original value just to avoid polluting the URL
    await channel.emit('updateGlobals', { globals: { foo: 'fooValue' } });
    await within(canvasElement).findByText('fooValue');
  },
};
