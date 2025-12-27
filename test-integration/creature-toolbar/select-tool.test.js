import DmApp from '../page-object-models/dmApp';

describe('Select tool', () => {
  it('does not open the tool menu', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Select');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it('selects a creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Select');
    await dmApp.selectTool.assertPressed('goblin');
  });

  it('unselects a creature when clicked again', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Select');
    await dmApp.creatureToolbar.selectTool('goblin', 'Unselect');
    await dmApp.selectTool.assertNotPressed('goblin');
  });

  it('displays a selected creature in detail', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await DmApp.assertCreatureList(['goblin 1']);
  });

  it('displays a unselected creature without detail', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.assertUnselectedCreatureList(['goblin 2']);
  });

  it('allows an unselected creature to be added to the selection', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creature.select('goblin 2');
    await DmApp.assertCreatureList(['goblin 1', 'goblin 2']);
  });

  it('is focused when the first creature is selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creatureToolbar.assertToolFocused('goblin 1', 'Unselect');
  });

  it('is focused when a creature goes from unselected to selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creature.select('goblin 2');
    await dmApp.creatureToolbar.assertToolFocused('goblin 2', 'Unselect');
  });

  it('focuses the creature when it goes from selected to unselected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creature.select('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Unselect');
    await dmApp.creature.assertUnselectedFocused('goblin 2');
  });

  it('is focused when the last creature is unselected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creature.select('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Unselect');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Unselect');
    await dmApp.creatureToolbar.assertToolFocused('goblin 1', 'Select');
  });
});
