/// <reference types="@types/jest" />;

/* eslint-disable no-underscore-dangle */
import { dedent } from 'ts-dedent';
import yaml from 'js-yaml';
import { loadCsf } from './CsfFile';

expect.addSnapshotSerializer({
  print: (val: any) => yaml.dump(val).trimEnd(),
  test: (val) => typeof val !== 'string',
});

const makeTitle = (userTitle?: string) => {
  return userTitle || 'Default Title';
};

const parse = (code: string, includeParameters?: boolean) => {
  const { stories, meta } = loadCsf(code, { makeTitle }).parse();
  const filtered = includeParameters
    ? stories
    : stories.map(({ id, name, parameters, ...rest }) => ({ id, name, ...rest }));
  return { meta, stories: filtered };
};

describe('CsfFile', () => {
  describe('basic', () => {
    it('args stories', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          export const A = () => {};
          export const B = (args) => {};
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: A
            parameters:
              __isArgsStory: false
              __id: foo-bar--a
          - id: foo-bar--b
            name: B
            parameters:
              __isArgsStory: true
              __id: foo-bar--b
      `);
    });

    it('exported const stories', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          const A = () => {};
          const B = (args) => {};
          export { A, B };
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: A
            parameters:
              __id: foo-bar--a
          - id: foo-bar--b
            name: B
            parameters:
              __id: foo-bar--b
      `);
    });

    it('underscores', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          export const __Basic__ = () => {};
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--basic
            name: Basic
            parameters:
              __isArgsStory: false
              __id: foo-bar--basic
      `);
    });

    it('exclude stories', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar', excludeStories: ['B', 'C'] };
          export const A = () => {};
          export const B = (args) => {};
          export const C = () => {};
        `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
          excludeStories:
            - B
            - C
        stories:
          - id: foo-bar--a
            name: A
      `);
    });

    it('include stories', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar', includeStories: /^Include.*/ };
          export const SomeHelper = () => {};
          export const IncludeA = () => {};
        `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
          includeStories: !<tag:yaml.org,2002:js/regexp> /^Include.*/
        stories:
          - id: foo-bar--include-a
            name: Include A
      `);
    });

    it('storyName annotation', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          export const A = () => {};
          A.storyName = 'Some story';
      `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: Some story
      `);
    });

    it('no title', () => {
      expect(
        parse(
          dedent`
          export default { component: 'foo' }
          export const A = () => {};
          export const B = () => {};
      `
        )
      ).toMatchInlineSnapshot(`
        meta:
          component: '''foo'''
          title: Default Title
        stories:
          - id: default-title--a
            name: A
          - id: default-title--b
            name: B
      `);
    });

    it('custom component id', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar', id: 'custom-id' };
          export const A = () => {};
          export const B = () => {};
      `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
          id: custom-id
        stories:
          - id: custom-id--a
            name: A
          - id: custom-id--b
            name: B
      `);
    });

    it('typescript', () => {
      expect(
        parse(
          dedent`
          import type { Meta, StoryFn } from '@storybook/react';
          type PropTypes = {};
          export default { title: 'foo/bar/baz' } as Meta<PropTypes>;
          export const A: StoryFn<PropTypes> = () => <>A</>;
          export const B: StoryFn<PropTypes> = () => <>B</>;
        `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar/baz
        stories:
          - id: foo-bar-baz--a
            name: A
          - id: foo-bar-baz--b
            name: B
      `);
    });

    it('typescript satisfies', () => {
      expect(
        parse(
          dedent`
          import type { Meta, StoryFn } from '@storybook/react';
          type PropTypes = {};
          export default { title: 'foo/bar/baz' } as Meta<PropTypes>;
          export const A: StoryFn<PropTypes> = () => <>A</>;
          export const B: StoryFn<PropTypes> = () => <>B</>;
        `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar/baz
        stories:
          - id: foo-bar-baz--a
            name: A
          - id: foo-bar-baz--b
            name: B
      `);
    });

    it('typescript meta var', () => {
      expect(
        parse(
          dedent`
          import type { Meta, StoryFn } from '@storybook/react';
          type PropTypes = {};
          const meta = { title: 'foo/bar/baz' } as Meta<PropTypes>;
          export default meta;
          export const A: StoryFn<PropTypes> = () => <>A</>;
          export const B: StoryFn<PropTypes> = () => <>B</>;
        `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar/baz
        stories:
          - id: foo-bar-baz--a
            name: A
          - id: foo-bar-baz--b
            name: B
      `);
    });

    it('typescript satisfies meta var', () => {
      expect(
        parse(
          dedent`
          import type { Meta, StoryFn } from '@storybook/react';
          type PropTypes = {};
          const meta = { title: 'foo/bar/baz' } satisfies Meta<PropTypes>;
          export default meta;
          export const A: StoryFn<PropTypes> = () => <>A</>;
          export const B: StoryFn<PropTypes> = () => <>B</>;
        `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar/baz
        stories:
          - id: foo-bar-baz--a
            name: A
          - id: foo-bar-baz--b
            name: B
      `);
    });

    it('component object', () => {
      expect(
        parse(
          dedent`
          export default { component: {} }
          export const A = () => {};
          export const B = () => {};
      `
        )
      ).toMatchInlineSnapshot(`
        meta:
          component: '{}'
          title: Default Title
        stories:
          - id: default-title--a
            name: A
          - id: default-title--b
            name: B
      `);
    });

    it('template bind', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          const Template = (args) => { };
          export const A = Template.bind({});
          A.args = { x: 1 };
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: A
            parameters:
              __isArgsStory: true
              __id: foo-bar--a
      `);
    });

    it('meta variable', () => {
      expect(
        parse(
          dedent`
          const meta = { title: 'foo/bar' };
          export default meta;
          export const A = () => {}
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: A
            parameters:
              __isArgsStory: false
              __id: foo-bar--a
      `);
    });

    it('docs-only story', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          export const __page = () => {};
          __page.parameters = { docsOnly: true };
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--page
            name: Page
            parameters:
              __isArgsStory: false
              __id: foo-bar--page
              docsOnly: true
      `);
    });

    it('title variable', () => {
      expect(
        parse(
          dedent`
            const title = 'foo/bar';
            export default { title };
            export const A = () => {};
            export const B = (args) => {};
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: A
            parameters:
              __isArgsStory: false
              __id: foo-bar--a
          - id: foo-bar--b
            name: B
            parameters:
              __isArgsStory: true
              __id: foo-bar--b
      `);
    });

    it('re-exported stories', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          export { default as A } from './A';
          export { B } from './B';
        `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: A
          - id: foo-bar--b
            name: B
      `);
    });

    it('named exports order', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          export const A = () => {};
          export const B = (args) => {};
          export const __namedExportsOrder = ['B', 'A'];
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--b
            name: B
            parameters:
              __isArgsStory: true
              __id: foo-bar--b
          - id: foo-bar--a
            name: A
            parameters:
              __isArgsStory: false
              __id: foo-bar--a
      `);
    });

    it('as default export', () => {
      expect(
        parse(
          dedent`
          const meta = { title: 'foo/bar' };
          export const A = () => {};
          export {
            meta as default,
            A
          };
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: A
            parameters:
              __id: foo-bar--a
      `);
    });
  });

  describe('error handling', () => {
    it('no meta', () => {
      expect(() =>
        parse(
          dedent`
          export const A = () => {};
          export const B = () => {};
      `
        )
      ).toThrow('CSF: missing default export');
    });

    it('no metadata', () => {
      expect(() =>
        parse(
          dedent`
          export default { foo: '5' };
          export const A = () => {};
          export const B = () => {};
      `
        )
      ).toThrow('CSF: missing title/component');
    });

    it('dynamic titles', () => {
      expect(() =>
        parse(
          dedent`
            export default { title: 'foo' + 'bar' };
            export const A = () => {};
        `,
          true
        )
      ).toThrow('CSF: unexpected dynamic title');
    });

    it('storiesOf calls', () => {
      expect(() =>
        parse(
          dedent`
            import { storiesOf } from '@storybook/react';
            export default { title: 'foo/bar' };
            export const A = () => {};
            storiesOf('foo').add('bar', () => <baz />);
        `,
          true
        )
      ).toThrow('CSF: unexpected storiesOf call');
    });

    it('function exports', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          export function A() {}
          export function B() {}
      `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: A
          - id: foo-bar--b
            name: B
      `);
    });
  });

  // NOTE: this does not have a public API, but we can still test it
  describe('indexed annotations', () => {
    it('meta annotations', () => {
      const input = dedent`
        export default { title: 'foo/bar', x: 1, y: 2 };
      `;
      const csf = loadCsf(input, { makeTitle }).parse();
      expect(Object.keys(csf._metaAnnotations)).toEqual(['title', 'x', 'y']);
    });

    it('story annotations', () => {
      const input = dedent`
        export default { title: 'foo/bar' };
        export const A = () => {};
        A.x = 1;
        A.y = 2;
        export const B = () => {};
        B.z = 3;
    `;
      const csf = loadCsf(input, { makeTitle }).parse();
      expect(Object.keys(csf._storyAnnotations.A)).toEqual(['x', 'y']);
      expect(Object.keys(csf._storyAnnotations.B)).toEqual(['z']);
    });

    it('v1-style story annotations', () => {
      const input = dedent`
        export default { title: 'foo/bar' };
        export const A = () => {};
        A.story = {
          x: 1,
          y: 2,
        }
        export const B = () => {};
        B.story = {
          z: 3,
        }
    `;
      const csf = loadCsf(input, { makeTitle }).parse();
      expect(Object.keys(csf._storyAnnotations.A)).toEqual(['x', 'y']);
      expect(Object.keys(csf._storyAnnotations.B)).toEqual(['z']);
    });
  });

  describe('CSF3', () => {
    it('Object export with no-args render', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          export const A = {
            render: () => {}
          }
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: A
            parameters:
              __isArgsStory: false
              __id: foo-bar--a
      `);
    });

    it('Object export with args render', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          export const A = {
            render: (args) => {}
          }
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: A
            parameters:
              __isArgsStory: true
              __id: foo-bar--a
      `);
    });

    it('Object export with default render', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          export const A = {}
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: A
            parameters:
              __isArgsStory: true
              __id: foo-bar--a
      `);
    });

    it('Object export with name', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar' };
          export const A = {
            name: 'Apple'
          }
        `,
          true
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
        stories:
          - id: foo-bar--a
            name: Apple
            parameters:
              __isArgsStory: true
              __id: foo-bar--a
      `);
    });

    it('Object export with storyName', () => {
      const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

      parse(
        dedent`
        export default { title: 'foo/bar' };
        export const A = {
          storyName: 'Apple'
        }
      `,
        true
      );

      expect(consoleWarnMock).toHaveBeenCalledWith(
        'Unexpected usage of "storyName" in "A". Please use "name" instead.'
      );
      consoleWarnMock.mockRestore();
    });
  });

  describe('import handling', () => {
    it('imports', () => {
      const input = dedent`
        import Button from './Button';
        import { Check } from './Check';
        export default { title: 'foo/bar', x: 1, y: 2 };
      `;
      const csf = loadCsf(input, { makeTitle }).parse();
      expect(csf.imports).toMatchInlineSnapshot(`
        - ./Button
        - ./Check
      `);
    });
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('dynamic imports', () => {
      const input = dedent`
        const Button = await import('./Button');
        export default { title: 'foo/bar', x: 1, y: 2 };
      `;
      const csf = loadCsf(input, { makeTitle }).parse();
      expect(csf.imports).toMatchInlineSnapshot();
    });
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('requires', () => {
      const input = dedent`
        const Button = require('./Button');
        export default { title: 'foo/bar', x: 1, y: 2 };
      `;
      const csf = loadCsf(input, { makeTitle }).parse();
      expect(csf.imports).toMatchInlineSnapshot();
    });
  });

  describe('tags', () => {
    it('csf2', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar', tags: ['X'] };
          export const A = () => {};
          A.tags = ['Y'];
        `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
          tags:
            - X
        stories:
          - id: foo-bar--a
            name: A
            tags:
              - 'Y'
      `);
    });

    it('csf3', () => {
      expect(
        parse(
          dedent`
          export default { title: 'foo/bar', tags: ['X'] };
          export const A = {
            render: () => {},
            tags: ['Y'],
          };
        `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
          tags:
            - X
        stories:
          - id: foo-bar--a
            name: A
            tags:
              - 'Y'
      `);
    });

    it('variables', () => {
      expect(
        parse(
          dedent`
          const x = ['X'];
          const y = ['Y'];
          export default { title: 'foo/bar', tags: x };
          export const A = {
            render: () => {},
            tags: y,
          };
        `
        )
      ).toMatchInlineSnapshot(`
        meta:
          title: foo/bar
          tags:
            - X
        stories:
          - id: foo-bar--a
            name: A
            tags:
              - 'Y'
      `);
    });

    it('array error', () => {
      expect(() =>
        parse(
          dedent`
            export default { title: 'foo/bar', tags: 'X' };
            export const A = {
              render: () => {},
            };
          `
        )
      ).toThrow('CSF: Expected tags array');
    });

    it('array element handling', () => {
      expect(() =>
        parse(
          dedent`
            export default { title: 'foo/bar', tags: [10] };
            export const A = {
              render: () => {},
            };
          `
        )
      ).toThrow('CSF: Expected tag to be string literal');
    });
  });
});
