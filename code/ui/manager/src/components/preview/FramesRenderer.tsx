import type { FC } from 'react';
import React, { Fragment, useMemo, useEffect, useState } from 'react';
import type { Combo } from '@storybook/manager-api';
import { Consumer } from '@storybook/manager-api';
import { Button, getStoryHref } from '@storybook/components';
import { Global, styled } from '@storybook/theming';
import type { CSSObject } from '@storybook/theming';
import { IFrame } from './iframe';
import type { FramesRendererProps } from './utils/types';
import { stringifyQueryParams } from './utils/stringifyQueryParams';

const getActive = (refId: FramesRendererProps['refId']) => {
  if (refId) {
    return `storybook-ref-${refId}`;
  }

  return 'storybook-preview-iframe';
};

const SkipToSidebarLink = styled(Button)(({ theme }) => ({
  display: 'none',
  '@media (min-width: 600px)': {
    position: 'absolute',
    display: 'block',
    top: 10,
    right: 15,
    padding: '10px 15px',
    fontSize: theme.typography.size.s1,
    transform: 'translateY(-100px)',
    '&:focus': {
      transform: 'translateY(0)',
      zIndex: 1,
    },
  },
}));

const whenSidebarIsVisible = ({ state }: Combo) => ({
  isFullscreen: state.layout.isFullscreen,
  showNav: state.layout.showNav,
  selectedStoryId: state.storyId,
});

export const FramesRenderer: FC<FramesRendererProps> = ({
  refs,
  entry,
  scale,
  viewMode = 'story',
  refId,
  queryParams = {},
  baseUrl,
  storyId = '*',
}) => {
  const version = refs[refId]?.version;
  const stringifiedQueryParams = stringifyQueryParams({
    ...queryParams,
    ...(version && { version }),
  });
  const active = getActive(refId);

  const styles = useMemo<CSSObject>(() => {
    // add #root to make the selector high enough in specificity
    return {
      '#root [data-is-storybook="false"]': {
        display: 'none',
      },
      '#root [data-is-storybook="true"]': {
        display: 'block',
      },
    };
  }, []);

  const [frames, setFrames] = useState<Record<string, string>>({
    'storybook-preview-iframe': getStoryHref(baseUrl, storyId, {
      ...queryParams,
      ...(version && { version }),
      viewMode,
    }),
  });

  useEffect(() => {
    const newFrames = Object.values(refs)
      .filter((r) => {
        if (r.error) {
          return false;
        }
        if (r.type === 'auto-inject') {
          return true;
        }
        if (entry && r.id === entry.refId) {
          return true;
        }

        return false;
      })
      .reduce((acc, r) => {
        return {
          ...acc,
          [`storybook-ref-${r.id}`]: `${r.url}/iframe.html?id=${storyId}&viewMode=${viewMode}&refId=${r.id}${stringifiedQueryParams}`,
        };
      }, frames);

    setFrames(newFrames);
  }, [storyId, entry, refs]);

  return (
    <Fragment>
      <Global styles={styles} />
      <Consumer filter={whenSidebarIsVisible}>
        {({ isFullscreen, showNav, selectedStoryId }) => {
          if (!isFullscreen && !!showNav && selectedStoryId) {
            return (
              <SkipToSidebarLink secondary isLink tabIndex={0} href={`#${selectedStoryId}`}>
                Skip to sidebar
              </SkipToSidebarLink>
            );
          }
          return null;
        }}
      </Consumer>
      {Object.entries(frames).map(([id, src]) => (
        <Fragment key={id}>
          <IFrame
            active={id === active}
            key={refs[id] ? refs[id].url : id}
            id={id}
            title={id}
            src={src}
            allowFullScreen
            scale={scale}
          />
        </Fragment>
      ))}
    </Fragment>
  );
};
