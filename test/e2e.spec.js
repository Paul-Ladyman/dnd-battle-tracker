const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('');

  await page.fill('text=Creature Name', 'goblin');

  await page.locator('role=button[name="Add creature"]').click();

  await page.locator('role=button[name="Options Menu"]').click();

  await page.locator('role=button[name="Enable share"]').click();

  await page.locator('text=Player session link').click();

  const goblin = page.locator('role=button', { hasText: /^goblin$/ });
  await expect(goblin).toBeVisible();
});
