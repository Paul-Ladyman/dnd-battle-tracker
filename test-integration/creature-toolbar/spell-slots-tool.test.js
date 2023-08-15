import DmApp from '../page-object-models/dmApp';

beforeAll(() => {
  window.FLAG_spellSlots = true;
});

describe('Spell Slots tool', () => {
  it('opens the tool menu when the Spell Slots toolbar button is selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.creatureToolbar.assertToolMenuVisible('goblin');
  });

  it('closes the tool menu when the Spell Slots toolbar button is unselected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });
});

describe('Used spell slots', () => {
  it('sets the number of used spell slots for all levels to 0 by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.spellSlotsTool.assertUsedSpellSlotValue('goblin', '1st', 0);
    await dmApp.spellSlotsTool.assertUsedSpellSlotValue('goblin', '2nd', 0);
    await dmApp.spellSlotsTool.assertUsedSpellSlotValue('goblin', '3rd', 0);
    await dmApp.spellSlotsTool.assertUsedSpellSlotValue('goblin', '4th', 0);
    await dmApp.spellSlotsTool.assertUsedSpellSlotValue('goblin', '5th', 0);
    await dmApp.spellSlotsTool.assertUsedSpellSlotValue('goblin', '6th', 0);
    await dmApp.spellSlotsTool.assertUsedSpellSlotValue('goblin', '7th', 0);
    await dmApp.spellSlotsTool.assertUsedSpellSlotValue('goblin', '8th', 0);
    await dmApp.spellSlotsTool.assertUsedSpellSlotValue('goblin', '9th', 0);
  });

  it('sets the minimum number of used spell slots for all levels to 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMin('goblin', '1st', '0');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMin('goblin', '2nd', '0');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMin('goblin', '3rd', '0');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMin('goblin', '4th', '0');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMin('goblin', '5th', '0');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMin('goblin', '6th', '0');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMin('goblin', '7th', '0');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMin('goblin', '8th', '0');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMin('goblin', '9th', '0');
  });
});

describe('Total spell slots', () => {
  it('sets the number of total spell slots for all levels to null by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '1st', null);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '2nd', null);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '3rd', null);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '4th', null);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '5th', null);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '6th', null);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '7th', null);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '8th', null);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '9th', null);
  });

  it('sets the minimum number of total spell slots for all levels to 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMin('goblin', '1st', '0');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMin('goblin', '2nd', '0');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMin('goblin', '3rd', '0');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMin('goblin', '4th', '0');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMin('goblin', '5th', '0');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMin('goblin', '6th', '0');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMin('goblin', '7th', '0');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMin('goblin', '8th', '0');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMin('goblin', '9th', '0');
  });

  it('sets the maximum number of total spell slots for all levels', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spell Slots');
    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMax('goblin', '1st', '4');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMax('goblin', '2nd', '3');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMax('goblin', '3rd', '3');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMax('goblin', '4th', '3');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMax('goblin', '5th', '4');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMax('goblin', '6th', '2');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMax('goblin', '7th', '2');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMax('goblin', '8th', '1');
    await dmApp.spellSlotsTool.assertTotalSpellSlotMax('goblin', '9th', '1');
  });
});
