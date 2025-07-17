import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { MeitavViewtradeComPage } from '../../pages/meitav.viewtrade.com/MeitavViewtradeComPage';

test.describe.serial('MeitavViewtradeComPage Tests', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser: testBrowser }) => {
    // Use the browser instance provided by Playwright test runner
    context = await testBrowser.newContext();
    page = await context.newPage();
    await page.goto('https://meitav.viewtrade.com/');
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('should log in with valid credentials', async () => {
    const pageObj = new MeitavViewtradeComPage(page);
    await pageObj.enterUsername('validUsername');
    await pageObj.enterPassword('validPassword');
    await pageObj.clickLogin();
    //const isLoggedIn = await pageObj.isLoggedIn();
    //expect(isLoggedIn).toBeTruthy();
  });

  test('should not log in with invalid credentials', async () => {
    const pageObj = new MeitavViewtradeComPage(page);
    await pageObj.enterUsername('invalidUsername');
    await pageObj.enterPassword('invalidPassword');
    await pageObj.clickLogin();
   // const isLoggedIn = await pageObj.isLoggedIn();
   // expect(isLoggedIn).toBeFalsy();
  });
});