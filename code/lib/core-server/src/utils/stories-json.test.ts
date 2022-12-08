/// <reference types="@types/jest" />;

import fs from 'fs-extra';
import type { Router, Request, Response } from 'express';
import Watchpack from 'watchpack';
import path from 'path';
import debounce from 'lodash/debounce';
import { STORY_INDEX_INVALIDATED } from '@storybook/core-events';
import type { StoryIndex, StoryIndexer } from '@storybook/types';
import { loadCsf } from '@storybook/csf-tools';
import { normalizeStoriesEntry } from '@storybook/core-common';

import { useStoriesJson, DEBOUNCE, convertToIndexV3 } from './stories-json';
import type { ServerChannel } from './get-server-channel';
import { StoryIndexGenerator } from './StoryIndexGenerator';

jest.mock('watchpack');
jest.mock('lodash/debounce');

const workingDir = path.join(__dirname, '__mockdata__');
const normalizedStories = [
  normalizeStoriesEntry(
    {
      titlePrefix: '',
      directory: './src',
      files: '**/*.stories.@(ts|js|jsx)',
    },
    { workingDir, configDir: workingDir }
  ),
  normalizeStoriesEntry(
    {
      titlePrefix: '',
      directory: './src',
      files: '**/*.mdx',
    },
    { workingDir, configDir: workingDir }
  ),
];

const csfIndexer = async (fileName: string, opts: any) => {
  const code = (await fs.readFile(fileName, 'utf-8')).toString();
  return loadCsf(code, { ...opts, fileName }).parse();
};

const storiesMdxIndexer = async (fileName: string, opts: any) => {
  let code = (await fs.readFile(fileName, 'utf-8')).toString();
  const { compile } = await import('@storybook/mdx2-csf');
  code = await compile(code, {});
  return loadCsf(code, { ...opts, fileName }).parse();
};

const getInitializedStoryIndexGenerator = async (
  overrides: any = {},
  inputNormalizedStories = normalizedStories
) => {
  const generator = new StoryIndexGenerator(inputNormalizedStories, {
    storyIndexers: [
      { test: /\.stories\.mdx$/, indexer: storiesMdxIndexer },
      { test: /\.stories\.(js|ts)x?$/, indexer: csfIndexer },
    ] as StoryIndexer[],
    configDir: workingDir,
    workingDir,
    storiesV2Compatibility: false,
    storyStoreV7: true,
    docs: { enabled: true, defaultName: 'docs', docsPage: false },
    ...overrides,
  });
  await generator.initialize();
  return generator;
};

describe('useStoriesJson', () => {
  const use = jest.fn();
  const router: Router = { use } as any;
  const send = jest.fn();
  const write = jest.fn();
  const response: Response = {
    header: jest.fn(),
    send,
    status: jest.fn(),
    setHeader: jest.fn(),
    flushHeaders: jest.fn(),
    write,
    flush: jest.fn(),
    end: jest.fn(),
    on: jest.fn(),
  } as any;

  beforeEach(async () => {
    use.mockClear();
    send.mockClear();
    write.mockClear();
    (debounce as jest.Mock).mockImplementation((cb) => cb);
  });

  const request: Request = {
    headers: { accept: 'application/json' },
  } as any;

  describe('JSON endpoint', () => {
    it('scans and extracts index', async () => {
      const mockServerChannel = { emit: jest.fn() } as any as ServerChannel;
      useStoriesJson({
        router,
        serverChannel: mockServerChannel,
        workingDir,
        normalizedStories,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator(),
      });

      expect(use).toHaveBeenCalledTimes(2);
      const route = use.mock.calls[0][1];

      await route(request, response);

      expect(send).toHaveBeenCalledTimes(1);
      expect(JSON.parse(send.mock.calls[0][0])).toMatchInlineSnapshot(`
        Object {
          "entries": Object {
            "a--docs": Object {
              "id": "a--docs",
              "importPath": "./src/docs2/MetaOf.mdx",
              "name": "docs",
              "standalone": true,
              "storiesImports": Array [
                "./src/A.stories.js",
              ],
              "tags": Array [
                "docs",
                "mdx",
              ],
              "title": "A",
              "type": "docs",
            },
            "a--second-docs": Object {
              "id": "a--second-docs",
              "importPath": "./src/docs2/SecondMetaOf.mdx",
              "name": "Second Docs",
              "standalone": true,
              "storiesImports": Array [
                "./src/A.stories.js",
              ],
              "tags": Array [
                "docs",
                "mdx",
              ],
              "title": "A",
              "type": "docs",
            },
            "a--story-one": Object {
              "id": "a--story-one",
              "importPath": "./src/A.stories.js",
              "name": "Story One",
              "tags": Array [
                "story-tag",
                "story",
              ],
              "title": "A",
              "type": "story",
            },
            "b--story-one": Object {
              "id": "b--story-one",
              "importPath": "./src/B.stories.ts",
              "name": "Story One",
              "tags": Array [
                "docsPage",
                "story",
              ],
              "title": "B",
              "type": "story",
            },
            "d--story-one": Object {
              "id": "d--story-one",
              "importPath": "./src/D.stories.jsx",
              "name": "Story One",
              "tags": Array [
                "docsPage",
                "story",
              ],
              "title": "D",
              "type": "story",
            },
            "docs2-notitle--docs": Object {
              "id": "docs2-notitle--docs",
              "importPath": "./src/docs2/NoTitle.mdx",
              "name": "docs",
              "standalone": true,
              "storiesImports": Array [],
              "tags": Array [
                "docs",
                "mdx",
              ],
              "title": "docs2/NoTitle",
              "type": "docs",
            },
            "docs2-yabbadabbadooo--docs": Object {
              "id": "docs2-yabbadabbadooo--docs",
              "importPath": "./src/docs2/Title.mdx",
              "name": "docs",
              "standalone": true,
              "storiesImports": Array [],
              "tags": Array [
                "docs",
                "mdx",
              ],
              "title": "docs2/Yabbadabbadooo",
              "type": "docs",
            },
            "first-nested-deeply-f--story-one": Object {
              "id": "first-nested-deeply-f--story-one",
              "importPath": "./src/first-nested/deeply/F.stories.js",
              "name": "Story One",
              "tags": Array [
                "story",
              ],
              "title": "first-nested/deeply/F",
              "type": "story",
            },
            "nested-button--story-one": Object {
              "id": "nested-button--story-one",
              "importPath": "./src/nested/Button.stories.ts",
              "name": "Story One",
              "tags": Array [
                "component-tag",
                "story",
              ],
              "title": "nested/Button",
              "type": "story",
            },
            "nested-page--docs": Object {
              "id": "nested-page--docs",
              "importPath": "./src/nested/Page.stories.mdx",
              "name": "docs",
              "standalone": false,
              "storiesImports": Array [],
              "tags": Array [
                "mdx",
                "docs",
              ],
              "title": "nested/Page",
              "type": "docs",
            },
            "nested-page--story-one": Object {
              "id": "nested-page--story-one",
              "importPath": "./src/nested/Page.stories.mdx",
              "name": "StoryOne",
              "tags": Array [
                "mdx",
                "story",
              ],
              "title": "nested/Page",
              "type": "story",
            },
            "second-nested-g--story-one": Object {
              "id": "second-nested-g--story-one",
              "importPath": "./src/second-nested/G.stories.ts",
              "name": "Story One",
              "tags": Array [
                "story",
              ],
              "title": "second-nested/G",
              "type": "story",
            },
          },
          "v": 4,
        }
      `);
    });

    it('scans and extracts stories v3', async () => {
      const mockServerChannel = { emit: jest.fn() } as any as ServerChannel;
      useStoriesJson({
        router,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator(),
        workingDir,
        serverChannel: mockServerChannel,
        normalizedStories,
      });

      expect(use).toHaveBeenCalledTimes(2);
      const route = use.mock.calls[1][1];

      await route(request, response);

      expect(send).toHaveBeenCalledTimes(1);
      expect(JSON.parse(send.mock.calls[0][0])).toMatchInlineSnapshot(`
        Object {
          "stories": Object {
            "a--docs": Object {
              "id": "a--docs",
              "importPath": "./src/docs2/MetaOf.mdx",
              "kind": "A",
              "name": "docs",
              "parameters": Object {
                "__id": "a--docs",
                "docsOnly": true,
                "fileName": "./src/docs2/MetaOf.mdx",
              },
              "standalone": true,
              "storiesImports": Array [
                "./src/A.stories.js",
              ],
              "story": "docs",
              "tags": Array [
                "docs",
                "mdx",
              ],
              "title": "A",
            },
            "a--second-docs": Object {
              "id": "a--second-docs",
              "importPath": "./src/docs2/SecondMetaOf.mdx",
              "kind": "A",
              "name": "Second Docs",
              "parameters": Object {
                "__id": "a--second-docs",
                "docsOnly": true,
                "fileName": "./src/docs2/SecondMetaOf.mdx",
              },
              "standalone": true,
              "storiesImports": Array [
                "./src/A.stories.js",
              ],
              "story": "Second Docs",
              "tags": Array [
                "docs",
                "mdx",
              ],
              "title": "A",
            },
            "a--story-one": Object {
              "id": "a--story-one",
              "importPath": "./src/A.stories.js",
              "kind": "A",
              "name": "Story One",
              "parameters": Object {
                "__id": "a--story-one",
                "docsOnly": false,
                "fileName": "./src/A.stories.js",
              },
              "story": "Story One",
              "tags": Array [
                "story-tag",
                "story",
              ],
              "title": "A",
            },
            "b--story-one": Object {
              "id": "b--story-one",
              "importPath": "./src/B.stories.ts",
              "kind": "B",
              "name": "Story One",
              "parameters": Object {
                "__id": "b--story-one",
                "docsOnly": false,
                "fileName": "./src/B.stories.ts",
              },
              "story": "Story One",
              "tags": Array [
                "docsPage",
                "story",
              ],
              "title": "B",
            },
            "d--story-one": Object {
              "id": "d--story-one",
              "importPath": "./src/D.stories.jsx",
              "kind": "D",
              "name": "Story One",
              "parameters": Object {
                "__id": "d--story-one",
                "docsOnly": false,
                "fileName": "./src/D.stories.jsx",
              },
              "story": "Story One",
              "tags": Array [
                "docsPage",
                "story",
              ],
              "title": "D",
            },
            "docs2-notitle--docs": Object {
              "id": "docs2-notitle--docs",
              "importPath": "./src/docs2/NoTitle.mdx",
              "kind": "docs2/NoTitle",
              "name": "docs",
              "parameters": Object {
                "__id": "docs2-notitle--docs",
                "docsOnly": true,
                "fileName": "./src/docs2/NoTitle.mdx",
              },
              "standalone": true,
              "storiesImports": Array [],
              "story": "docs",
              "tags": Array [
                "docs",
                "mdx",
              ],
              "title": "docs2/NoTitle",
            },
            "docs2-yabbadabbadooo--docs": Object {
              "id": "docs2-yabbadabbadooo--docs",
              "importPath": "./src/docs2/Title.mdx",
              "kind": "docs2/Yabbadabbadooo",
              "name": "docs",
              "parameters": Object {
                "__id": "docs2-yabbadabbadooo--docs",
                "docsOnly": true,
                "fileName": "./src/docs2/Title.mdx",
              },
              "standalone": true,
              "storiesImports": Array [],
              "story": "docs",
              "tags": Array [
                "docs",
                "mdx",
              ],
              "title": "docs2/Yabbadabbadooo",
            },
            "first-nested-deeply-f--story-one": Object {
              "id": "first-nested-deeply-f--story-one",
              "importPath": "./src/first-nested/deeply/F.stories.js",
              "kind": "first-nested/deeply/F",
              "name": "Story One",
              "parameters": Object {
                "__id": "first-nested-deeply-f--story-one",
                "docsOnly": false,
                "fileName": "./src/first-nested/deeply/F.stories.js",
              },
              "story": "Story One",
              "tags": Array [
                "story",
              ],
              "title": "first-nested/deeply/F",
            },
            "nested-button--story-one": Object {
              "id": "nested-button--story-one",
              "importPath": "./src/nested/Button.stories.ts",
              "kind": "nested/Button",
              "name": "Story One",
              "parameters": Object {
                "__id": "nested-button--story-one",
                "docsOnly": false,
                "fileName": "./src/nested/Button.stories.ts",
              },
              "story": "Story One",
              "tags": Array [
                "component-tag",
                "story",
              ],
              "title": "nested/Button",
            },
            "nested-page--docs": Object {
              "id": "nested-page--docs",
              "importPath": "./src/nested/Page.stories.mdx",
              "kind": "nested/Page",
              "name": "docs",
              "parameters": Object {
                "__id": "nested-page--docs",
                "docsOnly": true,
                "fileName": "./src/nested/Page.stories.mdx",
              },
              "standalone": false,
              "storiesImports": Array [],
              "story": "docs",
              "tags": Array [
                "mdx",
                "docs",
              ],
              "title": "nested/Page",
            },
            "nested-page--story-one": Object {
              "id": "nested-page--story-one",
              "importPath": "./src/nested/Page.stories.mdx",
              "kind": "nested/Page",
              "name": "StoryOne",
              "parameters": Object {
                "__id": "nested-page--story-one",
                "docsOnly": false,
                "fileName": "./src/nested/Page.stories.mdx",
              },
              "story": "StoryOne",
              "tags": Array [
                "mdx",
                "story",
              ],
              "title": "nested/Page",
            },
            "second-nested-g--story-one": Object {
              "id": "second-nested-g--story-one",
              "importPath": "./src/second-nested/G.stories.ts",
              "kind": "second-nested/G",
              "name": "Story One",
              "parameters": Object {
                "__id": "second-nested-g--story-one",
                "docsOnly": false,
                "fileName": "./src/second-nested/G.stories.ts",
              },
              "story": "Story One",
              "tags": Array [
                "story",
              ],
              "title": "second-nested/G",
            },
          },
          "v": 3,
        }
      `);
    });

    it('scans and extracts stories v2', async () => {
      const mockServerChannel = { emit: jest.fn() } as any as ServerChannel;
      useStoriesJson({
        router,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator({
          storiesV2Compatibility: true,
        }),
        workingDir,
        serverChannel: mockServerChannel,
        normalizedStories,
      });

      expect(use).toHaveBeenCalledTimes(2);
      const route = use.mock.calls[1][1];

      await route(request, response);

      expect(send).toHaveBeenCalledTimes(1);
      expect(JSON.parse(send.mock.calls[0][0])).toMatchInlineSnapshot(`
        Object {
          "stories": Object {
            "a--story-one": Object {
              "id": "a--story-one",
              "importPath": "./src/A.stories.js",
              "kind": "A",
              "name": "Story One",
              "parameters": Object {
                "__id": "a--story-one",
                "docsOnly": false,
                "fileName": "./src/A.stories.js",
              },
              "story": "Story One",
              "tags": Array [
                "story-tag",
                "story",
              ],
              "title": "A",
            },
            "b--story-one": Object {
              "id": "b--story-one",
              "importPath": "./src/B.stories.ts",
              "kind": "B",
              "name": "Story One",
              "parameters": Object {
                "__id": "b--story-one",
                "docsOnly": false,
                "fileName": "./src/B.stories.ts",
              },
              "story": "Story One",
              "tags": Array [
                "docsPage",
                "story",
              ],
              "title": "B",
            },
            "d--story-one": Object {
              "id": "d--story-one",
              "importPath": "./src/D.stories.jsx",
              "kind": "D",
              "name": "Story One",
              "parameters": Object {
                "__id": "d--story-one",
                "docsOnly": false,
                "fileName": "./src/D.stories.jsx",
              },
              "story": "Story One",
              "tags": Array [
                "docsPage",
                "story",
              ],
              "title": "D",
            },
            "first-nested-deeply-f--story-one": Object {
              "id": "first-nested-deeply-f--story-one",
              "importPath": "./src/first-nested/deeply/F.stories.js",
              "kind": "first-nested/deeply/F",
              "name": "Story One",
              "parameters": Object {
                "__id": "first-nested-deeply-f--story-one",
                "docsOnly": false,
                "fileName": "./src/first-nested/deeply/F.stories.js",
              },
              "story": "Story One",
              "tags": Array [
                "story",
              ],
              "title": "first-nested/deeply/F",
            },
            "nested-button--story-one": Object {
              "id": "nested-button--story-one",
              "importPath": "./src/nested/Button.stories.ts",
              "kind": "nested/Button",
              "name": "Story One",
              "parameters": Object {
                "__id": "nested-button--story-one",
                "docsOnly": false,
                "fileName": "./src/nested/Button.stories.ts",
              },
              "story": "Story One",
              "tags": Array [
                "component-tag",
                "story",
              ],
              "title": "nested/Button",
            },
            "nested-page--story-one": Object {
              "id": "nested-page--story-one",
              "importPath": "./src/nested/Page.stories.mdx",
              "kind": "nested/Page",
              "name": "StoryOne",
              "parameters": Object {
                "__id": "nested-page--story-one",
                "docsOnly": false,
                "fileName": "./src/nested/Page.stories.mdx",
              },
              "story": "StoryOne",
              "tags": Array [
                "mdx",
                "story",
              ],
              "title": "nested/Page",
            },
            "second-nested-g--story-one": Object {
              "id": "second-nested-g--story-one",
              "importPath": "./src/second-nested/G.stories.ts",
              "kind": "second-nested/G",
              "name": "Story One",
              "parameters": Object {
                "__id": "second-nested-g--story-one",
                "docsOnly": false,
                "fileName": "./src/second-nested/G.stories.ts",
              },
              "story": "Story One",
              "tags": Array [
                "story",
              ],
              "title": "second-nested/G",
            },
          },
          "v": 3,
        }
      `);
    });

    it('disallows .mdx files without storyStoreV7', async () => {
      const mockServerChannel = { emit: jest.fn() } as any as ServerChannel;
      useStoriesJson({
        router,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator({
          storyStoreV7: false,
        }),
        workingDir,
        serverChannel: mockServerChannel,
        normalizedStories,
      });

      expect(use).toHaveBeenCalledTimes(2);
      const route = use.mock.calls[1][1];

      await route(request, response);

      expect(send).toHaveBeenCalledTimes(1);
      expect(send.mock.calls[0][0]).toEqual(
        'You cannot use `.mdx` files without using `storyStoreV7`.'
      );
    });

    it('allows disabling storyStoreV7 if no .mdx files are used', async () => {
      const mockServerChannel = { emit: jest.fn() } as any as ServerChannel;
      useStoriesJson({
        router,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator(
          { storyStoreV7: false },
          normalizedStories.slice(0, 1)
        ),
        workingDir,
        serverChannel: mockServerChannel,
        normalizedStories,
      });

      expect(use).toHaveBeenCalledTimes(2);
      const route = use.mock.calls[1][1];

      await route(request, response);

      expect(send).toHaveBeenCalledTimes(1);
      expect(JSON.parse(send.mock.calls[0][0])).toMatchInlineSnapshot(`
        Object {
          "stories": Object {
            "a--story-one": Object {
              "id": "a--story-one",
              "importPath": "./src/A.stories.js",
              "kind": "A",
              "name": "Story One",
              "parameters": Object {
                "__id": "a--story-one",
                "docsOnly": false,
                "fileName": "./src/A.stories.js",
              },
              "story": "Story One",
              "tags": Array [
                "story-tag",
                "story",
              ],
              "title": "A",
            },
            "b--story-one": Object {
              "id": "b--story-one",
              "importPath": "./src/B.stories.ts",
              "kind": "B",
              "name": "Story One",
              "parameters": Object {
                "__id": "b--story-one",
                "docsOnly": false,
                "fileName": "./src/B.stories.ts",
              },
              "story": "Story One",
              "tags": Array [
                "docsPage",
                "story",
              ],
              "title": "B",
            },
            "d--story-one": Object {
              "id": "d--story-one",
              "importPath": "./src/D.stories.jsx",
              "kind": "D",
              "name": "Story One",
              "parameters": Object {
                "__id": "d--story-one",
                "docsOnly": false,
                "fileName": "./src/D.stories.jsx",
              },
              "story": "Story One",
              "tags": Array [
                "docsPage",
                "story",
              ],
              "title": "D",
            },
            "first-nested-deeply-f--story-one": Object {
              "id": "first-nested-deeply-f--story-one",
              "importPath": "./src/first-nested/deeply/F.stories.js",
              "kind": "first-nested/deeply/F",
              "name": "Story One",
              "parameters": Object {
                "__id": "first-nested-deeply-f--story-one",
                "docsOnly": false,
                "fileName": "./src/first-nested/deeply/F.stories.js",
              },
              "story": "Story One",
              "tags": Array [
                "story",
              ],
              "title": "first-nested/deeply/F",
            },
            "nested-button--story-one": Object {
              "id": "nested-button--story-one",
              "importPath": "./src/nested/Button.stories.ts",
              "kind": "nested/Button",
              "name": "Story One",
              "parameters": Object {
                "__id": "nested-button--story-one",
                "docsOnly": false,
                "fileName": "./src/nested/Button.stories.ts",
              },
              "story": "Story One",
              "tags": Array [
                "component-tag",
                "story",
              ],
              "title": "nested/Button",
            },
            "second-nested-g--story-one": Object {
              "id": "second-nested-g--story-one",
              "importPath": "./src/second-nested/G.stories.ts",
              "kind": "second-nested/G",
              "name": "Story One",
              "parameters": Object {
                "__id": "second-nested-g--story-one",
                "docsOnly": false,
                "fileName": "./src/second-nested/G.stories.ts",
              },
              "story": "Story One",
              "tags": Array [
                "story",
              ],
              "title": "second-nested/G",
            },
          },
          "v": 3,
        }
      `);
    });

    it('can handle simultaneous access', async () => {
      const mockServerChannel = { emit: jest.fn() } as any as ServerChannel;

      useStoriesJson({
        router,
        serverChannel: mockServerChannel,
        workingDir,
        normalizedStories,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator(),
      });

      expect(use).toHaveBeenCalledTimes(2);
      const route = use.mock.calls[0][1];

      const firstPromise = route(request, response);
      const secondResponse = { ...response, send: jest.fn(), status: jest.fn() };
      const secondPromise = route(request, secondResponse);

      await Promise.all([firstPromise, secondPromise]);

      expect(send).toHaveBeenCalledTimes(1);
      expect(response.status).not.toEqual(500);
      expect(secondResponse.send).toHaveBeenCalledTimes(1);
      expect(secondResponse.status).not.toEqual(500);
    });
  });

  describe('SSE endpoint', () => {
    beforeEach(() => {
      use.mockClear();
      send.mockClear();
    });

    it('sends invalidate events', async () => {
      const mockServerChannel = { emit: jest.fn() } as any as ServerChannel;
      useStoriesJson({
        router,
        serverChannel: mockServerChannel,
        workingDir,
        normalizedStories,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator(),
      });

      expect(use).toHaveBeenCalledTimes(2);
      const route = use.mock.calls[0][1];

      await route(request, response);

      expect(write).not.toHaveBeenCalled();

      expect(Watchpack).toHaveBeenCalledTimes(1);
      const watcher = Watchpack.mock.instances[0];
      expect(watcher.watch).toHaveBeenCalledWith({ directories: ['./src'] });

      expect(watcher.on).toHaveBeenCalledTimes(2);
      const onChange = watcher.on.mock.calls[0][1];

      await onChange('src/nested/Button.stories.ts');
      expect(mockServerChannel.emit).toHaveBeenCalledTimes(1);
      expect(mockServerChannel.emit).toHaveBeenCalledWith(STORY_INDEX_INVALIDATED);
    });

    it('only sends one invalidation when multiple event listeners are listening', async () => {
      const mockServerChannel = { emit: jest.fn() } as any as ServerChannel;
      useStoriesJson({
        router,
        serverChannel: mockServerChannel,
        workingDir,
        normalizedStories,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator(),
      });

      expect(use).toHaveBeenCalledTimes(2);
      const route = use.mock.calls[0][1];

      // Don't wait for the first request here before starting the second
      await Promise.all([
        route(request, response),
        route(request, { ...response, write: jest.fn() }),
      ]);

      expect(write).not.toHaveBeenCalled();

      expect(Watchpack).toHaveBeenCalledTimes(1);
      const watcher = Watchpack.mock.instances[0];
      expect(watcher.watch).toHaveBeenCalledWith({ directories: ['./src'] });

      expect(watcher.on).toHaveBeenCalledTimes(2);
      const onChange = watcher.on.mock.calls[0][1];

      await onChange('src/nested/Button.stories.ts');
      expect(mockServerChannel.emit).toHaveBeenCalledTimes(1);
      expect(mockServerChannel.emit).toHaveBeenCalledWith(STORY_INDEX_INVALIDATED);
    });

    it('debounces invalidation events', async () => {
      (debounce as jest.Mock).mockImplementation(jest.requireActual('lodash/debounce') as any);

      const mockServerChannel = { emit: jest.fn() } as any as ServerChannel;
      useStoriesJson({
        router,
        serverChannel: mockServerChannel,
        workingDir,
        normalizedStories,
        initializedStoryIndexGenerator: getInitializedStoryIndexGenerator(),
      });

      expect(use).toHaveBeenCalledTimes(2);
      const route = use.mock.calls[0][1];

      await route(request, response);

      expect(write).not.toHaveBeenCalled();

      expect(Watchpack).toHaveBeenCalledTimes(1);
      const watcher = Watchpack.mock.instances[0];
      expect(watcher.watch).toHaveBeenCalledWith({ directories: ['./src'] });

      expect(watcher.on).toHaveBeenCalledTimes(2);
      const onChange = watcher.on.mock.calls[0][1];

      await onChange('src/nested/Button.stories.ts');
      await onChange('src/nested/Button.stories.ts');
      await onChange('src/nested/Button.stories.ts');
      await onChange('src/nested/Button.stories.ts');
      await onChange('src/nested/Button.stories.ts');

      expect(mockServerChannel.emit).toHaveBeenCalledTimes(1);
      expect(mockServerChannel.emit).toHaveBeenCalledWith(STORY_INDEX_INVALIDATED);

      await new Promise((r) => setTimeout(r, 2 * DEBOUNCE));

      expect(mockServerChannel.emit).toHaveBeenCalledTimes(2);
    });
  });
});

describe('convertToIndexV3', () => {
  it('converts v7 index.json to v6 stories.json', () => {
    const indexJson: StoryIndex = {
      v: 4,
      entries: {
        'a--docs': {
          id: 'a--docs',
          importPath: './src/docs2/MetaOf.mdx',
          name: 'docs',
          storiesImports: ['./src/A.stories.js'],
          title: 'A',
          type: 'docs',
          standalone: true,
        },
        'a--story-one': {
          id: 'a--story-one',
          importPath: './src/A.stories.js',
          name: 'Story One',
          title: 'A',
          type: 'story',
        },
        'b--story-one': {
          id: 'b--story-one',
          importPath: './src/B.stories.ts',
          name: 'Story One',
          title: 'B',
          type: 'story',
        },
      },
    };

    expect(convertToIndexV3(indexJson)).toMatchInlineSnapshot(`
      Object {
        "stories": Object {
          "a--docs": Object {
            "id": "a--docs",
            "importPath": "./src/docs2/MetaOf.mdx",
            "kind": "A",
            "name": "docs",
            "parameters": Object {
              "__id": "a--docs",
              "docsOnly": true,
              "fileName": "./src/docs2/MetaOf.mdx",
            },
            "standalone": true,
            "storiesImports": Array [
              "./src/A.stories.js",
            ],
            "story": "docs",
            "title": "A",
          },
          "a--story-one": Object {
            "id": "a--story-one",
            "importPath": "./src/A.stories.js",
            "kind": "A",
            "name": "Story One",
            "parameters": Object {
              "__id": "a--story-one",
              "docsOnly": false,
              "fileName": "./src/A.stories.js",
            },
            "story": "Story One",
            "title": "A",
          },
          "b--story-one": Object {
            "id": "b--story-one",
            "importPath": "./src/B.stories.ts",
            "kind": "B",
            "name": "Story One",
            "parameters": Object {
              "__id": "b--story-one",
              "docsOnly": false,
              "fileName": "./src/B.stories.ts",
            },
            "story": "Story One",
            "title": "B",
          },
        },
        "v": 3,
      }
    `);
  });
});
