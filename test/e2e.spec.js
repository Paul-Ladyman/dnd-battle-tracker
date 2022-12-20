const { test, expect } = require('@playwright/test');

test('A DM can share an existing battle with their players who receive subsequent updates', async ({ page, context }) => {
  await page.goto('');

  await page.fill('text=Creature Name', 'goblin');
  await page.locator('role=button[name="Add creature"]').click();
  await page.locator('role=button[name="Options Menu"]').click();
  await page.locator('role=button[name="Enable share"]').click();

  const [playerPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('text=Player session').click(),
  ]);
  await playerPage.waitForLoadState();

  const goblin = playerPage.locator('role=button', { hasText: /^goblin$/ });
  await expect(goblin).toBeVisible();

  await page.fill('text=Creature Name', 'owlbear');
  await page.locator('role=button[name="Add creature"]').click();

  const owlbear = playerPage.locator('role=button', { hasText: /^owlbear$/ });
  await expect(owlbear).toBeVisible();
});

test('The application is available offline after the first page load', async ({ page, context }) => {
  await page.goto('');
  const title = page.locator('role=heading[name="D&D Battle Tracker"]');
  await expect(title).toBeVisible();

  await context.setOffline(true);
  await page.reload();
  const offlineTitle = page.locator('role=heading[name="D&D Battle Tracker"]');
  await expect(offlineTitle).toBeVisible();
});
