import DmApp from '../page-object-models/dmApp';

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

describe('Max HP', () => {
  it('adds HP to a creature that has none', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.setCreatureMaxHp('goblin', '10');
    await DmApp.assertCreatureVisible('goblin', '10');
  });

  it("updates a creature's max HP", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.setCreatureMaxHp('goblin', '20');
    await DmApp.assertCreatureVisible('goblin', '20');
  });

  it("updates a creature's current HP if the new max HP is less", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.damageCreature('goblin', '5');
    await dmApp.hpTool.setCreatureMaxHp('goblin', '1');
    await DmApp.assertCreatureVisible('goblin', '1');
  });

  it('heals a damaged creature if its max HP is increased by the increased amount', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.damageCreature('goblin', '5');
    await dmApp.hpTool.setCreatureMaxHp('goblin', '20');
    await DmApp.assertCreatureVisible('goblin', '15');
  });
});

describe('Temp HP', () => {
  it('is disabled for a creature with no HP', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.assertTempHpDisabled('goblin');
  });

  it('adds temp HP to a creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.setCreatureTempHp('goblin', '10');
    await DmApp.assertCreatureVisible('goblin', '10 (+10)');
  });

  it("overrides a creature's existing temp HP", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '10');
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.hpTool.setCreatureTempHp('goblin', '10');
    await dmApp.hpTool.setCreatureTempHp('goblin', '20');
    await DmApp.assertCreatureVisible('goblin', '10 (+20)');
  });
});
