import { test, expect } from '@playwright/test';
import process from 'process';
import { SbPage } from './util';

const storybookUrl = process.env.STORYBOOK_URL || 'http://localhost:8001';

test.describe('addon-controls', () => {
  test('should change component when changing controls', async ({ page }) => {
    await page.goto(storybookUrl);
    const sbPage = new SbPage(page);
    await sbPage.waitUntilLoaded();

    await sbPage.navigateToStory('example/button', 'primary');
    await sbPage.viewAddonPanel('Controls');

    // Text input: Label
    await expect(sbPage.previewRoot().locator('button')).toContainText('Button');
    const label = sbPage.panelContent().locator('textarea[name=label]');
    await label.fill('Hello world');
    await expect(sbPage.previewRoot().locator('button')).toContainText('Hello world');

    // Args in URL
    await page.waitForTimeout(300);
    const url = await page.url();
    await expect(url).toContain('args=label:Hello+world');

    // Boolean toggle: Primary/secondary
    await expect(sbPage.previewRoot().locator('button')).toHaveCSS(
      'background-color',
      'rgb(30, 167, 253)'
    );
    const toggle = sbPage.panelContent().locator('input[name=primary]');
    await toggle.click();
    await expect(sbPage.previewRoot().locator('button')).toHaveCSS(
      'background-color',
      'rgba(0, 0, 0, 0)'
    );

    // Color picker: Background color
    const color = sbPage.panelContent().locator('input[placeholder="Choose color..."]');
    await color.fill('red');
    await expect(sbPage.previewRoot().locator('button')).toHaveCSS(
      'background-color',
      'rgb(255, 0, 0)'
    );

    // TODO: enable this once the controls for size are aligned in all CLI templates.
    // Radio buttons: Size
    // cy.getStoryElement().find('button').should('have.css', 'font-size', '14px');
    // cy.get('label[for="size-large"]').click();
    // cy.getStoryElement().find('button').should('have.css', 'font-size', '16px');

    // Reset controls: assert that the component is back to original state
    const reset = sbPage.panelContent().locator('button[title="Reset controls"]');
    await reset.click();
    const button = sbPage.previewRoot().locator('button');
    await expect(button).toHaveCSS('font-size', '14px');
    await expect(button).toHaveCSS('background-color', 'rgb(30, 167, 253)');
    await expect(button).toContainText('Button');
  });

  test('should apply controls automatically when passed via url', async ({ page }) => {
    await page.goto(`${storybookUrl}?path=/story/example-button--primary&args=label:Hello+world`);

    const sbPage = new SbPage(page);
    await sbPage.waitUntilLoaded();
    await expect(sbPage.previewRoot().locator('button')).toContainText('Hello world');

    await sbPage.viewAddonPanel('Controls');
    const label = await sbPage.panelContent().locator('textarea[name=label]').inputValue();
    await expect(label).toEqual('Hello world');
  });
});
