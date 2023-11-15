const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ context }) => {
  await context.route('https://cdn.ko-fi.com/cdn/kofi4.png?v=3', async (route) => {
    await route.fulfill('');
  });

  await context.route('https://fonts.googleapis.com/css2?family=IM+Fell+Great+Primer+SC&family=Open+Sans&display=swap', async (route) => {
    await route.fulfill('');
  });

  await context.route('https://dndbattletracker.com/favicon.png', async (route) => {
    await route.fulfill('');
  });
});

// Online only
test('A DM can share an existing battle with their players who receive subsequent updates', async ({ page, context }) => {
  await page.goto('');

  await page.fill('text=Creature Name', 'goblin');
  await page.fill('text=Initiative (optional)', '1');
  await page.fill('text=HP (optional)', '1');
  await page.fill('text=AC (optional)', '1');
  await page.locator('role=button[name="Add creature"]').click();
  await page.locator('role=button[name="Battle Menu"]').click();
  await page.locator('role=menuitem[name="Share battle"]').click();

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

test('New application versions are fetched immediately if the network allows', async ({ page, context }) => {
  await page.goto('');
  // Ensure page is controlled by service worker
  await page.reload();

  // New application version
  await context.route('/', async (route) => {
    await route.fulfill({
      body: '<h1>New Title</h1>',
      headers: {
        'content-type': 'text/html',
      },
    });
  });

  await page.reload();
  const newTitle = page.locator('role=heading[name="New Title"]');
  await expect(newTitle).toBeVisible();
});
