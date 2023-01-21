import DmApp from './page-object-models/dmApp';

describe('Battle Toolbar initiative controls', () => {
  test('the current turn button is disabled if there are no creatures', async () => {
    const _ = new DmApp();
    await DmApp.assertCurrentTurn(false, '...');
  });

  test('the current turn button is disabled if the battle has not started', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin');
    await DmApp.assertCurrentTurn(false, '...');
  });

  test('the current turn button is enabled when the battle starts', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin', '1');
    await dmApp.startBattle();
    await DmApp.assertCurrentTurn(true, 'goblin');
  });
});
