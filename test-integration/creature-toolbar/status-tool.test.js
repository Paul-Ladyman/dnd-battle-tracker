import DmApp from '../page-object-models/dmApp';

beforeAll(() => {
  window.FLAG_creatureToolbar = true;
});

describe('Status tool', () => {
  it('does not open the tool menu', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Kill/Make unconscious');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it('kills a creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Kill/Make unconscious');
    await dmApp.statusTool.assertPressed('goblin');
    await DmApp.assertCreatureVisible('goblin', '0', null, 'Unconscious');
  });

  it('stabalises a creature when clicked again', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Kill/Make unconscious');
    await dmApp.creatureToolbar.selectTool('goblin', 'Stabalize');
    await dmApp.statusTool.assertNotPressed('goblin');
    await DmApp.assertCreatureVisible('goblin', '0', null, 'Unconscious');
  });
});
