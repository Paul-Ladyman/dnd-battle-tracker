import DmApp from '../page-object-models/dmApp';

describe('Initiative tool', () => {
  it('opens the tool menu when selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolMenuVisible('goblin');
  });

  it('closes the tool menu when unselected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it('is disabled if a creature already has initiative', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.initiativeTool.assertDisabled('goblin');
  });

  it('does not open the tool menu when selected if a creature already has initiative', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it('closes the tool menu when selected if a creature already has initiative', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it("sets a creature's initiative", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Initiative');
    await dmApp.initiativeTool.setCreatureInitiative('goblin 1', '1');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Initiative');
    await dmApp.initiativeTool.setCreatureInitiative('goblin 2', '2');
    await dmApp.startBattle();
    await DmApp.assertCreatureList(['goblin 2Active creature', 'goblin 1']);
  });
});
