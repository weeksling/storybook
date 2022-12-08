import { types, type Addon } from '@storybook/manager-api';
import type { API, State } from '@storybook/manager-api';
import type { PreviewProps } from './utils/types';

export const previewProps: PreviewProps = {
  id: 'string',
  storyId: 'story--id',
  api: {
    on: () => {},
    emit: () => {},
    off: () => {},
    getElements: ((type) =>
      type === types.TAB
        ? [
            {
              id: 'notes',
              type: types.TAB,
              title: 'Notes',
              route: ({ storyId }) => `/info/${storyId}`,
              match: ({ viewMode }) => viewMode === 'info',
              render: () => null,
            } as Addon,
          ]
        : []) as API['getElements'],
  } as any as API,
  entry: {
    tags: [],
    type: 'story',
    id: 'story--id',
    parent: 'root',
    depth: 1,
    title: 'kind',
    name: 'story name',
    importPath: './story.stories.tsx',
    prepared: true,
    parameters: {
      fileName: '',
      options: {},
    },
    args: {},
    kind: 'kind',
    isRoot: false,
    isComponent: false,
    isLeaf: true,
  },
  path: 'string',
  viewMode: 'story',
  location: {} as any as State['location'],
  baseUrl: 'http://example.com',
  queryParams: {},
  options: {
    isFullscreen: false,
    showTabs: true,
    showToolbar: true,
  },
  withLoader: false,
  description: '',
  refs: {},
};
