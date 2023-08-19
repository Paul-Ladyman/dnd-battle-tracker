import DmApp from './page-object-models/dmApp';

beforeAll(() => {
  window.FLAG_spellSlots = true;
});

describe('Spell Slots', () => {
  it('does not show the spell casting section if the creature has no total or used spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextNotVisible('goblin', 'Spell Casting');
  });

  it('does not show spell slots if the creature has no total or used spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertNoSpellSlots('goblin');
  });

  it('does not show the spell casting section if the creature has total spell slots all with values of 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '1st', '0');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '2nd', '0');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextNotVisible('goblin', 'Spell Casting');
  });

  it('does not shows spell slots if the creature has total spell slots all with values of 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '1st', '0');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '2nd', '0');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertNoSpellSlots('goblin');
  });

  it('shows the spell slots section if the creature has used spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.spellSlotsTool.setUsedSpellSlotValue('goblin', '1st', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Spell Casting');
  });

  it('shows the spell slots section if the creature has total spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '1st', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Spell Casting');
  });

  it('shows a full spell slot meter per level if the creature has used spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.spellSlotsTool.setUsedSpellSlotValue('goblin', '1st', '1');
    await dmApp.spellSlotsTool.setUsedSpellSlotValue('goblin', '2nd', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertSpellSlots('goblin', '1st', '1', '1');
    await dmApp.creature.assertSpellSlots('goblin', '2nd', '1', '1');
  });

  it('shows an empty spell slot meter per level if the creature has total spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '1st', '1');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '2nd', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertSpellSlots('goblin', '1st', '1', '0');
    await dmApp.creature.assertSpellSlots('goblin', '2nd', '1', '0');
  });

  it('shows a spell slot meter per level if the creature has both used and total spell slots per level', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');

    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '1st', '2');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '2nd', '2');

    await dmApp.spellSlotsTool.openUsedSpellSlots('goblin');
    await dmApp.spellSlotsTool.setUsedSpellSlotValue('goblin', '1st', '1');
    await dmApp.spellSlotsTool.setUsedSpellSlotValue('goblin', '2nd', '1');

    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertSpellSlots('goblin', '1st', '2', '1');
    await dmApp.creature.assertSpellSlots('goblin', '2nd', '2', '1');
  });

  it('shows a spell slot meter per level if the creature has some levels with only total spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');

    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '1st', '2');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '2nd', '2');

    await dmApp.spellSlotsTool.openUsedSpellSlots('goblin');
    await dmApp.spellSlotsTool.setUsedSpellSlotValue('goblin', '1st', '1');

    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertSpellSlots('goblin', '1st', '2', '1');
    await dmApp.creature.assertSpellSlots('goblin', '2nd', '2', '0');
  });
});
