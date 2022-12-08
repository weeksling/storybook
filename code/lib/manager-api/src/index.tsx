/* eslint-disable @typescript-eslint/naming-convention */
import type { FC, ReactElement, ReactNode } from 'react';
import React, {
  Component,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import mergeWith from 'lodash/mergeWith';
import type {
  Args,
  ArgTypes,
  API_ComponentEntry,
  API_ComposedRef,
  API_DocsEntry,
  API_GroupEntry,
  API_HashEntry,
  API_LeafEntry,
  API_OptionsData,
  API_ProviderData,
  API_Refs,
  API_RootEntry,
  API_StateMerger,
  API_StoriesHash,
  API_StoryEntry,
  Parameters,
  StoryId,
} from '@storybook/types';

import {
  STORY_CHANGED,
  SHARED_STATE_CHANGED,
  SHARED_STATE_SET,
  SET_STORIES,
} from '@storybook/core-events';
import type { RouterData } from '@storybook/router';
import type { Listener } from '@storybook/channels';

import { createContext } from './context';
import type { Options } from './store';
import Store from './store';
import getInitialState from './initial-state';

import * as provider from './modules/provider';

import * as addons from './modules/addons';

import * as channel from './modules/channel';

import * as notifications from './modules/notifications';
import * as settings from './modules/settings';
import * as releaseNotes from './modules/release-notes';
// eslint-disable-next-line import/no-cycle
import * as stories from './modules/stories';
// eslint-disable-next-line import/no-cycle
import * as refs from './modules/refs';
import * as layout from './modules/layout';
import * as shortcuts from './modules/shortcuts';

import * as url from './modules/url';
import * as version from './modules/versions';
// eslint-disable-next-line import/no-cycle
import * as globals from './modules/globals';

export * from './lib/shortcut';

const { ActiveTabs } = layout;

export { default as merge } from './lib/merge';
export type { Options as StoreOptions, Listener as ChannelListener };
export { ActiveTabs };

export const ManagerContext = createContext({ api: undefined, state: getInitialState({}) });

export type ModuleArgs = RouterData &
  API_ProviderData<API> & {
    mode?: 'production' | 'development';
    state: State;
    fullAPI: API;
    store: Store;
  };

export type State = layout.SubState &
  stories.SubState &
  refs.SubState &
  notifications.SubState &
  version.SubState &
  url.SubState &
  shortcuts.SubState &
  releaseNotes.SubState &
  settings.SubState &
  globals.SubState &
  RouterData &
  API_OptionsData &
  Other;

export type API = addons.SubAPI &
  channel.SubAPI &
  provider.SubAPI &
  stories.SubAPI &
  refs.SubAPI &
  globals.SubAPI &
  layout.SubAPI &
  notifications.SubAPI &
  shortcuts.SubAPI &
  releaseNotes.SubAPI &
  settings.SubAPI &
  version.SubAPI &
  url.SubAPI &
  Other;

interface Other {
  [key: string]: any;
}

export interface Combo {
  api: API;
  state: State;
}

export type ManagerProviderProps = RouterData &
  API_ProviderData<API> & {
    children: ReactNode | ((props: Combo) => ReactNode);
  };

// This is duplicated from @storybook/preview-api for the reasons mentioned in lib-addons/types.js
export const combineParameters = (...parameterSets: Parameters[]) =>
  mergeWith({}, ...parameterSets, (objValue: any, srcValue: any) => {
    // Treat arrays as scalars:
    if (Array.isArray(srcValue)) return srcValue;

    return undefined;
  });

interface ModuleWithInit<APIType = unknown, StateType = unknown> {
  init: () => void | Promise<void>;
  api: APIType;
  state: StateType;
}

type ModuleWithoutInit<APIType = unknown, StateType = unknown> = Omit<
  ModuleWithInit<APIType, StateType>,
  'init'
>;

export type ModuleFn<APIType = unknown, StateType = unknown, HasInit = false> = (
  m: ModuleArgs
) => HasInit extends true
  ? ModuleWithInit<APIType, StateType>
  : ModuleWithoutInit<APIType, StateType>;

class ManagerProvider extends Component<ManagerProviderProps, State> {
  api: API = {} as API;

  modules: (ModuleWithInit | ModuleWithoutInit)[];

  static displayName = 'Manager';

  constructor(props: ManagerProviderProps) {
    super(props);
    const {
      location,
      path,
      refId,
      viewMode = props.docsOptions.docsMode ? 'docs' : 'story',
      singleStory,
      storyId,
      docsOptions,
      navigate,
    } = props;

    const store = new Store({
      getState: () => this.state,
      setState: (stateChange: Partial<State>, callback) => this.setState(stateChange, callback),
    });

    const routeData = { location, path, viewMode, singleStory, storyId, refId };
    const optionsData: API_OptionsData = { docsOptions };

    this.state = store.getInitialState(getInitialState({ ...routeData, ...optionsData }));

    const apiData = {
      navigate,
      store,
      provider: props.provider,
    };

    this.modules = [
      provider,
      channel,
      addons,
      layout,
      notifications,
      settings,
      releaseNotes,
      shortcuts,
      stories,
      refs,
      globals,
      url,
      version,
    ].map((m) =>
      m.init({ ...routeData, ...optionsData, ...apiData, state: this.state, fullAPI: this.api })
    );

    // Create our initial state by combining the initial state of all modules, then overlaying any saved state
    const state = getInitialState(this.state, ...this.modules.map((m) => m.state));

    // Get our API by combining the APIs exported by each module
    const api: API = Object.assign(this.api, { navigate }, ...this.modules.map((m) => m.api));

    this.state = state;
    this.api = api;
  }

  static getDerivedStateFromProps(props: ManagerProviderProps, state: State): State {
    if (state.path !== props.path) {
      return {
        ...state,
        location: props.location,
        path: props.path,
        refId: props.refId,
        viewMode: props.viewMode,
        storyId: props.storyId,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps: ManagerProviderProps, nextState: State): boolean {
    const prevState = this.state;
    const prevProps = this.props;

    if (prevState !== nextState) {
      return true;
    }
    if (prevProps.path !== nextProps.path) {
      return true;
    }
    return false;
  }

  initModules = () => {
    // Now every module has had a chance to set its API, call init on each module which gives it
    // a chance to do things that call other modules' APIs.
    this.modules.forEach((module) => {
      if ('init' in module) {
        module.init();
      }
    });
  };

  render() {
    const { children } = this.props;
    const value = {
      state: this.state,
      api: this.api,
    };

    return (
      <EffectOnMount effect={this.initModules}>
        <ManagerContext.Provider value={value}>
          <ManagerConsumer>{children}</ManagerConsumer>
        </ManagerContext.Provider>
      </EffectOnMount>
    );
  }
}

// EffectOnMount exists to work around a bug in Reach Router where calling
// navigate inside of componentDidMount (as could happen when we call init on any
// of our modules) does not cause Reach Router's LocationProvider to update with
// the correct path. Calling navigate inside on an effect does not have the
// same problem. See https://github.com/reach/router/issues/404
const EffectOnMount: FC<{
  children: ReactElement;
  effect: () => void;
}> = ({ children, effect }) => {
  React.useEffect(effect, []);
  return children;
};

interface ManagerConsumerProps<P = unknown> {
  filter?: (combo: Combo) => P;
  children: FC<P> | ReactNode;
}

const defaultFilter = (c: Combo) => c;

function ManagerConsumer<P = Combo>({
  // @ts-expect-error (Converted from ts-ignore)
  filter = defaultFilter,
  children,
}: ManagerConsumerProps<P>): ReactElement {
  const c = useContext(ManagerContext);
  const renderer = useRef(children);
  const filterer = useRef(filter);

  if (typeof renderer.current !== 'function') {
    return <Fragment>{renderer.current}</Fragment>;
  }

  const data = filterer.current(c);

  const l = useMemo(() => {
    return [...Object.entries(data).reduce((acc, keyval) => acc.concat(keyval), [])];
  }, [c.state]);

  return useMemo(() => {
    const Child = renderer.current as FC<P>;

    return <Child {...data} />;
  }, l);
}

export function useStorybookState(): State {
  const { state } = useContext(ManagerContext);
  return state;
}
export function useStorybookApi(): API {
  const { api } = useContext(ManagerContext);
  return api;
}

export type {
  API_StoriesHash as StoriesHash,
  API_RootEntry as RootEntry,
  API_GroupEntry as GroupEntry,
  API_ComponentEntry as ComponentEntry,
  API_DocsEntry as DocsEntry,
  API_StoryEntry as StoryEntry,
  API_HashEntry as HashEntry,
  API_LeafEntry as LeafEntry,
  API_ComposedRef as ComposedRef,
  API_Refs as Refs,
};
export { ManagerConsumer as Consumer, ManagerProvider as Provider };

export interface API_EventMap {
  [eventId: string]: Listener;
}

function orDefault<S>(fromStore: S, defaultState: S): S {
  if (typeof fromStore === 'undefined') {
    return defaultState;
  }
  return fromStore;
}

export const useChannel = (eventMap: API_EventMap, deps: any[] = []) => {
  const api = useStorybookApi();
  useEffect(() => {
    Object.entries(eventMap).forEach(([type, listener]) => api.on(type, listener));
    return () => {
      Object.entries(eventMap).forEach(([type, listener]) => api.off(type, listener));
    };
  }, deps);

  return api.emit;
};

export function useStoryPrepared(storyId?: StoryId) {
  const api = useStorybookApi();
  return api.isPrepared(storyId);
}

export function useParameter<S>(parameterKey: string, defaultValue?: S) {
  const api = useStorybookApi();

  const result = api.getCurrentParameter<S>(parameterKey);
  return orDefault<S>(result, defaultValue);
}

// cache for taking care of HMR
const addonStateCache: {
  [key: string]: any;
} = {};

// shared state
export function useSharedState<S>(stateId: string, defaultState?: S) {
  const api = useStorybookApi();
  const existingState = api.getAddonState<S>(stateId);
  const state = orDefault<S>(
    existingState,
    addonStateCache[stateId] ? addonStateCache[stateId] : defaultState
  );
  const setState = (s: S | API_StateMerger<S>, options?: Options) => {
    // set only after the stories are loaded
    if (addonStateCache[stateId]) {
      addonStateCache[stateId] = s;
    }
    api.setAddonState<S>(stateId, s, options);
  };
  const allListeners = useMemo(() => {
    const stateChangeHandlers = {
      [`${SHARED_STATE_CHANGED}-client-${stateId}`]: (s: S) => setState(s),
      [`${SHARED_STATE_SET}-client-${stateId}`]: (s: S) => setState(s),
    };
    const stateInitializationHandlers = {
      [SET_STORIES]: () => {
        const currentState = api.getAddonState(stateId);
        if (currentState) {
          addonStateCache[stateId] = currentState;
          api.emit(`${SHARED_STATE_SET}-manager-${stateId}`, currentState);
        } else if (addonStateCache[stateId]) {
          // this happens when HMR
          setState(addonStateCache[stateId]);
          api.emit(`${SHARED_STATE_SET}-manager-${stateId}`, addonStateCache[stateId]);
        } else if (defaultState !== undefined) {
          // if not HMR, yet the defaults are from the manager
          setState(defaultState);
          // initialize addonStateCache after first load, so its available for subsequent HMR
          addonStateCache[stateId] = defaultState;
          api.emit(`${SHARED_STATE_SET}-manager-${stateId}`, defaultState);
        }
      },
      [STORY_CHANGED]: () => {
        const currentState = api.getAddonState(stateId);

        if (currentState !== undefined) {
          api.emit(`${SHARED_STATE_SET}-manager-${stateId}`, currentState);
        }
      },
    };

    return {
      ...stateChangeHandlers,
      ...stateInitializationHandlers,
    };
  }, [stateId]);

  const emit = useChannel(allListeners);
  return [
    state,
    (newStateOrMerger: S | API_StateMerger<S>, options?: Options) => {
      setState(newStateOrMerger, options);
      emit(`${SHARED_STATE_CHANGED}-manager-${stateId}`, newStateOrMerger);
    },
  ] as [S, (newStateOrMerger: S | API_StateMerger<S>, options?: Options) => void];
}

export function useAddonState<S>(addonId: string, defaultState?: S) {
  return useSharedState<S>(addonId, defaultState);
}

export function useArgs(): [Args, (newArgs: Args) => void, (argNames?: string[]) => void] {
  const { getCurrentStoryData, updateStoryArgs, resetStoryArgs } = useStorybookApi();

  const data = getCurrentStoryData();
  const args = data.type === 'story' ? data.args : {};
  const updateArgs = useCallback(
    (newArgs: Args) => updateStoryArgs(data as API_StoryEntry, newArgs),
    [data, updateStoryArgs]
  );
  const resetArgs = useCallback(
    (argNames?: string[]) => resetStoryArgs(data as API_StoryEntry, argNames),
    [data, resetStoryArgs]
  );

  return [args, updateArgs, resetArgs];
}

export function useGlobals(): [Args, (newGlobals: Args) => void] {
  const api = useStorybookApi();
  return [api.getGlobals(), api.updateGlobals];
}

export function useGlobalTypes(): ArgTypes {
  return useStorybookApi().getGlobalTypes();
}

function useCurrentStory(): API_StoryEntry | API_DocsEntry {
  const { getCurrentStoryData } = useStorybookApi();

  return getCurrentStoryData();
}

export function useArgTypes(): ArgTypes {
  const current = useCurrentStory();
  return (current?.type === 'story' && current.argTypes) || {};
}

export { addons } from './lib/addons';

/* deprecated */
export { mockChannel, types, type Addon, type AddonStore } from './lib/addons';
