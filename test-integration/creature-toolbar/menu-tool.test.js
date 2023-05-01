import DmApp from '../page-object-models/dmApp';

beforeAll(() => {
  window.FLAG_creatureToolbar = true;
});

describe('Creature menu tool', () => {
  it('opens the tool menu when the Creature Menu toolbar button is selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.assertToolMenuVisible('goblin');
  });

  it('closes the tool menu when the Creature Menu toolbar button is unselected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it("contains a link to creature's stat block when it has been created from the SRD", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addSrdCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.creatureToolbar.assertCreatureStatBlockLink('Goblin');
  });

  it("does not link to creature's stat block when it has been created manually", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.creatureToolbar.assertNoCreatureStatBlockLink('Goblin');
  });

  it("contains a link to search for a creature's stat block when it has been created manually", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.creatureToolbar.assertCreatureSearchLink('Goblin');
  });

  it("does not contain a link to search for a creature's stat block when it has been created from the SRD", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addSrdCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.creatureToolbar.assertNoCreatureSearchLink('Goblin');
  });
});
