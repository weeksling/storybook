import global from 'global';
import { getSourceType, init as initRefs } from '../modules/refs';

const { fetch } = global;

jest.mock('global', () => {
  const globalMock = {
    fetch: jest.fn(() => Promise.resolve({})),
    REFS: {
      fake: {
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      },
    },
  };
  // Change global.location value to handle edge cases
  // Add additional variations of global.location mock return values in this array.
  // NOTE: The order must match the order that global.location is called in the unit tests.
  const edgecaseLocations = [
    { origin: 'https://storybook.js.org', pathname: '/storybook/index.html' },
  ];
  // global.location value after all edgecaseLocations are returned
  const lastLocation = { origin: 'https://storybook.js.org', pathname: '/storybook/' };
  Object.defineProperties(globalMock, {
    location: {
      get: edgecaseLocations
        .reduce((mockFn, location) => mockFn.mockReturnValueOnce(location), jest.fn())
        .mockReturnValue(lastLocation),
    },
  });
  return globalMock;
});

const provider = {
  getConfig: jest.fn().mockReturnValue({}),
};

const store = {
  getState: jest.fn().mockReturnValue({
    refs: {
      fake: {
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      },
    },
  }),
  setState: jest.fn(() => {}),
};

const setupResponses = ({
  indexPrivate,
  indexPublic,
  storiesPrivate,
  storiesPublic,
  iframe,
  metadata,
}) => {
  fetch.mockClear();
  store.setState.mockClear();

  fetch.mockImplementation((l, o) => {
    if (l.includes('index') && o.credentials === 'include' && indexPrivate) {
      return Promise.resolve({
        ok: indexPrivate.ok,
        json: indexPrivate.response,
      });
    }
    if (l.includes('index') && o.credentials === 'omit' && indexPublic) {
      return Promise.resolve({
        ok: indexPublic.ok,
        json: indexPublic.response,
      });
    }
    if (l.includes('stories') && o.credentials === 'include' && storiesPrivate) {
      return Promise.resolve({
        ok: storiesPrivate.ok,
        json: storiesPrivate.response,
      });
    }
    if (l.includes('stories') && o.credentials === 'omit' && storiesPublic) {
      return Promise.resolve({
        ok: storiesPublic.ok,
        json: storiesPublic.response,
      });
    }
    if (l.includes('iframe') && iframe) {
      return Promise.resolve({
        ok: iframe.ok,
        json: iframe.response,
      });
    }
    if (l.includes('metadata') && metadata) {
      return Promise.resolve({
        ok: metadata.ok,
        json: metadata.response,
      });
    }
    throw new Error(`Called URL ${l} without setting up mock`);
  });
};

describe('Refs API', () => {
  describe('getSourceType(source)', () => {
    // These tests must be run first and in correct order.
    // The order matches the "edgecaseLocations" order in the 'global' mock function above.
    describe('edge cases', () => {
      it('returns "local" when source matches location with /index.html in path', () => {
        // mockReturnValue(edgecaseLocations[0])
        expect(getSourceType('https://storybook.js.org/storybook/iframe.html')).toEqual([
          'local',
          'https://storybook.js.org/storybook',
        ]);
      });
      it('returns "correct url" when source does not match location', () => {
        expect(getSourceType('https://external.com/storybook/')).toEqual([
          'external',
          'https://external.com/storybook',
        ]);
      });
    });
    // Other tests use "lastLocation" for the 'global' mock
    it('returns "local" when source matches location', () => {
      expect(getSourceType('https://storybook.js.org/storybook/iframe.html')).toEqual([
        'local',
        'https://storybook.js.org/storybook',
      ]);
    });
    it('returns "external" when source does not match location', () => {
      expect(getSourceType('https://external.com/storybook/iframe.html')).toEqual([
        'external',
        'https://external.com/storybook',
      ]);
    });
  });

  describe('checkRef', () => {
    it('on initialization it checks refs', async () => {
      // given
      initRefs({ provider, store });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/index.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);
    });

    it('passes version when set on the ref', async () => {
      // given
      global.REFS = {
        fake: {
          id: 'fake',
          url: 'https://example.com',
          title: 'Fake',
          version: '2.1.3-rc.2',
        },
      };
      initRefs({ provider, store });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/index.json?version=2.1.3-rc.2",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json?version=2.1.3-rc.2",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);
    });

    it('checks refs (all fail)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      setupResponses({
        indexPrivate: {
          ok: false,
          response: async () => {
            throw new Error('Failed to fetch');
          },
        },
        storiesPrivate: {
          ok: false,
          response: async () => {
            throw new Error('Failed to fetch');
          },
        },
      });

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/index.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "error": Object {
                "message": "Error: Loading of ref failed
          at fetch (lib/api/src/modules/refs.ts)

        URL: https://example.com

        We weren't able to load the above URL,
        it's possible a CORS error happened.

        Please check your dev-tools network tab.",
              },
              "id": "fake",
              "ready": false,
              "stories": undefined,
              "title": "Fake",
              "type": "auto-inject",
              "url": "https://example.com",
            },
          },
        }
      `);
    });

    it('checks refs (success)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      setupResponses({
        indexPrivate: {
          ok: true,
          response: async () => ({ v: 4, entries: {} }),
        },
        storiesPrivate: {
          ok: true,
          response: async () => ({ v: 3, stories: {} }),
        },
        metadata: {
          ok: true,
          response: async () => ({
            versions: {},
          }),
        },
      });

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/index.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/metadata.json",
            Object {
              "cache": "no-cache",
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "id": "fake",
              "ready": false,
              "stories": Object {},
              "title": "Fake",
              "type": "lazy",
              "url": "https://example.com",
              "versions": Object {},
            },
          },
        }
      `);
    });

    it('checks refs (not replace versions)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      setupResponses({
        indexPrivate: {
          ok: true,
          response: async () => ({ v: 4, entries: {} }),
        },
        storiesPrivate: {
          ok: true,
          response: async () => ({ v: 3, stories: {} }),
        },
        metadata: {
          ok: true,
          response: async () => ({
            versions: {},
          }),
        },
      });

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
        versions: { a: 'http://example.com/a', b: 'http://example.com/b' },
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/index.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/metadata.json",
            Object {
              "cache": "no-cache",
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "id": "fake",
              "ready": false,
              "stories": Object {},
              "title": "Fake",
              "type": "lazy",
              "url": "https://example.com",
              "versions": Object {
                "a": "http://example.com/a",
                "b": "http://example.com/b",
              },
            },
          },
        }
      `);
    });

    it('checks refs (auth)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      setupResponses({
        indexPrivate: {
          ok: true,
          response: async () => ({ loginUrl: 'https://example.com/login' }),
        },
        storiesPrivate: {
          ok: true,
          response: async () => ({ loginUrl: 'https://example.com/login' }),
        },
        metadata: {
          ok: true,
          response: async () => ({ loginUrl: 'https://example.com/login' }),
        },
      });

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/index.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/metadata.json",
            Object {
              "cache": "no-cache",
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "id": "fake",
              "loginUrl": "https://example.com/login",
              "ready": false,
              "stories": undefined,
              "title": "Fake",
              "type": "auto-inject",
              "url": "https://example.com",
            },
          },
        }
      `);
    });

    it('checks refs (mixed)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      fetch.mockClear();
      store.setState.mockClear();

      setupResponses({
        indexPrivate: {
          ok: true,
          response: async () => ({ loginUrl: 'https://example.com/login' }),
        },
        storiesPrivate: {
          ok: true,
          response: async () => ({ loginUrl: 'https://example.com/login' }),
        },
        metadata: {
          ok: true,
          response: async () => ({
            versions: { '1.0.0': 'https://example.com/v1', '2.0.0': 'https://example.com' },
          }),
        },
      });

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/index.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/metadata.json",
            Object {
              "cache": "no-cache",
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "id": "fake",
              "loginUrl": "https://example.com/login",
              "ready": false,
              "stories": undefined,
              "title": "Fake",
              "type": "auto-inject",
              "url": "https://example.com",
              "versions": Object {
                "1.0.0": "https://example.com/v1",
                "2.0.0": "https://example.com",
              },
            },
          },
        }
      `);
    });

    it('checks refs (serverside-success)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      setupResponses({
        indexPublic: {
          ok: true,
          response: async () => ({ v: 4, entries: {} }),
        },
        storiesPublic: {
          ok: true,
          response: async () => ({ v: 3, stories: {} }),
        },
        metadata: {
          ok: true,
          response: async () => ({
            versions: {},
          }),
        },
      });

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
        type: 'server-checked',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/index.json",
            Object {
              "credentials": "omit",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "omit",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/metadata.json",
            Object {
              "cache": "no-cache",
              "credentials": "omit",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "id": "fake",
              "ready": false,
              "stories": Object {},
              "title": "Fake",
              "type": "lazy",
              "url": "https://example.com",
              "versions": Object {},
            },
          },
        }
      `);
    });

    it('checks refs (serverside-fail)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      setupResponses({
        indexPrivate: {
          ok: true,
          response: async () => ({ v: 4, entries: {} }),
        },
        storiesPrivate: {
          ok: true,
          response: async () => ({ v: 3, stories: {} }),
        },
        metadata: {
          ok: true,
          response: async () => ({
            versions: {},
          }),
        },
      });

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
        type: 'unknown',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/index.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/metadata.json",
            Object {
              "cache": "no-cache",
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "id": "fake",
              "ready": false,
              "stories": Object {},
              "title": "Fake",
              "type": "lazy",
              "url": "https://example.com",
              "versions": Object {},
            },
          },
        }
      `);
    });

    describe('v3 compatibility', () => {
      it('infers docs only if there is only one story and it has the name "Page"', async () => {
        // given
        const { api } = initRefs({ provider, store }, { runCheck: false });

        const index = {
          v: 3,
          stories: {
            'component-a--page': {
              id: 'component-a--page',
              title: 'Component A',
              name: 'Page', // Called "Page" but not only story
              importPath: './path/to/component-a.ts',
            },
            'component-a--story-2': {
              id: 'component-a--story-2',
              title: 'Component A',
              name: 'Story 2',
              importPath: './path/to/component-a.ts',
            },
            'component-b--page': {
              id: 'component-b--page',
              title: 'Component B',
              name: 'Page', // Page and only story
              importPath: './path/to/component-b.ts',
            },
            'component-c--story-4': {
              id: 'component-c--story-4',
              title: 'Component c',
              name: 'Story 4', // Only story but not page
              importPath: './path/to/component-c.ts',
            },
          },
        };

        setupResponses({
          indexPrivate: { ok: false },
          storiesPrivate: {
            ok: true,
            response: async () => index,
          },
          metadata: {
            ok: true,
            response: async () => ({
              versions: {},
            }),
          },
        });

        await api.checkRef({
          id: 'fake',
          url: 'https://example.com',
          title: 'Fake',
        });

        const { refs } = store.setState.mock.calls[0][0];
        const hash = refs.fake.stories;

        // We need exact key ordering, even if in theory JS doesn't guarantee it
        expect(Object.keys(hash)).toEqual([
          'component-a',
          'component-a--page',
          'component-a--story-2',
          'component-b',
          'component-b--page',
          'component-c',
          'component-c--story-4',
        ]);
        expect(hash['component-a--page'].type).toBe('story');
        expect(hash['component-a--story-2'].type).toBe('story');
        expect(hash['component-b--page'].type).toBe('docs');
        expect(hash['component-c--story-4'].type).toBe('story');
      });

      it('prefers parameters.docsOnly to inferred docsOnly status', async () => {
        const { api } = initRefs({ provider, store }, { runCheck: false });

        const index = {
          v: 3,
          stories: {
            'component-a--docs': {
              id: 'component-a--docs',
              title: 'Component A',
              name: 'Docs', // Called 'Docs' rather than 'Page'
              importPath: './path/to/component-a.ts',
              parameters: {
                docsOnly: true,
              },
            },
          },
        };
        setupResponses({
          indexPrivate: { ok: false },
          storiesPrivate: {
            ok: true,
            response: async () => index,
          },
          metadata: {
            ok: true,
            response: async () => ({
              versions: {},
            }),
          },
        });

        await api.checkRef({
          id: 'fake',
          url: 'https://example.com',
          title: 'Fake',
        });

        const { refs } = store.setState.mock.calls[0][0];
        const hash = refs.fake.stories;

        // We need exact key ordering, even if in theory JS doesn't guarantee it
        expect(Object.keys(hash)).toEqual(['component-a', 'component-a--docs']);
        expect(hash['component-a--docs'].type).toBe('docs');
      });
    });
  });

  it('errors on unknown version', async () => {
    // given
    const { api } = initRefs({ provider, store }, { runCheck: false });

    setupResponses({
      indexPrivate: {
        ok: false,
      },
      storiesPrivate: {
        ok: true,
        response: async () => ({ stories: {} }),
      },
      metadata: {
        ok: true,
        response: async () => ({
          versions: {},
        }),
      },
    });

    await expect(
      api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      })
    ).rejects.toThrow('Composition: Missing stories.json version');
  });
});
