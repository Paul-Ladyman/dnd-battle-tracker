import DmApp from './page-object-models/dmApp';

describe('creature block', () => {
  it("contains a link to creature's stat block when it has been created from the SRD", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addSrdCreature('Goblin');
    return DmApp.assertCreatureStatBlockLink('Goblin');
  });

  it("does not link to creature's stat block when it has been created manually", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    return DmApp.assertNoCreatureStatBlockLink('Goblin');
  });

  it("contains a link to search for a creature's stat block when it has been created manually", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    return DmApp.assertCreatureSearchLink('Goblin');
  });

  it("does not contain a link to search for a creature's stat block when it has been created from the SRD", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addSrdCreature('Goblin');
    return DmApp.assertNoCreatureSearchLink('Goblin');
  });
});
