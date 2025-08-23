import '@testing-library/jest-dom';
import DmApp from '../page-object-models/dmApp';

describe('Reset battle', () => {
  it('does nothing when clicked if not confirmed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, '2');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await DmApp.assertCreatureList(['goblin #1', 'goblin #2']);
    return dmApp.battleMenu.assertOpen();
  });

  it('asks the user to confirm resetting the battle', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, '2');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    return dmApp.alert.assertMessage('Are you sure you want to reset the battle?');
  });

  it('asks the user to confirm resetting the battle by keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, '2');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItemByKeyboard('Reset battle');
    return dmApp.alert.assertMessage('Are you sure you want to reset the battle?');
  });

  it('does nothing if cancelled', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, '2');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickNo();
    await DmApp.assertCreatureList(['goblin #1', 'goblin #2']);
    return dmApp.battleMenu.assertOpen();
  });

  it('returns focus to reset battle if cancelled', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, '2');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickNo();
    await dmApp.alert.assertNotVisible();
    return dmApp.battleMenu.assertMenuItemFocused('Reset battle');
  });

  it('returns focus to reset battle when activated by keyboard if cancelled', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, '2');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItemByKeyboard('Reset battle');
    await dmApp.alert.clickNo();
    await dmApp.alert.assertNotVisible();
    return dmApp.battleMenu.assertMenuItemFocused('Reset battle');
  });

  it('closes the Battle Menu when confirmed', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickYes();
    await dmApp.battleMenu.assertClosed();
  });

  it('removes all unlocked creatres when confirmed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, '2');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickYes();
    await dmApp.assertCreatureListEmpty();
  });

  it('closes the confirmation dialogue when confirmed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, '2');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickYes();
    await dmApp.alert.assertNotVisible();
  });
});
