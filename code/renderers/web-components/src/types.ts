import type { StoryContext as StoryContextBase, WebRenderer } from '@storybook/types';
import type { TemplateResult, SVGTemplateResult } from 'lit-html';

export type StoryFnHtmlReturnType = string | Node | TemplateResult | SVGTemplateResult;

export type StoryContext = StoryContextBase<WebComponentsRenderer>;

/**
 * @deprecated Use `WebComponentsRenderer` instead.
 */
export type WebComponentsFramework = WebComponentsRenderer;
export interface WebComponentsRenderer extends WebRenderer {
  component: string;
  storyResult: StoryFnHtmlReturnType;
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}
