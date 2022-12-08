/* eslint-disable jest/no-disabled-tests */
import { test, expect } from '@playwright/test';
import process from 'process';
import { SbPage } from './util';

const storybookUrl = process.env.STORYBOOK_URL || 'http://localhost:8001';
const templateName = process.env.STORYBOOK_TEMPLATE_NAME || '';

test.describe('addon-interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storybookUrl);
    await new SbPage(page).waitUntilLoaded();
  });

  // FIXME: skip xxx
  test('should have interactions', async ({ page }) => {
    // templateName is e.g. 'Vue-CLI (Default JS)'
    test.skip(
      // eslint-disable-next-line jest/valid-title
      /^(lit)/i.test(`${templateName}`),
      `Skipping ${templateName}, which does not support addon-interactions`
    );

    const sbPage = new SbPage(page);

    await sbPage.navigateToStory('example/page', 'logged-in');
    await sbPage.viewAddonPanel('Interactions');

    const welcome = await sbPage.previewRoot().locator('.welcome');
    await expect(welcome).toContainText('Welcome, Jane Doe!');

    const interactionsTab = await page.locator('#tabbutton-interactions');
    await expect(interactionsTab).toContainText(/(1)/);
    await expect(interactionsTab).toBeVisible();

    const panel = sbPage.panelContent();
    await expect(panel).toContainText(/Pass/);
    await expect(panel).toContainText(/userEvent.click/);
    await expect(panel).toBeVisible();

    const done = await panel.locator('[data-testid=icon-done]');
    await expect(done).toBeVisible();
  });

  test('should step through interactions', async ({ page }) => {
    // templateName is e.g. 'Vue-CLI (Default JS)'
    test.skip(
      // eslint-disable-next-line jest/valid-title
      /^(lit)/i.test(`${templateName}`),
      `Skipping ${templateName}, which does not support addon-interactions`
    );

    const sbPage = new SbPage(page);

    await sbPage.navigateToStory('addons/interactions/basics', 'type-and-clear');
    await sbPage.viewAddonPanel('Interactions');

    // Test initial state - Interactions have run, count is correct and values are as expected
    const formInput = await sbPage.previewRoot().locator('#interaction-test-form input');
    await expect(formInput).toHaveValue('final value');

    const interactionsTab = await page.locator('#tabbutton-interactions');
    await expect(interactionsTab).toContainText(/(3)/);
    await expect(interactionsTab).toBeVisible();

    const panel = sbPage.panelContent();
    const runStatusBadge = await panel.locator('[aria-label="Status of the test run"]');
    await expect(runStatusBadge).toContainText(/Pass/);
    await expect(panel).toContainText(/value: "initial value"/);
    await expect(panel).toContainText(/value: ""/);
    await expect(panel).toContainText(/value: "final value"/);
    await expect(panel).toBeVisible();

    // Test interactions debugger - Stepping through works, count is correct and values are as expected
    const interactionsRow = await panel.locator('[aria-label="Interaction step"]');

    await interactionsRow.first().isVisible();

    await expect(await interactionsRow.count()).toEqual(3);
    const firstInteraction = interactionsRow.first();
    await firstInteraction.click();

    await expect(runStatusBadge).toContainText(/Runs/);
    await expect(formInput).toHaveValue('initial value');

    const goForwardBtn = await panel.locator('[aria-label="Go forward"]');
    await goForwardBtn.click();
    await expect(formInput).toHaveValue('');
    await goForwardBtn.click();
    await expect(formInput).toHaveValue('final value');

    await expect(runStatusBadge).toContainText(/Pass/);

    // Test rerun state (from addon panel) - Interactions have rerun, count is correct and values are as expected
    const rerunInteractionButton = await panel.locator('[aria-label="Rerun"]');
    await rerunInteractionButton.click();
    await interactionsRow.first().isVisible();
    await interactionsRow.nth(1).isVisible();
    await interactionsRow.nth(2).isVisible();
    await expect(interactionsTab).toContainText(/(3)/);
    await expect(interactionsTab).toBeVisible();

    // Test remount state (from toolbar) - Interactions have rerun, count is correct and values are as expected
    const remountComponentButton = await page.locator('[title="Remount component"]');
    await remountComponentButton.click();
    await interactionsRow.first().isVisible();
    await interactionsRow.nth(1).isVisible();
    await interactionsRow.nth(2).isVisible();
    await expect(interactionsTab).toContainText(/(3)/);
    await expect(interactionsTab).toBeVisible();
  });
});
