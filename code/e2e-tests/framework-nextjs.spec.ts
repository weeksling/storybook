/* eslint-disable jest/no-disabled-tests */
import type { Locator } from '@playwright/test';
import { test, expect } from '@playwright/test';
import process from 'process';
import { SbPage } from './util';

const storybookUrl = process.env.STORYBOOK_URL || 'http://localhost:6006';
const templateName = process.env.STORYBOOK_TEMPLATE_NAME;

test.describe('Next.js', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(storybookUrl);
    await new SbPage(page).waitUntilLoaded();
  });

  test.describe('next/navigation', () => {
    test.skip(
      // eslint-disable-next-line jest/valid-title
      !templateName.includes('nextjs/default-js'),
      'Only run this test for the Frameworks that support next/navigation'
    );

    let root: Locator;
    let sbPage: SbPage;

    function testRoutingBehaviour(buttonText: string, action: string) {
      test(`should trigger ${action} action`, async ({ page }) => {
        const button = root.locator('button', { hasText: buttonText });
        await button.click();

        await sbPage.viewAddonPanel('Actions');
        const logItem = await page.locator('#storybook-panel-root #panel-tab-content', {
          hasText: `nextNavigation.${action}`,
        });
        await expect(logItem).toBeVisible();
      });
    }

    test.beforeEach(async ({ page }) => {
      sbPage = new SbPage(page);

      await sbPage.navigateToStory('frameworks/nextjs_default-js/Navigation', 'default');
      root = sbPage.previewRoot();
    });

    testRoutingBehaviour('Go back', 'back');
    testRoutingBehaviour('Go forward', 'forward');
    testRoutingBehaviour('Prefetch', 'prefetch');
    testRoutingBehaviour('Push HTML', 'push');
    testRoutingBehaviour('Refresh', 'refresh');
    testRoutingBehaviour('Replace', 'replace');
  });

  test.describe('next/router', () => {
    test.skip(
      // eslint-disable-next-line jest/valid-title
      !templateName.includes('nextjs'),
      'Only run this test for the Frameworks that support next/router'
    );

    let root: Locator;
    let sbPage: SbPage;

    function testRoutingBehaviour(buttonText: string, action: string) {
      test(`should trigger ${action} action`, async ({ page }) => {
        const button = root.locator('button', { hasText: buttonText });
        await button.click();

        await sbPage.viewAddonPanel('Actions');
        const logItem = await page.locator('#storybook-panel-root #panel-tab-content', {
          hasText: `nextRouter.${action}`,
        });
        await expect(logItem).toBeVisible();
      });
    }

    test.beforeEach(async ({ page }) => {
      sbPage = new SbPage(page);

      await sbPage.navigateToStory('frameworks/nextjs_default-js/Router', 'default');
      root = sbPage.previewRoot();
    });

    testRoutingBehaviour('Go back', 'back');
    testRoutingBehaviour('Go forward', 'forward');
    testRoutingBehaviour('Prefetch', 'prefetch');
    testRoutingBehaviour('Push HTML', 'push');
    testRoutingBehaviour('Replace', 'replace');
  });
});
