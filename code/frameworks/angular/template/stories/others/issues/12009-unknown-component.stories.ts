import { Meta, StoryFn } from '@storybook/angular';
import Button from '../../button.component';

export default {
  // title: 'Others / Issues / 12009 unknown component',
  component: Button,
} as Meta;

const Template: StoryFn = (args) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = { text: 'Unknown component' };
