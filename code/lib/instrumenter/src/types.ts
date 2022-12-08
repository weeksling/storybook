import type { StoryId } from '@storybook/types';

export interface Call {
  id: string;
  cursor: number;
  storyId: StoryId;
  ancestors: Call['id'][];
  path: Array<string | CallRef>;
  method: string;
  args: any[];
  interceptable: boolean;
  retain: boolean;
  status?: CallStates.DONE | CallStates.ERROR | CallStates.ACTIVE | CallStates.WAITING;
  exception?: {
    name: Error['name'];
    message: Error['message'];
    stack: Error['stack'];
    callId: Call['id'];
  };
}

export enum CallStates {
  DONE = 'done',
  ERROR = 'error',
  ACTIVE = 'active',
  WAITING = 'waiting',
}

export interface CallRef {
  __callId__: Call['id'];
}

export interface ElementRef {
  __element__: {
    prefix?: string;
    localName: string;
    id?: string;
    classNames?: string[];
    innerText?: string;
  };
}

export interface ControlStates {
  debugger: boolean;
  start: boolean;
  back: boolean;
  goto: boolean;
  next: boolean;
  end: boolean;
}

export interface LogItem {
  callId: Call['id'];
  status: Call['status'];
  ancestors: Call['id'][];
}

export interface SyncPayload {
  controlStates: ControlStates;
  logItems: LogItem[];
  pausedAt?: Call['id'];
}

export interface State {
  renderPhase: 'loading' | 'rendering' | 'playing' | 'played' | 'completed' | 'aborted' | 'errored';
  isDebugging: boolean;
  isPlaying: boolean;
  isLocked: boolean;
  cursor: number;
  calls: Call[];
  shadowCalls: Call[];
  callRefsByResult: Map<any, CallRef & { retain: boolean }>;
  chainedCallIds: Set<Call['id']>;
  ancestors: Call['id'][];
  playUntil?: Call['id'];
  resolvers: Record<Call['id'], Function>;
  syncTimeout: ReturnType<typeof setTimeout>;
  forwardedException?: Error;
}

export interface Options {
  intercept?: boolean | ((method: string, path: Array<string | CallRef>) => boolean);
  retain?: boolean;
  mutate?: boolean;
  path?: Array<string | CallRef>;
  getArgs?: (call: Call, state: State) => Call['args'];
}
