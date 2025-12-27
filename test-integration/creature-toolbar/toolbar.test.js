import '@testing-library/jest-dom';
import DmApp from '../page-object-models/dmApp';

describe('Creature toolbar', () => {
  test('a creature has a toolbar', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertToolbarVisible('goblin');
  });

  it('contains the select tool', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertToolVisible('goblin', 'Select');
  });

  it('contains the creature menu button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertToolVisible('goblin', 'Creature Menu');
  });

  it('contains the kill creature button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertToolVisible('goblin', 'Kill');
  });

  it('contains the initiative button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertToolVisible('goblin', 'Initiative');
  });

  it('contains the conditions button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertToolVisible('goblin', 'Conditions');
  });

  it('contains the notes button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertToolVisible('goblin', 'Notes');
  });

  it('contains the HP button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertToolVisible('goblin', 'HP');
  });
});

describe('Creature toolbar navigation', () => {
  it('does not focus any toolbar button when a creature is added', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertToolNotFocused('goblin', 'Select');
    await dmApp.creatureToolbar.assertToolNotFocused('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.assertToolNotFocused('goblin', 'Kill');
    await dmApp.creatureToolbar.assertToolNotFocused('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolNotFocused('goblin', 'Conditions');
    await dmApp.creatureToolbar.assertToolNotFocused('goblin', 'Notes');
    await dmApp.creatureToolbar.assertToolNotFocused('goblin', 'HP');
  });

  it('makes only the first button tabable when a creature is added', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertToolTabable('goblin', 'Select');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Kill');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Conditions');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Notes');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'HP');
  });

  it('moves the tab index to the selected button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Select');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Kill');
    await dmApp.creatureToolbar.assertToolTabable('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Conditions');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Notes');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'HP');
  });

  it('allows the buttons to be navigated forwards with the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.navigate('goblin', 2);
    await dmApp.creatureToolbar.assertToolFocused('goblin', 'Kill');
  });

  it('moves the tab index to the button being navigated to', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.navigate('goblin', 2);
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolTabable('goblin', 'Kill');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'HP');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Conditions');
    await dmApp.creatureToolbar.assertToolNotTabable('goblin', 'Notes');
  });

  it('wraps navigation when navigating forwards with the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.creatureToolbar.navigate('goblin', 1);
    await dmApp.creatureToolbar.assertToolFocused('goblin', 'Select');
  });

  it('allows the buttons to be navigated backwards with the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.creatureToolbar.navigate('goblin', 2, false);
    await dmApp.creatureToolbar.assertToolFocused('goblin', 'HP');
  });

  it('wraps navigation when navigating backwards with the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Select');
    await dmApp.creatureToolbar.navigate('goblin', 1, false);
    await dmApp.creatureToolbar.assertToolFocused('goblin', 'Spellcasting');
  });

  it('navigates to the first button when the home key is pressed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.navigateHome('goblin');
    await dmApp.creatureToolbar.assertToolFocused('goblin', 'Select');
  });

  it('navigates to the last button when the end key is pressed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.navigateEnd('goblin');
    await dmApp.creatureToolbar.assertToolFocused('goblin', 'Spellcasting');
  });

  it("navigates two creature's toolbars independently", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Creature Menu');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Creature Menu');
    await dmApp.creatureToolbar.navigate('goblin 1', 1);
    await dmApp.creatureToolbar.assertToolNotFocused('goblin 2', 'Initiative');
    await dmApp.creatureToolbar.assertToolFocused('goblin 1', 'Initiative');
  });

  it('does not open the tool menu when navigating', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.navigate('goblin', 1);
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it('does not open the tool menu when no tool is selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it('closes the tool menu when the toolbar loses focus', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it('closes the tool menu via the keyboard shortcut', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.closeToolbarByKeyboard('goblin');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it('returns focus to the toolbar if the tool menu is closed via the keyboard shortcut', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.menuTool.lockCreature('goblin');
    await dmApp.creatureToolbar.closeToolbarByKeyboard('goblin');
    await dmApp.creatureToolbar.assertToolFocused('goblin', 'Creature Menu');
  });

  it('maintains the latest button focus if the tool menu is closed via the keyboard shortcut', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.menuTool.lockCreature('goblin');
    await dmApp.creatureToolbar.closeToolbarByKeyboard('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.creatureToolbar.closeToolbarByKeyboard('goblin');
    await dmApp.creatureToolbar.assertToolFocused('goblin', 'HP');
  });

  it('allows the notes dropdown to be closed without closing the tool menu', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await dmApp.creatureToolbar.openNotes('goblin');
    await dmApp.creatureToolbar.closeNotesByKeyboard('goblin');
    await dmApp.creatureToolbar.assertToolMenuVisible('goblin');
  });
});
