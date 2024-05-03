import DmApp from '../page-object-models/dmApp';

describe('Spellcasting', () => {
  it('does not show the spellcasting section if the creature has no spells or slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextNotVisible('goblin', 'Spellcasting');
  });

  it('does not show spell meters if the creature has no spells or slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertNoSpellMeters('goblin');
  });
});

describe('Spellcasting - spell slots', () => {
  it('does not show the spellcasting section if the creature has total spell slots all with values of 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '1st', '0');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '2nd', '0');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextNotVisible('goblin', 'Spellcasting');
  });

  it('does not show spell meters if the creature has total spell slots all with values of 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '1st', '0');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '2nd', '0');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertNoSpellMeters('goblin');
  });

  it('shows the spellcasting section if the creature has used spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.setUsedSpellSlotValue('goblin', '1st', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Spellcasting');
  });

  it('shows the spellcasting section if the creature has total spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '1st', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Spellcasting');
  });

  it('shows a full spell meter per level if the creature has used spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.setUsedSpellSlotValue('goblin', '1st', '1');
    await dmApp.spellcastingTool.setUsedSpellSlotValue('goblin', '2nd', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertSpellMeters('goblin', '1st Level', '1', '1');
    await dmApp.creature.assertSpellMeters('goblin', '2nd Level', '1', '1');
  });

  it('shows an empty spell meter per level if the creature has total spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '1st', '1');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '2nd', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertSpellMeters('goblin', '1st Level', '1', '0');
    await dmApp.creature.assertSpellMeters('goblin', '2nd Level', '1', '0');
  });

  it('shows a spell meter per level if the creature has both used and total spell slots per level', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '1st', '2');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '2nd', '2');

    await dmApp.spellcastingTool.openUsedSpellSlots('goblin');
    await dmApp.spellcastingTool.setUsedSpellSlotValue('goblin', '1st', '1');
    await dmApp.spellcastingTool.setUsedSpellSlotValue('goblin', '2nd', '1');

    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertSpellMeters('goblin', '1st Level', '2', '1');
    await dmApp.creature.assertSpellMeters('goblin', '2nd Level', '2', '1');
  });

  it('shows a spell meter per level if the creature has some levels with only total spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '1st', '2');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '2nd', '2');

    await dmApp.spellcastingTool.openUsedSpellSlots('goblin');
    await dmApp.spellcastingTool.setUsedSpellSlotValue('goblin', '1st', '1');

    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertSpellMeters('goblin', '1st Level', '2', '1');
    await dmApp.creature.assertSpellMeters('goblin', '2nd Level', '2', '0');
  });
});

describe('Spellcasting - spells', () => {
  it('does not show the spellcasting section if the creature has total spells all with values of 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'cure wounds', '0');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'cure wounds', '0');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextNotVisible('goblin', 'Spellcasting');
  });

  it('does not show spell meters if the creature has total spells all with values of 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'cure wounds', '0');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'cure wounds', '0');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertNoSpellMeters('goblin');
  });

  it('shows the spellcasting section if the creature has used spells', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.addUsedSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.setUsedSpellValue('goblin', 'cure wounds', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Spellcasting');
  });

  it('shows the spellcasting section if the creature has total spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'cure wounds', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Spellcasting');
  });

  it('shows a full spell meter for each spell if the creature has used spells', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.addUsedSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.addUsedSpell('goblin', 'inflict wounds');
    await dmApp.spellcastingTool.setUsedSpellValue('goblin', 'cure wounds', '1');
    await dmApp.spellcastingTool.setUsedSpellValue('goblin', 'inflict wounds', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertSpellMeters('goblin', 'cure wounds', '1', '1');
    await dmApp.creature.assertSpellMeters('goblin', 'inflict wounds', '1', '1');
  });

  it('shows an empty spell meter for each spell if the creature has total spells', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'inflict wounds');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'cure wounds', '1');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'inflict wounds', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertSpellMeters('goblin', 'cure wounds', '1', '0');
    await dmApp.creature.assertSpellMeters('goblin', 'inflict wounds', '1', '0');
  });

  it('shows a spell meter for each spell if the creature has both used and total spells', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'inflict wounds');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'cure wounds', '2');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'inflict wounds', '2');

    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.addUsedSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.addUsedSpell('goblin', 'inflict wounds');
    await dmApp.spellcastingTool.setUsedSpellValue('goblin', 'cure wounds', '1');
    await dmApp.spellcastingTool.setUsedSpellValue('goblin', 'inflict wounds', '1');

    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertSpellMeters('goblin', 'cure wounds', '2', '1');
    await dmApp.creature.assertSpellMeters('goblin', 'inflict wounds', '2', '1');
  });

  it('shows a spell meter for each spell if the creature has some spells with only a total', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'inflict wounds');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'cure wounds', '2');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'inflict wounds', '2');

    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.addUsedSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.setUsedSpellValue('goblin', 'cure wounds', '1');

    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertSpellMeters('goblin', 'cure wounds', '2', '1');
    await dmApp.creature.assertSpellMeters('goblin', 'inflict wounds', '2', '0');
  });
});
