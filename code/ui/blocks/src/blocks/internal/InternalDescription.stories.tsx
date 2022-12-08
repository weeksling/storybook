import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Description, DescriptionType } from '../Description';
import { BooleanControl } from '../../controls/Boolean';

const meta: Meta<typeof Description> = {
  title: 'Blocks/Internal/Description',
  component: Description,
  parameters: {
    relativeCsfPaths: ['../controls/Boolean.stories'],
  },
  args: {
    of: BooleanControl,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const InfoType: Story = {
  args: {
    type: DescriptionType.INFO,
  },
};
export const NotesType: Story = {
  args: {
    type: DescriptionType.NOTES,
  },
};
export const DocgenType: Story = {
  args: {
    type: DescriptionType.DOCGEN,
  },
};
export const AutoType: Story = {
  args: {
    type: DescriptionType.AUTO,
  },
};
export const Markdown: Story = {
  args: {
    markdown: `# My Example Markdown

An \`inline\` codeblock

\`\`\`tsx
// TypeScript React code block
export const MyStory = () => {
return <Button>Click me</Button>;
};
\`\`\`

\`\`\`
code block with with no language
const a = fn({
b: 2,
});
\`\`\`
`,
  },
};
export const Children: Story = {
  render: (args) => (
    <Description {...args}>
      {`# My Example Markdown

An \`inline\` codeblock

\`\`\`tsx
// TypeScript React code block
export const MyStory = () => {
return <Button>Click me</Button>;
};
\`\`\`

\`\`\`
code block with with no language
const a = fn({
b: 2,
});
\`\`\`
`}
    </Description>
  ),
};
