import type { ComponentProps, FC } from 'react';
import React, { useContext } from 'react';
import type { StoryId, PreparedStory } from '@storybook/types';
import { SourceType } from '@storybook/docs-tools';

import { Source as PureSource, SourceError } from '../components';
import type { DocsContextProps } from './DocsContext';
import { DocsContext } from './DocsContext';
import type { SourceContextProps, SourceItem } from './SourceContainer';
import { SourceContext } from './SourceContainer';

import { enhanceSource } from './enhanceSource';
import { useStories } from './useStory';

export enum SourceState {
  OPEN = 'open',
  CLOSED = 'closed',
  NONE = 'none',
}

interface CommonProps {
  language?: string;
  dark?: boolean;
  format?: PureSourceProps['format'];
  code?: string;
}

type SingleSourceProps = {
  id: string;
} & CommonProps;

type MultiSourceProps = {
  ids: string[];
} & CommonProps;

type CodeProps = {
  code: string;
} & CommonProps;

type NoneProps = CommonProps;

type SourceProps = SingleSourceProps | MultiSourceProps | CodeProps | NoneProps;

const getSourceState = (stories: PreparedStory[]) => {
  const states = stories.map((story) => story.parameters.docs?.source?.state).filter(Boolean);
  if (states.length === 0) return SourceState.CLOSED;
  // FIXME: handling multiple stories is a pain
  return states[0];
};

const getStorySource = (storyId: StoryId, sourceContext: SourceContextProps): SourceItem => {
  const { sources } = sourceContext;
  // source rendering is async so source is unavailable at the start of the render cycle,
  // so we fail gracefully here without warning
  return sources?.[storyId] || { code: '', format: false };
};

const getSnippet = (snippet: string, story?: PreparedStory<any>): string => {
  if (!story) {
    return snippet;
  }

  const { parameters } = story;
  // eslint-disable-next-line no-underscore-dangle
  const isArgsStory = parameters.__isArgsStory;
  const type = parameters.docs?.source?.type || SourceType.AUTO;

  // if user has hard-coded the snippet, that takes precedence
  const userCode = parameters.docs?.source?.code;
  if (userCode !== undefined) {
    return userCode;
  }

  // if user has explicitly set this as dynamic, use snippet
  if (type === SourceType.DYNAMIC) {
    return parameters.docs?.transformSource?.(snippet, story) || snippet;
  }

  // if this is an args story and there's a snippet
  if (type === SourceType.AUTO && snippet && isArgsStory) {
    return parameters.docs?.transformSource?.(snippet, story) || snippet;
  }

  // otherwise, use the source code logic
  const enhanced = enhanceSource(story) || parameters;
  return enhanced?.docs?.source?.code || '';
};

type SourceStateProps = { state: SourceState };
type PureSourceProps = ComponentProps<typeof PureSource>;

export const useSourceProps = (
  props: SourceProps,
  docsContext: DocsContextProps<any>,
  sourceContext: SourceContextProps
): PureSourceProps & SourceStateProps => {
  const { id: primaryId, parameters } = docsContext.storyById();

  const codeProps = props as CodeProps;
  const singleProps = props as SingleSourceProps;
  const multiProps = props as MultiSourceProps;

  let { format, code: source } = codeProps; // prefer user-specified code

  const targetIds = multiProps.ids || [singleProps.id || primaryId];
  const storyIds = targetIds.map((targetId) => {
    return targetId;
  });

  const stories = useStories(storyIds, docsContext);
  if (!stories.every(Boolean)) {
    return { error: SourceError.SOURCE_UNAVAILABLE, state: SourceState.NONE };
  }

  if (!source) {
    // just take the format from the first story, given how they're all concatinated together...
    // TODO: we should consider sending an event with all the sources separately, instead of concatenating them here
    ({ format } = getStorySource(storyIds[0], sourceContext));
    source = storyIds
      .map((storyId, idx) => {
        const { code: storySource } = getStorySource(storyId, sourceContext);
        const storyObj = stories[idx] as PreparedStory;
        return getSnippet(storySource, storyObj);
      })
      .join('\n\n');
  }

  const state = getSourceState(stories as PreparedStory[]);

  const { docs: docsParameters = {} } = parameters;
  const { source: sourceParameters = {} } = docsParameters;
  const { language: docsLanguage = null } = sourceParameters;

  return source
    ? {
        code: source,
        state,
        format,
        language: props.language || docsLanguage || 'jsx',
        dark: props.dark || false,
      }
    : { error: SourceError.SOURCE_UNAVAILABLE, state };
};

/**
 * Story source doc block renders source code if provided,
 * or the source for a story if `storyId` is provided, or
 * the source for the current story if nothing is provided.
 */
export const Source: FC<PureSourceProps> = (props) => {
  const sourceContext = useContext(SourceContext);
  const docsContext = useContext(DocsContext);
  const sourceProps = useSourceProps(props, docsContext, sourceContext);
  return <PureSource {...sourceProps} />;
};
