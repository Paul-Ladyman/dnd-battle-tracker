const { test, expect } = require('@playwright/test');

test('A DM can share an existing battle with their players who receive subsequent updates', async ({ page, context }) => {
  await page.goto('');

  const [dmPage] = context.pages();
  await dmPage.fill('text=Creature Name', 'goblin');
  await dmPage.locator('role=button[name="Add creature"]').click();
  await dmPage.locator('role=button[name="Options Menu"]').click();
  await dmPage.locator('role=button[name="Enable share"]').click();
  await dmPage.locator('text=Player session link').click();
  await dmPage.fill('text=Creature Name', 'owlbear');
  await dmPage.locator('role=button[name="Add creature"]').click();

  const playerPage = context.pages()[1];
  const goblin = playerPage.locator('role=button', { hasText: /^goblin$/ });
  const owlbear = playerPage.locator('role=button', { hasText: /^owlbear$/ });
  await expect(goblin).toBeVisible();
  await expect(owlbear).toBeVisible();
});
