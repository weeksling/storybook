import React from 'react';

import { Explorer } from './Explorer';
import { mockDataset } from './mockdata';
import type { RefType } from './types';
import * as RefStories from './Refs.stories';

export default {
  component: Explorer,
  title: 'Sidebar/Explorer',
  parameters: { layout: 'fullscreen', withSymbols: true },
  decorators: [
    RefStories.default.decorators[0],
    (storyFn: any) => <div style={{ padding: '0 20px', maxWidth: '230px' }}>{storyFn()}</div>,
  ],
};

const selected = {
  refId: 'storybook_internal',
  storyId: 'root-1-child-a2--grandchild-a1-1',
};

const simple: Record<string, RefType> = {
  storybook_internal: {
    title: undefined,
    id: 'storybook_internal',
    url: 'iframe.html',
    ready: true,
    // @ts-expect-error (invalid input)
    stories: mockDataset.withRoot,
  },
};

const withRefs: Record<string, RefType> = {
  ...simple,
  basic: {
    id: 'basic',
    title: 'Basic ref',
    url: 'https://example.com',
    ready: true,
    type: 'auto-inject',
    // @ts-expect-error (invalid input)
    stories: mockDataset.noRoot,
  },
  injected: {
    id: 'injected',
    title: 'Not ready',
    url: 'https://example.com',
    ready: false,
    type: 'auto-inject',
    // @ts-expect-error (invalid input)
    stories: mockDataset.noRoot,
  },
  unknown: {
    id: 'unknown',
    title: 'Unknown ref',
    url: 'https://example.com',
    ready: true,
    type: 'unknown',
    // @ts-expect-error (invalid input)
    stories: mockDataset.noRoot,
  },
  lazy: {
    id: 'lazy',
    title: 'Lazy loaded ref',
    url: 'https://example.com',
    ready: false,
    type: 'lazy',
    // @ts-expect-error (invalid input)
    stories: mockDataset.withRoot,
  },
};

export const Simple = () => (
  <Explorer
    dataset={{ hash: simple, entries: Object.entries(simple) }}
    selected={selected}
    isLoading={false}
    isBrowsing
  />
);

export const WithRefs = () => (
  <Explorer
    dataset={{ hash: withRefs, entries: Object.entries(withRefs) }}
    selected={selected}
    isLoading={false}
    isBrowsing
  />
);
