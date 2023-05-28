import DmApp from '../page-object-models/dmApp';

beforeAll(() => {
  window.FLAG_creatureToolbar = true;
});

describe('HP tool', () => {
  it('opens the tool menu when the Creature Menu toolbar button is selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.creatureToolbar.assertToolMenuVisible('goblin');
  });

  it('closes the tool menu when the Creature Menu toolbar button is unselected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });
});

describe('Heal/damage tool', () => {
  it('is disabled if a creature has no HP', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.assertDamageDisabled('goblin');
    await dmApp.hpTool.assertHealDisabled('goblin');
  });

  it('disables the heal button if the creature is at max HP', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.assertHealDisabled('goblin');
  });

  it('damages a creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.damageCreature('goblin', '5');
    await DmApp.assertCreatureVisible('goblin', '5');
  });

  it('makes a creature unconscious when it drops to 0 HP', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.damageCreature('goblin', '10');
    await DmApp.assertCreatureVisible('goblin', '0', null, 'Unconscious');
  });

  it('does not go below 0 HP whe a creature is damage', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.damageCreature('goblin', '15');
    await DmApp.assertCreatureVisible('goblin', '0');
  });

  it('disables the damage button if the creature is at 0 HP', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.damageCreature('goblin', '10');
    await dmApp.hpTool.assertDamageDisabled('goblin');
  });

  it('heals a creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.damageCreature('goblin', '5');
    await dmApp.hpTool.healCreature('goblin', '1');
    await DmApp.assertCreatureVisible('goblin', '6');
  });

  it("does not heal beyond a creature's maximum HP", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.damageCreature('goblin', '5');
    await dmApp.hpTool.healCreature('goblin', '10');
    await DmApp.assertCreatureVisible('goblin', '10');
  });
});
