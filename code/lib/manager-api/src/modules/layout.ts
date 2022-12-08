import global from 'global';
import pick from 'lodash/pick';
import { dequal as deepEqual } from 'dequal';
import { create } from '@storybook/theming/create';
import { SET_CONFIG } from '@storybook/core-events';
import type { ThemeVars } from '@storybook/theming';

import type { API_Layout, API_PanelPositions, API_UI } from '@storybook/types';
import merge from '../lib/merge';
import type { State, ModuleFn } from '../index';

const { document } = global;

export const ActiveTabs = {
  SIDEBAR: 'sidebar' as const,
  CANVAS: 'canvas' as const,
  ADDONS: 'addons' as const,
};

export interface SubState {
  layout: API_Layout;
  ui: API_UI;
  selectedPanel: string | undefined;
  theme: ThemeVars;
}

export interface SubAPI {
  toggleFullscreen: (toggled?: boolean) => void;
  togglePanel: (toggled?: boolean) => void;
  togglePanelPosition: (position?: API_PanelPositions) => void;
  toggleNav: (toggled?: boolean) => void;
  toggleToolbar: (toggled?: boolean) => void;
  setOptions: (options: any) => void;
}

type PartialSubState = Partial<SubState>;

const defaultState: SubState = {
  ui: {
    enableShortcuts: true,
  },
  layout: {
    initialActive: ActiveTabs.CANVAS,
    showToolbar: true,
    isFullscreen: false,
    showPanel: true,
    showNav: true,
    panelPosition: 'bottom',
    showTabs: true,
  },
  selectedPanel: undefined,
  theme: create(),
};

export const focusableUIElements = {
  storySearchField: 'storybook-explorer-searchfield',
  storyListMenu: 'storybook-explorer-menu',
  storyPanelRoot: 'storybook-panel-root',
};

export const init: ModuleFn = ({ store, provider, singleStory, fullAPI }) => {
  const api = {
    toggleFullscreen(toggled?: boolean) {
      return store.setState(
        (state: State) => {
          const { showNav } = state.layout;

          const value = typeof toggled === 'boolean' ? toggled : !state.layout.isFullscreen;
          const shouldShowNav = showNav === false && value === false;

          return {
            layout: {
              ...state.layout,
              isFullscreen: value,
              showNav: !singleStory && shouldShowNav ? true : showNav,
            },
          };
        },
        { persistence: 'session' }
      );
    },

    togglePanel(toggled?: boolean) {
      return store.setState(
        (state: State) => {
          const { showNav, isFullscreen } = state.layout;

          const value = typeof toggled !== 'undefined' ? toggled : !state.layout.showPanel;
          const shouldToggleFullScreen = showNav === false && value === false;

          return {
            layout: {
              ...state.layout,
              showPanel: value,
              isFullscreen: shouldToggleFullScreen ? true : isFullscreen,
            },
          };
        },
        { persistence: 'session' }
      );
    },

    togglePanelPosition(position?: 'bottom' | 'right') {
      if (typeof position !== 'undefined') {
        return store.setState(
          (state: State) => ({
            layout: {
              ...state.layout,
              panelPosition: position,
            },
          }),
          { persistence: 'permanent' }
        );
      }

      return store.setState(
        (state: State) => ({
          layout: {
            ...state.layout,
            panelPosition: state.layout.panelPosition === 'right' ? 'bottom' : 'right',
          },
        }),
        { persistence: 'permanent' }
      );
    },

    toggleNav(toggled?: boolean) {
      return store.setState(
        (state: State) => {
          if (singleStory) return { layout: state.layout };

          const { showPanel, isFullscreen } = state.layout;
          const showNav = typeof toggled !== 'undefined' ? toggled : !state.layout.showNav;
          const shouldToggleFullScreen = showPanel === false && showNav === false;

          return {
            layout: {
              ...state.layout,
              showNav,
              isFullscreen: shouldToggleFullScreen ? true : !showNav && isFullscreen,
            },
          };
        },
        { persistence: 'session' }
      );
    },

    toggleToolbar(toggled?: boolean) {
      return store.setState(
        (state: State) => {
          const value = typeof toggled !== 'undefined' ? toggled : !state.layout.showToolbar;

          return {
            layout: {
              ...state.layout,
              showToolbar: value,
            },
          };
        },
        { persistence: 'session' }
      );
    },

    resetLayout() {
      return store.setState(
        (state: State) => {
          return {
            layout: {
              ...state.layout,
              showNav: false,
              showPanel: false,
              isFullscreen: false,
            },
          };
        },
        { persistence: 'session' }
      );
    },

    focusOnUIElement(elementId?: string, select?: boolean) {
      if (!elementId) {
        return;
      }
      const element = document.getElementById(elementId);
      if (element) {
        element.focus();
        if (select) element.select();
      }
    },

    getInitialOptions() {
      const { theme, selectedPanel, ...options } = provider.getConfig();

      return {
        ...defaultState,
        layout: {
          ...defaultState.layout,
          ...pick(options, Object.keys(defaultState.layout)),
          ...(singleStory && { showNav: false }),
        },
        ui: {
          ...defaultState.ui,
          ...pick(options, Object.keys(defaultState.ui)),
        },
        selectedPanel: selectedPanel || defaultState.selectedPanel,
        theme: theme || defaultState.theme,
      };
    },

    setOptions: (options: any) => {
      const { layout, ui, selectedPanel, theme } = store.getState();

      if (options) {
        const updatedLayout = {
          ...layout,
          ...pick(options, Object.keys(layout)),
          ...(singleStory && { showNav: false }),
        };

        const updatedUi = {
          ...ui,
          ...pick(options, Object.keys(ui)),
        };

        const updatedTheme = {
          ...theme,
          ...options.theme,
        };

        const modification: PartialSubState = {};

        if (!deepEqual(ui, updatedUi)) {
          modification.ui = updatedUi;
        }
        if (!deepEqual(layout, updatedLayout)) {
          modification.layout = updatedLayout;
        }
        if (options.selectedPanel && !deepEqual(selectedPanel, options.selectedPanel)) {
          modification.selectedPanel = options.selectedPanel;
        }

        if (Object.keys(modification).length) {
          store.setState(modification, { persistence: 'permanent' });
        }
        if (!deepEqual(theme, updatedTheme)) {
          store.setState({ theme: updatedTheme });
        }
      }
    },
  };

  const persisted = pick(store.getState(), 'layout', 'ui', 'selectedPanel');

  return {
    api,
    state: merge(api.getInitialOptions(), persisted),
    init: () => {
      api.setOptions(merge(api.getInitialOptions(), persisted));
      fullAPI.on(SET_CONFIG, () => {
        api.setOptions(merge(api.getInitialOptions(), persisted));
      });
    },
  };
};
