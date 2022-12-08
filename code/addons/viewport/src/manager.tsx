import * as React from 'react';
import { addons, types } from '@storybook/manager-api';

import { ADDON_ID } from './constants';

import { ViewportTool } from './Tool';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'viewport / media-queries',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <ViewportTool />,
  });
});
