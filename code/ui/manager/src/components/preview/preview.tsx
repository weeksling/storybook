import React, { Fragment, useMemo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import global from 'global';

import {
  type API,
  Consumer,
  type Combo,
  merge,
  addons,
  types,
  type Addon,
} from '@storybook/manager-api';
import { PREVIEW_BUILDER_PROGRESS, SET_CURRENT_STORY } from '@storybook/core-events';

import { Loader } from '@storybook/components';
import { Location } from '@storybook/router';

import * as S from './utils/components';
import { ZoomProvider, ZoomConsumer } from './tools/zoom';
import { defaultWrappers, ApplyWrappers } from './wrappers';
import { ToolbarComp } from './toolbar';
import { FramesRenderer } from './FramesRenderer';

import type { PreviewProps } from './utils/types';

const getWrappers = (getFn: API['getElements']) => Object.values(getFn<Addon>(types.PREVIEW));
const getTabs = (getFn: API['getElements']) => Object.values(getFn<Addon>(types.TAB));

const canvasMapper = ({ state, api }: Combo) => ({
  storyId: state.storyId,
  refId: state.refId,
  viewMode: state.viewMode,
  customCanvas: api.renderPreview,
  queryParams: state.customQueryParams,
  getElements: api.getElements,
  entry: api.getData(state.storyId, state.refId),
  storiesConfigured: state.storiesConfigured,
  storiesFailed: state.storiesFailed,
  refs: state.refs,
  active: !!(state.viewMode && state.viewMode.match(/^(story|docs)$/)),
});

const createCanvas = (id: string, baseUrl = 'iframe.html', withLoader = true): Addon => ({
  id: 'canvas',
  title: 'Canvas',
  route: ({ storyId, refId }) => (refId ? `/story/${refId}_${storyId}` : `/story/${storyId}`),
  match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
  render: () => {
    return (
      <Consumer filter={canvasMapper}>
        {({
          entry,
          refs,
          customCanvas,
          storyId,
          refId,
          viewMode,
          queryParams,
          getElements,
          storiesConfigured,
          storiesFailed,
          active,
        }) => {
          const wrappers = useMemo(
            () => [...defaultWrappers, ...getWrappers(getElements)],
            [getElements, ...defaultWrappers]
          );

          const [progress, setProgress] = useState(undefined);

          useEffect(() => {
            if (global.CONFIG_TYPE === 'DEVELOPMENT') {
              const channel = addons.getServerChannel();

              channel.on(PREVIEW_BUILDER_PROGRESS, (options) => {
                setProgress(options);
              });
            }
          }, []);

          const refLoading = !!refs[refId] && !refs[refId].ready;
          const rootLoading = !refId && !(progress?.value === 1 || progress === undefined);
          const isLoading = entry
            ? refLoading || rootLoading
            : (!storiesFailed && !storiesConfigured) || rootLoading;

          return (
            <ZoomConsumer>
              {({ value: scale }) => {
                return (
                  <>
                    {withLoader && isLoading && (
                      <S.LoaderWrapper>
                        <Loader id="preview-loader" role="progressbar" progress={progress} />
                      </S.LoaderWrapper>
                    )}
                    <ApplyWrappers
                      id={id}
                      storyId={storyId}
                      viewMode={viewMode}
                      active={active}
                      wrappers={wrappers}
                    >
                      {customCanvas ? (
                        customCanvas(storyId, viewMode, id, baseUrl, scale, queryParams)
                      ) : (
                        <FramesRenderer
                          baseUrl={baseUrl}
                          refs={refs}
                          scale={scale}
                          entry={entry}
                          viewMode={viewMode}
                          refId={refId}
                          queryParams={queryParams}
                          storyId={storyId}
                        />
                      )}
                    </ApplyWrappers>
                  </>
                );
              }}
            </ZoomConsumer>
          );
        }}
      </Consumer>
    );
  },
});

const useTabs = (
  id: PreviewProps['id'],
  baseUrl: PreviewProps['baseUrl'],
  withLoader: PreviewProps['withLoader'],
  getElements: API['getElements'],
  entry: PreviewProps['entry']
) => {
  const canvas = useMemo(() => {
    return createCanvas(id, baseUrl, withLoader);
  }, [id, baseUrl, withLoader]);

  const tabsFromConfig = useMemo(() => {
    return getTabs(getElements);
  }, [getElements]);

  return useMemo(() => {
    if (entry?.type === 'story' && entry.parameters) {
      return filterTabs([canvas, ...tabsFromConfig], entry.parameters);
    }

    return [canvas, ...tabsFromConfig];
  }, [entry, canvas, ...tabsFromConfig]);
};

const Preview = React.memo<PreviewProps>(function Preview(props) {
  const {
    api,
    id: previewId,
    options,
    viewMode,
    storyId,
    entry = undefined,
    description,
    baseUrl,
    withLoader = true,
  } = props;
  const { getElements } = api;

  const tabs = useTabs(previewId, baseUrl, withLoader, getElements, entry);

  const shouldScale = viewMode === 'story';
  const { showToolbar, showTabs = true } = options;
  const visibleTabsInToolbar = showTabs ? tabs : [];

  const previousStoryId = useRef(storyId);

  useEffect(() => {
    if (entry && viewMode) {
      // Don't emit the event on first ("real") render, only when entry changes
      if (storyId !== previousStoryId.current) {
        previousStoryId.current = storyId;

        if (viewMode.match(/docs|story/)) {
          const { refId, id } = entry;
          api.emit(SET_CURRENT_STORY, {
            storyId: id,
            viewMode,
            options: { target: refId },
          });
        }
      }
    }
  }, [entry, viewMode]);

  return (
    <Fragment>
      {previewId === 'main' && (
        <Helmet key="description">
          <title>{description}</title>
        </Helmet>
      )}
      <ZoomProvider shouldScale={shouldScale}>
        <ToolbarComp
          key="tools"
          entry={entry}
          api={api}
          isShown={showToolbar}
          tabs={visibleTabsInToolbar}
        />
        <S.FrameWrap key="frame" offset={showToolbar ? 40 : 0}>
          {tabs.map(({ render: Render, match, ...t }, i) => {
            // @ts-expect-error (Converted from ts-ignore)
            const key = t.id || t.key || i;
            return (
              <Fragment key={key}>
                <Location>{(lp) => <Render active={match(lp)} />}</Location>
              </Fragment>
            );
          })}
        </S.FrameWrap>
      </ZoomProvider>
    </Fragment>
  );
});

export { Preview };

function filterTabs(panels: Addon[], parameters: Record<string, any>) {
  const { previewTabs } = addons.getConfig();
  const parametersTabs = parameters ? parameters.previewTabs : undefined;

  if (previewTabs || parametersTabs) {
    // deep merge global and local settings
    const tabs = merge(previewTabs, parametersTabs);
    const arrTabs = Object.keys(tabs).map((key, index) => ({
      index,
      ...(typeof tabs[key] === 'string' ? { title: tabs[key] } : tabs[key]),
      id: key,
    }));
    return panels
      .filter((panel) => {
        const t = arrTabs.find((tab) => tab.id === panel.id);
        return t === undefined || t.id === 'canvas' || !t.hidden;
      })
      .map((panel, index) => ({ ...panel, index } as Addon))
      .sort((p1, p2) => {
        /* eslint-disable @typescript-eslint/naming-convention */
        const tab_1 = arrTabs.find((tab) => tab.id === p1.id);
        // @ts-expect-error (Converted from ts-ignore)
        const index_1 = tab_1 ? tab_1.index : arrTabs.length + p1.index;
        const tab_2 = arrTabs.find((tab) => tab.id === p2.id);
        // @ts-expect-error (Converted from ts-ignore)
        const index_2 = tab_2 ? tab_2.index : arrTabs.length + p2.index;
        return index_1 - index_2;
        /* eslint-enable @typescript-eslint/naming-convention */
      })
      .map((panel) => {
        const t = arrTabs.find((tab) => tab.id === panel.id);
        if (t) {
          return {
            ...panel,
            title: t.title || panel.title,
            disabled: t.disabled,
            hidden: t.hidden,
          } as Addon;
        }
        return panel;
      });
  }
  return panels;
}
