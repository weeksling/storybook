import type { ComponentProps } from 'react';
import React from 'react';
import { ThemeProvider, themes, ensure } from '@storybook/theming';
import { SyntaxHighlighter } from './lazy-syntaxhighlighter';

export default {
  component: SyntaxHighlighter,
};

export const JS = {
  args: {
    language: 'js',
    children: `import React, { createElement } from 'react';
import { Good, Things } from 'life';

const result = () => createElement(Good, [createElement(Things, [], { all: true }), []);

console.log(result);
export { result as default };`,
  },
};

export const Default = JS;

export const Bash = {
  args: {
    language: 'bash',
    children: `npx npm-check-updates ' / storybook / ' -u && npm install`,
  },
};

export const CSS = {
  args: {
    language: 'css',
    children: `.className {
              border: 1px solid hotpink;
            }`,
  },
};

export const JSON = {
  args: {
    language: 'json',
    children: `{
        "number": 1,
        "string": "something",
        "object": {
          "property": "value",
        },
        array: [1,2,3],
      }`,
  },
};

export const Markdown = {
  args: {
    language: 'markdown',
    children: `
# a big header

some code:
      
\`\`\`js
const name = "a string";
\`\`\`
      
> crazy`,
  },
};

export const Yaml = {
  args: {
    language: 'yaml',
    children: `
      product:
        - sku: BL394D
          quantity: 4
          description: Basketball
          price: 450.00
`,
  },
};

export const JSX = {
  args: {
    language: 'jsx',
    children: `import { Good, Things } from 'life';

    const result = () => <Good><Things all={true} /></Good>;

    export { result as default };
`,
  },
};

export const GraphQL = {
  args: {
    language: 'graphql',
    children: `query HeroNameAndFriends($episode: Episode) {
      hero(episode: $episode) {
        name
      friends {
          name
      }
    }
  }
`,
  },
};

export const Unsupported = {
  args: {
    language: 'C#',
    children: `// A Hello World! program in C#.
    using System;
    namespace HelloWorld
    {
        class Hello
      {
          static void Main()
        {
            Console.WriteLine("Hello World!");

          // Keep the console window open in debug mode.
          Console.WriteLine("Press any key to exit.");
          Console.ReadKey();
        }
      }
    }`,
  },
};

export const UnsupportedDark = {
  args: {
    language: 'C#',
    children: `// A Hello World! program in C#.
    using System;
    namespace HelloWorld
    {
        class Hello
      {
          static void Main()
        {
            Console.WriteLine("Hello World!");

          // Keep the console window open in debug mode.
          Console.WriteLine("Press any key to exit.");
          Console.ReadKey();
        }
      }
    }`,
  },
  render: (args: ComponentProps<typeof SyntaxHighlighter>) => (
    <ThemeProvider theme={ensure(themes.dark)}>
      <SyntaxHighlighter {...args} />
    </ThemeProvider>
  ),
};

export const Story = {
  args: {
    language: 'jsx',
    children: `import React from 'react';
    import { storiesOf } from '@storybook/react';
    import { styled } from '@storybook/theming';

    import Heading from './heading';

    const Holder = styled.div({
        margin: 10,
      border: '1px dashed deepskyblue',
      // overflow: 'hidden',
    });

    storiesOf('Basics|Heading', module).add('types', () => (
        <div>
        <Holder>
          <Heading>DEFAULT WITH ALL CAPS</Heading>
        </Holder>
        <Holder>
          <Heading sub="With a great sub">THIS LONG DEFAULT WITH ALL CAPS & SUB</Heading>
        </Holder>
        <Holder>
          <Heading type="page">page type</Heading>
        </Holder>
        <Holder>
          <Heading type="page" sub="With a sub">
            page type
          </Heading>
        </Holder>
      </div>
    ));`,
  },
};

export const BorderedCopyable = {
  args: {
    copyable: true,
    bordered: true,
    language: 'jsx',
    children: `import { Good, Things } from 'life';

    const result = () => <Good><Things /></Good>;

    export { result as default };`,
  },
};

export const Padded = {
  args: {
    padded: true,
    language: 'jsx',
    children: `import { Good, Things } from 'life';

    const result = () => <Good><Things /></Good>;

    export { result as default };`,
  },
};

export const ShowLineNumbers = {
  args: {
    showLineNumbers: true,
    language: 'jsx',
    children: `import { Good, Things } from 'life';

    const result = () => <Good><Things /></Good>;

    export { result as default };`,
  },
};
