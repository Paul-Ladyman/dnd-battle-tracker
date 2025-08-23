import DmApp from '../page-object-models/dmApp';
import PlayerApp from '../page-object-models/playerApp';

describe('Battle Menu', () => {
  it('is closed by default', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.assertClosed();
  });

  it('can be opened', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.assertOpen();
  });

  it('can be closed', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.assertClosed();
  });

  it('displays the menu items when opened', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.assertMenuItem('Search rules');
    await dmApp.battleMenu.assertMenuItem('Share battle');
    await dmApp.battleMenu.assertMenuItem('Reset battle');
    await dmApp.battleMenu.assertMenuItem('Save battle');
    await dmApp.battleMenu.assertMenuItem('Load battle');
  });

  it('displays only Search rules in the Player App', async () => {
    const playerApp = new PlayerApp();
    await PlayerApp.waitForOnline();
    await playerApp.battleMenu.toggle();
    await playerApp.battleMenu.assertMenuItem('Search rules');
    await playerApp.battleMenu.assertMenuItemsLength(1);
  });
});

describe('Battle Menu navigation', () => {
  it('opens the menu on the first item when navigating forwards', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.navigate(1);
    await dmApp.battleMenu.assertOpen();
    await dmApp.battleMenu.assertMenuItemFocused('Search rules');
  });

  it('opens the menu on the last item when navigating backwards', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.navigate(1, false);
    await dmApp.battleMenu.assertOpen();
    await dmApp.battleMenu.assertMenuItemFocused('Reset battle');
  });

  it('allows the menu items to be navigated forwards with the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Search rules');
    await dmApp.battleMenu.navigate(2);
    await dmApp.battleMenu.assertMenuItemFocused('Save battle');
  });

  it('wraps navigation when navigating forwards with the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickNo();
    await dmApp.battleMenu.navigate(2);
    await dmApp.battleMenu.assertMenuItemFocused('Share battle');
  });

  it('allows the menu items to be navigated backwards with the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickNo();
    await dmApp.battleMenu.navigate(2, false);
    await dmApp.battleMenu.assertMenuItemFocused('Save battle');
  });

  it('wraps navigation when navigating backwards with the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Search rules');
    await dmApp.battleMenu.navigate(2, false);
    await dmApp.battleMenu.assertMenuItemFocused('Load battle');
  });

  it('navigates to the first menu item when the home key is pressed', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickNo();
    await dmApp.battleMenu.navigateHome();
    await dmApp.battleMenu.assertMenuItemFocused('Search rules');
  });

  it('navigates to the last button when the end key is pressed', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Load battle');
    await dmApp.battleMenu.navigateEnd();
    await dmApp.battleMenu.assertMenuItemFocused('Reset battle');
  });

  it('closes the menu when it loses focus', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Search rules');
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.battleMenu.assertClosed();
  });

  it('resets the focused menu item when the menu loses focus', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickNo();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.battleMenu.navigate(1);
    await dmApp.battleMenu.assertMenuItemFocused('Search rules');
  });

  it('closes the menu via the keyboard shortcut', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Search rules');
    await dmApp.battleMenu.closeByKeyboard();
    await dmApp.battleMenu.assertClosed();
  });

  it('resets the focused menu item when the menu is closed via the keyboard shortcut', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickNo();
    await dmApp.battleMenu.closeByKeyboard();
    await dmApp.battleMenu.navigate(1);
    await dmApp.battleMenu.assertMenuItemFocused('Search rules');
  });

  it('sets focus back on the menu button when the menu is closed via the keyboard shortcut', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Search rules');
    await dmApp.battleMenu.closeByKeyboard();
    await dmApp.battleMenu.assertButtonFocused();
  });
});
