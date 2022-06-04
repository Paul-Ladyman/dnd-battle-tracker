const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('');

  const title = page.locator('.main-title');
  await expect(title).toHaveText('D&D Battle Tracker');

  await page.fill('text=Creature Name', 'goblin');

  await page.locator('role=button[name="Add creature"]').click();

  await page.locator('role=button[name="Options Menu"]').click();

  await page.locator('role=button[name="Enable share"]').click();

  const playerPage = await page.locator('text=Player session link').click();

  // await playerPage.waitForLoadState();

  // const goblin = playerPage.locator('text=Goblin');

  // await page.pause();

  // await expect(goblin).toBeVisible();
});
