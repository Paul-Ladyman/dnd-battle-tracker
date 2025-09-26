import DmApp from '../page-object-models/dmApp';

describe('Status tool', () => {
  it('does not open the tool menu', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Kill');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it('kills a creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Kill');
    await dmApp.statusTool.assertPressed('goblin');
    await DmApp.assertCreatureVisible('goblin', '0', null, 'Unconscious');
  });

  it('stabilises a creature when clicked again', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Kill');
    await dmApp.creatureToolbar.selectTool('goblin', 'Stabilize');
    await dmApp.statusTool.assertNotPressed('goblin');
    await DmApp.assertCreatureVisible('goblin', '0', null, 'Unconscious');
  });
});
