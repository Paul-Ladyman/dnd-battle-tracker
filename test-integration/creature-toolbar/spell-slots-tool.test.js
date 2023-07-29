import DmApp from '../page-object-models/dmApp';

beforeAll(() => {
  window.FLAG_spellSlots = true;
});

describe('Spell Slots tool', () => {
  it('opens the tool menu when the Spell Slots toolbar button is selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.creatureToolbar.assertToolMenuVisible('goblin');
  });

  it('closes the tool menu when the Spell Slots toolbar button is unselected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });
});
