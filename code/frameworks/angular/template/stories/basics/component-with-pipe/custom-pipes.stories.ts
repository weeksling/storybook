import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

import { CustomPipePipe } from './custom.pipe';
import { WithPipeComponent } from './with-pipe.component';

export default {
  // title: 'Basics / Component / With Pipes',
  component: WithPipeComponent,
  decorators: [
    moduleMetadata({
      declarations: [CustomPipePipe],
    }),
  ],
} as Meta;

export const Simple: StoryFn = () => ({
  props: {
    field: 'foobar',
  },
});

export const WithArgsStory: StoryFn = (args) => ({
  props: args,
});
WithArgsStory.storyName = 'With args';
WithArgsStory.argTypes = {
  field: { control: 'text' },
};
WithArgsStory.args = {
  field: 'Foo Bar',
};
