import global from 'global';
import * as React from 'react';
import { useChannel, useParameter } from '@storybook/manager-api';
import {
  FORCE_REMOUNT,
  IGNORED_EXCEPTION,
  STORY_RENDER_PHASE_CHANGED,
  STORY_THREW_EXCEPTION,
  PLAY_FUNCTION_THREW_EXCEPTION,
} from '@storybook/core-events';
import {
  EVENTS,
  type Call,
  CallStates,
  type ControlStates,
  type LogItem,
} from '@storybook/instrumenter';

import type { StoryId } from '@storybook/types';
import { InteractionsPanel } from './components/InteractionsPanel';
import { TabIcon, TabStatus } from './components/TabStatus';

interface Interaction extends Call {
  status: Call['status'];
  childCallIds: Call['id'][];
  isHidden: boolean;
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

const INITIAL_CONTROL_STATES = {
  debugger: false,
  start: false,
  back: false,
  goto: false,
  next: false,
  end: false,
};

export const getInteractions = ({
  log,
  calls,
  collapsed,
  setCollapsed,
}: {
  log: LogItem[];
  calls: Map<Call['id'], Call>;
  collapsed: Set<Call['id']>;
  setCollapsed: React.Dispatch<React.SetStateAction<Set<string>>>;
}) => {
  const callsById = new Map<Call['id'], Call>();
  const childCallMap = new Map<Call['id'], Call['id'][]>();
  return log
    .map<Call & { isHidden: boolean }>(({ callId, ancestors, status }) => {
      let isHidden = false;
      ancestors.forEach((ancestor) => {
        if (collapsed.has(ancestor)) isHidden = true;
        childCallMap.set(ancestor, (childCallMap.get(ancestor) || []).concat(callId));
      });
      return { ...calls.get(callId), status, isHidden };
    })
    .map<Interaction>((call) => {
      const status =
        call.status === CallStates.ERROR &&
        callsById.get(call.ancestors.slice(-1)[0])?.status === CallStates.ACTIVE
          ? CallStates.ACTIVE
          : call.status;
      callsById.set(call.id, { ...call, status });
      return {
        ...call,
        status,
        childCallIds: childCallMap.get(call.id),
        isCollapsed: collapsed.has(call.id),
        toggleCollapsed: () =>
          setCollapsed((ids) => {
            if (ids.has(call.id)) ids.delete(call.id);
            else ids.add(call.id);
            return new Set(ids);
          }),
      };
    });
};

export const Panel: React.FC<{ active: boolean }> = (props) => {
  const [storyId, setStoryId] = React.useState<StoryId>();
  const [controlStates, setControlStates] = React.useState<ControlStates>(INITIAL_CONTROL_STATES);
  const [pausedAt, setPausedAt] = React.useState<Call['id']>();
  const [isErrored, setErrored] = React.useState(false);
  const [isPlaying, setPlaying] = React.useState(false);
  const [isRerunAnimating, setIsRerunAnimating] = React.useState(false);
  const [scrollTarget, setScrollTarget] = React.useState<HTMLElement>();
  const [collapsed, setCollapsed] = React.useState<Set<Call['id']>>(new Set());
  const [caughtException, setCaughtException] = React.useState<Error>();
  const [interactions, setInteractions] = React.useState<Interaction[]>([]);
  const [interactionsCount, setInteractionsCount] = React.useState<number>();

  // Log and calls are tracked in a ref so we don't needlessly rerender.
  const log = React.useRef<LogItem[]>([]);
  const calls = React.useRef<Map<Call['id'], Omit<Call, 'status'>>>(new Map());
  const setCall = ({ status, ...call }: Call) => calls.current.set(call.id, call);

  const endRef = React.useRef();
  React.useEffect(() => {
    let observer: IntersectionObserver;
    if (global.window.IntersectionObserver) {
      observer = new global.window.IntersectionObserver(
        ([end]: any) => setScrollTarget(end.isIntersecting ? undefined : end.target),
        { root: global.window.document.querySelector('#panel-tab-content') }
      );
      if (endRef.current) observer.observe(endRef.current);
    }
    return () => observer?.disconnect();
  }, []);

  const emit = useChannel(
    {
      [EVENTS.CALL]: setCall,
      [EVENTS.SYNC]: (payload) => {
        setControlStates(payload.controlStates);
        setPausedAt(payload.pausedAt);
        setInteractions(
          getInteractions({ log: payload.logItems, calls: calls.current, collapsed, setCollapsed })
        );
        log.current = payload.logItems;
      },
      [STORY_RENDER_PHASE_CHANGED]: (event) => {
        setStoryId(event.storyId);
        setPlaying(event.newPhase === 'playing');
        setPausedAt(undefined);
        if (event.newPhase === 'rendering') {
          setErrored(false);
          setCaughtException(undefined);
        }
      },
      [STORY_THREW_EXCEPTION]: () => {
        setErrored(true);
      },
      [PLAY_FUNCTION_THREW_EXCEPTION]: (e) => {
        if (e?.message !== IGNORED_EXCEPTION.message) setCaughtException(e);
        else setCaughtException(undefined);
      },
    },
    [collapsed]
  );

  React.useEffect(() => {
    setInteractions(
      getInteractions({ log: log.current, calls: calls.current, collapsed, setCollapsed })
    );
  }, [collapsed]);

  React.useEffect(() => {
    if (isPlaying || isRerunAnimating) return;
    setInteractionsCount(interactions.filter(({ method }) => method !== 'step').length);
  }, [interactions, isPlaying, isRerunAnimating]);

  const controls = React.useMemo(
    () => ({
      start: () => emit(EVENTS.START, { storyId }),
      back: () => emit(EVENTS.BACK, { storyId }),
      goto: (callId: string) => emit(EVENTS.GOTO, { storyId, callId }),
      next: () => emit(EVENTS.NEXT, { storyId }),
      end: () => emit(EVENTS.END, { storyId }),
      rerun: () => {
        setIsRerunAnimating(true);
        emit(FORCE_REMOUNT, { storyId });
      },
    }),
    [storyId]
  );

  const storyFilePath = useParameter('fileName', '');
  const [fileName] = storyFilePath.toString().split('/').slice(-1);
  const scrollToTarget = () => scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'end' });

  const showStatus = interactionsCount > 0 || !!caughtException || isRerunAnimating;
  const hasException = !!caughtException || interactions.some((v) => v.status === CallStates.ERROR);

  if (isErrored) {
    return <React.Fragment key="interactions" />;
  }

  return (
    <React.Fragment key="interactions">
      <TabStatus>
        {showStatus &&
          (hasException ? <TabIcon status={CallStates.ERROR} /> : ` (${interactionsCount})`)}
      </TabStatus>
      <InteractionsPanel
        calls={calls.current}
        controls={controls}
        controlStates={controlStates}
        interactions={interactions}
        fileName={fileName}
        hasException={hasException}
        caughtException={caughtException}
        isPlaying={isPlaying}
        pausedAt={pausedAt}
        endRef={endRef}
        onScrollToEnd={scrollTarget && scrollToTarget}
        isRerunAnimating={isRerunAnimating}
        setIsRerunAnimating={setIsRerunAnimating}
        {...props}
      />
    </React.Fragment>
  );
};
