import DmApp from './page-object-models/dmApp';

describe('Start battle', () => {
  test('the start battle button is disabled if there are no creatures', async () => {
    const dmApp = new DmApp();
    await dmApp.battleToolbar.assertStartBattleDisabled();
  });

  test("it's not possible to start a battle if a creature has no initiative", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.battleToolbar.startBattle();
    await DmApp.assertError('Cannot continue battle; goblin has no initiative.');
  });

  test('focuses a creature without initiative at the start of the list on attempting to start the battle', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creature.assertFocused('goblin');
  });

  test('focuses a creature without initiative at the end of the list on attempting to start the battle', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creature.assertFocused('goblin 2');
  });

  test('the first creature without initiative is focused on attempting to start the battle', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.createCreatureForm.addCreature('goblin 3');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creature.assertFocused('goblin 2');
  });

  test('makes the first creature in the initiative order active', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreature('goblin 2', '2');
    await dmApp.createCreatureForm.addCreature('goblin 3', '3');
    await dmApp.battleToolbar.startBattle();
    await dmApp.assertCreatureActive('goblin 3');
    await dmApp.assertCreatureInactive('goblin 2');
    await dmApp.assertCreatureInactive('goblin 1');
  });

  test('displays the creature has no initiative error when not on the initiative view', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.navigation.navigateTo('DM Tips');
    await dmApp.battleToolbar.startBattle();
    await DmApp.assertError('Cannot continue battle; goblin has no initiative.');
  });

  test('starts the battle when not on the initiative view', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.navigation.navigateTo('DM Tips');
    await dmApp.battleToolbar.startBattle();
  });
});

describe('Next turn', () => {
  test('makes the next creature in the initiative order active ', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreature('goblin 2', '2');
    await dmApp.createCreatureForm.addCreature('goblin 3', '3');
    await dmApp.battleToolbar.startBattle();
    await dmApp.battleToolbar.nextTurn();
    await dmApp.assertCreatureInactive('goblin 3');
    await dmApp.assertCreatureActive('goblin 2');
    await dmApp.assertCreatureInactive('goblin 1');
  });

  test('makes the last creature in the initiative order active ', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreature('goblin 2', '2');
    await dmApp.createCreatureForm.addCreature('goblin 3', '3');
    await dmApp.battleToolbar.startBattle();
    await dmApp.battleToolbar.advanceTurns(2);
    await dmApp.assertCreatureInactive('goblin 3');
    await dmApp.assertCreatureInactive('goblin 2');
    await dmApp.assertCreatureActive('goblin 1');
  });

  test('makes the first creature in the initiative order active again at the start of a new round ', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreature('goblin 2', '2');
    await dmApp.createCreatureForm.addCreature('goblin 3', '3');
    await dmApp.battleToolbar.startBattle();
    await dmApp.battleToolbar.advanceTurns(3);
    await dmApp.assertCreatureActive('goblin 3');
    await dmApp.assertCreatureInactive('goblin 2');
    await dmApp.assertCreatureInactive('goblin 1');
  });
});
