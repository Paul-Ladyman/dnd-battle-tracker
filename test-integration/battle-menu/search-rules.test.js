import '@testing-library/jest-dom';
import DmApp from '../page-object-models/dmApp';
import PlayerApp from '../page-object-models/playerApp';

describe('Search rules - DM', () => {
  test('closes the Battle Menu', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Search rules');
    await dmApp.battleMenu.assertClosed();
  });

  test('opens the rules search panel', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Search rules');
    await dmApp.rulesSearchBar.assertOpen();
  });

  test('closes the rules search panel', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Search rules');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Close search');
    await dmApp.rulesSearchBar.assertClosed();
  });

  test('allows D&D Beyond to be searched', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Search rules');
    await dmApp.rulesSearchBar.enterText('mounted combat');
    await dmApp.rulesSearchBar.assertSearch('mounted%20combat');
  });
});

describe('Search rules - Player', () => {
  test('closes the Battle Menu', async () => {
    const playerApp = new PlayerApp();
    await PlayerApp.waitForOnline();
    await playerApp.battleMenu.toggle();
    await playerApp.battleMenu.selectMenuItem('Search rules');
    await playerApp.battleMenu.assertClosed();
  });

  test('opens the rules search panel', async () => {
    const playerApp = new PlayerApp();
    await PlayerApp.waitForOnline();
    await playerApp.battleMenu.toggle();
    await playerApp.battleMenu.selectMenuItem('Search rules');
    await playerApp.rulesSearchBar.assertOpen();
  });

  test('closes the rules search panel', async () => {
    const playerApp = new PlayerApp();
    await PlayerApp.waitForOnline();
    await playerApp.battleMenu.toggle();
    await playerApp.battleMenu.selectMenuItem('Search rules');
    await playerApp.battleMenu.toggle();
    await playerApp.battleMenu.selectMenuItem('Close search');
    await playerApp.rulesSearchBar.assertClosed();
  });

  test('allows D&D Beyond to be searched', async () => {
    const playerApp = new PlayerApp();
    await PlayerApp.waitForOnline();
    await playerApp.battleMenu.toggle();
    await playerApp.battleMenu.selectMenuItem('Search rules');
    await playerApp.rulesSearchBar.enterText('mounted combat');
    await playerApp.rulesSearchBar.assertSearch('mounted%20combat');
  });
});
