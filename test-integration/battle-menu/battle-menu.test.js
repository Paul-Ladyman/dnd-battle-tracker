import DmApp from '../page-object-models/dmApp';

beforeAll(() => {
  window.FLAG_new_battle_menu = 'true';
});

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

  it('displays the menu options when opened', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.assertMenuItem('Save battle');
    await dmApp.battleMenu.assertMenuItem('Load battle');
    await dmApp.battleMenu.assertMenuItem('Share battle');
    await dmApp.battleMenu.assertMenuItem('Search rules');
    await dmApp.battleMenu.assertMenuItem('Reset battle');
  });
});
