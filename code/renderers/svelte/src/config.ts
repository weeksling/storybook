import { parameters as docsParams } from './docs/config';

export const parameters = { framework: 'svelte' as const, ...docsParams };
export { decorators, argTypesEnhancers } from './docs/config';

export { render, renderToCanvas } from './render';
export { decorateStory as applyDecorators } from './decorators';
