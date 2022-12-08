import { baseGenerator } from '../baseGenerator';
import type { Generator } from '../types';

const generator: Generator = async (packageManager, npmOptions, options) => {
  await baseGenerator(packageManager, npmOptions, options, 'riot', {
    extraPackages: ['riot-tag-loader'],
  });
};

export default generator;
