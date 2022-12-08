/* eslint-disable no-underscore-dangle */
/* global window */
import { render } from 'lit-html';
import type { ArgsStoryFn, PartialStoryFn, StoryContext } from '@storybook/types';
import { addons, useEffect } from '@storybook/preview-api';
import { SNIPPET_RENDERED, SourceType } from '@storybook/docs-tools';

import type { WebComponentsRenderer } from '../types';

// Taken from https://github.com/lit/lit/blob/main/packages/lit-html/src/test/test-utils/strip-markers.ts
const LIT_EXPRESSION_COMMENTS = /<!--\?lit\$[0-9]+\$-->|<!--\??-->/g;

function skipSourceRender(context: StoryContext<WebComponentsRenderer>) {
  const sourceParams = context?.parameters.docs?.source;
  const isArgsStory = context?.parameters.__isArgsStory;

  // always render if the user forces it
  if (sourceParams?.type === SourceType.DYNAMIC) {
    return false;
  }

  // never render if the user is forcing the block to render code, or
  // if the user provides code, or if it's not an args story.
  return !isArgsStory || sourceParams?.code || sourceParams?.type === SourceType.CODE;
}

function applyTransformSource(
  source: string,
  context: StoryContext<WebComponentsRenderer>
): string {
  const { transformSource } = context.parameters.docs ?? {};
  if (typeof transformSource !== 'function') return source;
  return transformSource(source, context);
}

export function sourceDecorator(
  storyFn: PartialStoryFn<WebComponentsRenderer>,
  context: StoryContext<WebComponentsRenderer>
): WebComponentsRenderer['storyResult'] {
  const story = context?.parameters.docs?.source?.excludeDecorators
    ? (context.originalStoryFn as ArgsStoryFn<WebComponentsRenderer>)(context.args, context)
    : storyFn();

  let source: string;

  useEffect(() => {
    if (source) addons.getChannel().emit(SNIPPET_RENDERED, context.id, source);
  });
  if (!skipSourceRender(context)) {
    const container = window.document.createElement('div');
    render(story, container);
    source = applyTransformSource(
      container.innerHTML.replace(LIT_EXPRESSION_COMMENTS, ''),
      context
    );
  }

  return story;
}
