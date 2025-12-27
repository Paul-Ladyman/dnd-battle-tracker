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

  it('kills all selected creatures', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creature.select('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Kill');
    await DmApp.assertCreatureVisible('goblin 1', '0', null, 'Unconscious');
    await DmApp.assertCreatureVisible('goblin 2', '0', null, 'Unconscious');
  });

  it('stabilises a creature when clicked again', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Kill');
    await dmApp.creatureToolbar.selectTool('goblin', 'Stabilize');
    await dmApp.statusTool.assertNotPressed('goblin');
    await DmApp.assertCreatureVisible('goblin', '0', null, 'Unconscious');
  });

  it('stabilises all selected creatures', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creature.select('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Kill');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Stabilize');
    await dmApp.statusTool.assertNotPressed('goblin 1');
    await dmApp.statusTool.assertNotPressed('goblin 2');
    await DmApp.assertCreatureVisible('goblin 1', '0', null, 'Unconscious');
    await DmApp.assertCreatureVisible('goblin 2', '0', null, 'Unconscious');
  });
});
