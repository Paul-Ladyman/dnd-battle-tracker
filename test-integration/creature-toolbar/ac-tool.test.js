import DmApp from '../page-object-models/dmApp';

describe('AC tool', () => {
  it('opens the tool menu when the Creature Menu toolbar button is selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'AC');
    await dmApp.creatureToolbar.assertToolMenuVisible('goblin');
  });

  it('closes the tool menu when the Creature Menu toolbar button is unselected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'AC');
    await dmApp.creatureToolbar.selectTool('goblin', 'AC');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it('adds AC to a creature that has none', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'AC');
    await dmApp.acTool.setCreatureAc('goblin', '10');
    await DmApp.assertCreatureVisible('goblin', null, '10');
  });

  it("updates a creature's AC", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, null, null, null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'AC');
    await dmApp.acTool.setCreatureAc('goblin', '20');
    await DmApp.assertCreatureVisible('goblin', null, '20');
  });
});
