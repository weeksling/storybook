import { withBackground } from './decorators/withBackground';
import { withGrid } from './decorators/withGrid';
import { PARAM_KEY } from './constants';

export const decorators = [withGrid, withBackground];
export const parameters = {
  [PARAM_KEY]: {
    grid: {
      cellSize: 20,
      opacity: 0.5,
      cellAmount: 5,
    },
    values: [
      { name: 'light', value: '#F8F8F8' },
      { name: 'dark', value: '#333333' },
    ],
  },
};

export const globals = {
  [PARAM_KEY]: null as any,
};
