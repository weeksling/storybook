import React, { Fragment } from 'react';
import { ActiveTabs } from '@storybook/manager-api';
import type { DecoratorFn } from '@storybook/react';

import type { MobileProps } from './mobile';
import { Mobile } from './mobile';

import { mockProps, realProps, MockPage } from './app.mockdata';

export default {
  title: 'Layout/Mobile',
  component: Mobile,
  parameters: { passArgsFirst: false },
  decorators: [
    ((storyFn, c) => {
      const mocked = true;

      const props = {
        ...(mocked ? mockProps : realProps),
      };

      return storyFn({ props, ...c });
    }) as DecoratorFn,
  ],
};

export const InitialSidebar = ({ props }: { props: MobileProps }) => (
  <Mobile {...props} options={{ ...props.options, initialActive: ActiveTabs.SIDEBAR }} />
);
export const InitialCanvas = ({ props }: { props: MobileProps }) => (
  <Mobile {...props} options={{ ...props.options, initialActive: ActiveTabs.CANVAS }} />
);
export const InitialAddons = ({ props }: { props: MobileProps }) => (
  <Mobile {...props} options={{ ...props.options, initialActive: ActiveTabs.ADDONS }} />
);
export const NoPanel = ({ props }: { props: MobileProps }) => (
  <Mobile {...props} options={{ ...props.options, showPanel: false }} />
);

export const Fullscreen = ({ props }: { props: MobileProps }) => (
  <Mobile
    {...props}
    options={{ ...props.options, initialActive: ActiveTabs.SIDEBAR, isFullscreen: true }}
  />
);

export const Page = ({ props }: { props: MobileProps }) => (
  <Mobile
    {...props}
    options={{ ...props.options, initialActive: ActiveTabs.CANVAS }}
    pages={[
      {
        key: 'settings',
        route: ({ children }) => <Fragment>{children}</Fragment>,
        render: () => <MockPage />,
      },
    ]}
    viewMode="settings"
  />
);
