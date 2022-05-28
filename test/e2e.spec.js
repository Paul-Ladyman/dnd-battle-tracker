const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('');
  const title = page.locator('.main-title');
  await expect(title).toHaveText('D&D Battle Tracker');
});
