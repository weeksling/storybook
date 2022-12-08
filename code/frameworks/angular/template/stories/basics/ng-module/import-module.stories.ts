import { StoryFn, Meta, moduleMetadata } from '@storybook/angular';
import { ChipsModule } from './angular-src/chips.module';
import { ChipsGroupComponent } from './angular-src/chips-group.component';
import { ChipComponent } from './angular-src/chip.component';

export default {
  // title: 'Basics / NgModule / Module with multiple component',
  component: ChipsGroupComponent,
  decorators: [
    moduleMetadata({
      imports: [ChipsModule],
    }),
  ],
} as Meta;

export const ChipsGroup: StoryFn = (args) => ({
  component: ChipsGroupComponent,
  props: args,
});
ChipsGroup.args = {
  chips: [
    {
      id: 1,
      text: 'Chip 1',
    },
    {
      id: 2,
      text: 'Chip 2',
    },
  ],
};
ChipsGroup.argTypes = {
  removeChipClick: { action: 'Remove chip' },
  removeAllChipsClick: { action: 'Remove all chips clicked' },
};

export const Chip: StoryFn = (args) => ({
  component: ChipComponent,
  props: args,
});
Chip.args = {
  displayText: 'Chip',
};
Chip.argTypes = {
  removeClicked: { action: 'Remove icon clicked' },
};
