import type { FC } from 'react';
import React, { Component } from 'react';

import { type API, useStorybookApi } from '@storybook/manager-api';

import { AboutScreen } from './about';

// Clear a notification on mount. This could be exported by core/notifications.js perhaps?
class NotificationClearer extends Component<{ api: API; notificationId: string }> {
  componentDidMount() {
    const { api, notificationId } = this.props;
    api.clearNotification(notificationId);
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

const AboutPage: FC = () => {
  const api = useStorybookApi();

  return (
    <NotificationClearer api={api} notificationId="update">
      <AboutScreen current={api.getCurrentVersion()} latest={api.getLatestVersion()} />
    </NotificationClearer>
  );
};

export { AboutPage };
