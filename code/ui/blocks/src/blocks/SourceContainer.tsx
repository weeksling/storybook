import type { FC, Context } from 'react';
import React, { createContext, useEffect, useState } from 'react';

import { dequal as deepEqual } from 'dequal';
import type { Channel } from '@storybook/channels';

import { SNIPPET_RENDERED } from '@storybook/docs-tools';
import type { SyntaxHighlighterFormatTypes } from '@storybook/components';
import type { StoryId } from '@storybook/types';

export interface SourceItem {
  code: string;
  format: SyntaxHighlighterFormatTypes;
}
export type StorySources = Record<StoryId, SourceItem>;

export interface SourceContextProps {
  sources: StorySources;
  setSource?: (id: StoryId, item: SourceItem) => void;
}

export const SourceContext: Context<SourceContextProps> = createContext({ sources: {} });

export const SourceContainer: FC<{ channel: Channel }> = ({ children, channel }) => {
  const [sources, setSources] = useState<StorySources>({});

  useEffect(() => {
    const handleSnippetRendered = (
      id: StoryId,
      newSource: string,
      format: SyntaxHighlighterFormatTypes = false
    ) => {
      // optimization: if the source is the same, ignore the incoming event
      if (sources[id] && sources[id].code === newSource) {
        return;
      }

      setSources((current) => {
        const newSources = {
          ...current,
          [id]: { code: newSource, format },
        };

        if (!deepEqual(current, newSources)) {
          return newSources;
        }
        return current;
      });
    };

    channel.on(SNIPPET_RENDERED, handleSnippetRendered);

    return () => channel.off(SNIPPET_RENDERED, handleSnippetRendered);
  }, []);

  return <SourceContext.Provider value={{ sources }}>{children}</SourceContext.Provider>;
};
