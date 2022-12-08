import type { FC } from 'react';
import React, { useMemo } from 'react';

import { Badge } from '@storybook/components';
import type { API } from '@storybook/manager-api';
import { styled, useTheme } from '@storybook/theming';

import { shortcutToHumanString } from '@storybook/manager-api';
import { MenuItemIcon } from '../components/sidebar/Menu';

const focusableUIElements = {
  storySearchField: 'storybook-explorer-searchfield',
  storyListMenu: 'storybook-explorer-menu',
  storyPanelRoot: 'storybook-panel-root',
};

const Key = styled.code(({ theme }) => ({
  width: 16,
  height: 16,
  lineHeight: '16px',
  textAlign: 'center',
  fontSize: '11px',
  background: theme.base === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
  color: theme.base === 'light' ? theme.color.dark : theme.textMutedColor,
  borderRadius: 2,
  userSelect: 'none',
  pointerEvents: 'none',
  '& + &': {
    marginLeft: 2,
  },
}));

const Shortcut: FC<{ keys: string[] }> = ({ keys }) => (
  <>
    {keys.map((key, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Key key={index}>{shortcutToHumanString([key])}</Key>
    ))}
  </>
);

export const useMenu = (
  api: API,
  showToolbar: boolean,
  isFullscreen: boolean,
  showPanel: boolean,
  showNav: boolean,
  enableShortcuts: boolean
) => {
  const theme = useTheme();
  const shortcutKeys = api.getShortcutKeys();

  const about = useMemo(
    () => ({
      id: 'about',
      title: 'About your Storybook',
      onClick: () => api.navigateToSettingsPage('/settings/about'),
      right: api.versionUpdateAvailable() && <Badge status="positive">Update</Badge>,
      left: <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const releaseNotes = useMemo(
    () => ({
      id: 'release-notes',
      title: 'Release notes',
      onClick: () => api.navigateToSettingsPage('/settings/release-notes'),
      left: <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const shortcuts = useMemo(
    () => ({
      id: 'shortcuts',
      title: 'Keyboard shortcuts',
      onClick: () => api.navigateToSettingsPage('/settings/shortcuts'),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.shortcutsPage} /> : null,
      left: <MenuItemIcon />,
      style: {
        borderBottom: `4px solid ${theme.appBorderColor}`,
      },
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const sidebarToggle = useMemo(
    () => ({
      id: 'S',
      title: 'Show sidebar',
      onClick: () => api.toggleNav(),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.toggleNav} /> : null,
      left: showNav ? <MenuItemIcon icon="check" /> : <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys, showNav]
  );

  const toolbarToogle = useMemo(
    () => ({
      id: 'T',
      title: 'Show toolbar',
      onClick: () => api.toggleToolbar(),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.toolbar} /> : null,
      left: showToolbar ? <MenuItemIcon icon="check" /> : <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys, showToolbar]
  );

  const addonsToggle = useMemo(
    () => ({
      id: 'A',
      title: 'Show addons',
      onClick: () => api.togglePanel(),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.togglePanel} /> : null,
      left: showPanel ? <MenuItemIcon icon="check" /> : <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys, showPanel]
  );

  const addonsOrientationToggle = useMemo(
    () => ({
      id: 'D',
      title: 'Change addons orientation',
      onClick: () => api.togglePanelPosition(),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.panelPosition} /> : null,
      left: <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const fullscreenToggle = useMemo(
    () => ({
      id: 'F',
      title: 'Go full screen',
      onClick: () => api.toggleFullscreen(),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.fullScreen} /> : null,
      left: isFullscreen ? 'check' : <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys, isFullscreen]
  );

  const searchToggle = useMemo(
    () => ({
      id: '/',
      title: 'Search',
      onClick: () => api.focusOnUIElement(focusableUIElements.storySearchField),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.search} /> : null,
      left: <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const up = useMemo(
    () => ({
      id: 'up',
      title: 'Previous component',
      onClick: () => api.jumpToComponent(-1),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.prevComponent} /> : null,
      left: <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const down = useMemo(
    () => ({
      id: 'down',
      title: 'Next component',
      onClick: () => api.jumpToComponent(1),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.nextComponent} /> : null,
      left: <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const prev = useMemo(
    () => ({
      id: 'prev',
      title: 'Previous story',
      onClick: () => api.jumpToStory(-1),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.prevStory} /> : null,
      left: <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const next = useMemo(
    () => ({
      id: 'next',
      title: 'Next story',
      onClick: () => api.jumpToStory(1),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.nextStory} /> : null,
      left: <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const collapse = useMemo(
    () => ({
      id: 'collapse',
      title: 'Collapse all',
      onClick: () => api.collapseAll(),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.collapseAll} /> : null,
      left: <MenuItemIcon />,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const getAddonsShortcuts = (): any[] => {
    const addonsShortcuts = api.getAddonsShortcuts();
    const keys = shortcutKeys as any;
    return Object.entries(addonsShortcuts)
      .filter(([actionName, { showInMenu }]) => showInMenu)
      .map(([actionName, { label, action }]) => ({
        id: actionName,
        title: label,
        onClick: () => action(),
        right: enableShortcuts ? <Shortcut keys={keys[actionName]} /> : null,
        left: <MenuItemIcon />,
      }));
  };

  return useMemo(
    () => [
      about,
      ...(api.releaseNotesVersion() ? [releaseNotes] : []),
      shortcuts,
      sidebarToggle,
      toolbarToogle,
      addonsToggle,
      addonsOrientationToggle,
      fullscreenToggle,
      searchToggle,
      up,
      down,
      prev,
      next,
      collapse,
      ...getAddonsShortcuts(),
    ],
    [
      about,
      ...(api.releaseNotesVersion() ? [releaseNotes] : []),
      shortcuts,
      sidebarToggle,
      toolbarToogle,
      addonsToggle,
      addonsOrientationToggle,
      fullscreenToggle,
      searchToggle,
      up,
      down,
      prev,
      next,
      collapse,
    ]
  );
};
