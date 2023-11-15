import '@testing-library/jest-dom';
import DmApp from '../page-object-models/dmApp';

describe('Reset battle', () => {
  test('closes the Battle Menu', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.battleMenu.assertClosed();
  });

  test('removes all unlocked creatres', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, '2');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.assertCreatureListEmpty();
  });
});
