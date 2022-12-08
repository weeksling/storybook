import React from 'react';
import { addons, types } from '@storybook/manager-api';

import { ADDON_ID } from './constants';
import { OutlineSelector } from './OutlineSelector';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Outline',
    type: types.TOOL,
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => <OutlineSelector />,
  });
});
