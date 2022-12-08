import globalThis from 'global';
import type { PartialStoryFn, PlayFunctionContext, StoryContext } from '@storybook/types';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  component: globalThis.Components.Pre,
  parameters: {
    componentParameter: 'componentParameter',
    storyParameter: 'componentStoryParameter', // Checking this gets overridden
    storyObject: {
      a: 'component',
      b: 'component',
    },
  },
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) => {
      const { projectParameter, componentParameter, storyParameter, storyObject } =
        context.parameters;
      return storyFn({
        args: { object: { projectParameter, componentParameter, storyParameter, storyObject } },
      });
    },
  ],
};

export const Inheritance = {
  parameters: {
    storyParameter: 'storyParameter',
    storyObject: {
      a: 'story',
    },
  },
  play: async ({ canvasElement }: PlayFunctionContext) => {
    const canvas = within(canvasElement);
    await expect(JSON.parse(canvas.getByTestId('pre').innerText)).toEqual({
      projectParameter: 'projectParameter',
      componentParameter: 'componentParameter',
      storyParameter: 'storyParameter',
      storyObject: {
        a: 'story',
        b: 'component',
        c: 'project',
      },
    });
  },
};
