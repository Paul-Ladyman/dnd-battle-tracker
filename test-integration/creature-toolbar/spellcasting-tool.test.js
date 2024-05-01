import DmApp from '../page-object-models/dmApp';
import maxSpellSlots from '../../src/domain/spellSlots';

describe('Spellcasting tool', () => {
  it('opens the tool menu when the Spell Slots toolbar button is selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.creatureToolbar.assertToolMenuVisible('goblin');
  });

  it('closes the tool menu when the Spell Slots toolbar button is unselected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });
});

describe('Used spell slots', () => {
  it('sets the number of used spell slots for all levels to 0 by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
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
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
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

  it('sets the default maximum number of used spell slots for all levels', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '1st', '4');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '2nd', '3');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '3rd', '3');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '4th', '3');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '5th', '4');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '6th', '2');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '7th', '2');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '8th', '1');
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '9th', '1');
  });

  it.each([
    ['1st'],
    ['2nd'],
    ['3rd'],
    ['4th'],
    ['5th'],
    ['6th'],
    ['7th'],
    ['8th'],
    ['9th'],
  ])('sets the maximum number of used spell slots for level %p when the total spell slots for the same level is modified', async (level) => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', level, '0');

    await dmApp.spellSlotsTool.openUsedSpellSlots('goblin');
    const expectedValue = (expectedLevel) => (expectedLevel === level ? '0' : maxSpellSlots[expectedLevel].toString());
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '1st', expectedValue('1st'));
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '2nd', expectedValue('2nd'));
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '3rd', expectedValue('3rd'));
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '4th', expectedValue('4th'));
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '5th', expectedValue('5th'));
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '6th', expectedValue('6th'));
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '7th', expectedValue('7th'));
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '8th', expectedValue('8th'));
    await dmApp.spellSlotsTool.assertUsedSpellSlotMax('goblin', '9th', expectedValue('9th'));
  });

  it.each([
    ['1st'],
    ['2nd'],
    ['3rd'],
    ['4th'],
    ['5th'],
    ['6th'],
    ['7th'],
    ['8th'],
    ['9th'],
  ])('sets the number of used spell slots for level %p when the total spell slots for the same level is set lower than the current used value', async (level) => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellSlotsTool.setUsedSpellSlotValue('goblin', level, '1');

    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', level, '0');

    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellSlotsTool.assertUsedSpellSlotValue('goblin', level, 0);
  });

  it.each([
    ['1st'],
    ['2nd'],
    ['3rd'],
    ['4th'],
    ['5th'],
    ['6th'],
    ['7th'],
    ['8th'],
    ['9th'],
  ])('disables used spell slots for level %p when the total spell slots for the same level is set to 0', async (level) => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', level, '0');

    await dmApp.spellSlotsTool.openUsedSpellSlots('goblin');
    await dmApp.spellSlotsTool.assertUsedSpellSlotDisabled('goblin', level);
  });
});

describe('Total spell slots', () => {
  it('does not set the number of total spell slots for all levels by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
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
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
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
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
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

  it('allows the number of total spell slots for all levels to be set and persisted', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');

    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '1st', '1');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '2nd', '1');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '3rd', '1');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '4th', '1');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '5th', '1');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '6th', '1');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '7th', '1');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '8th', '1');
    await dmApp.spellSlotsTool.setTotalSpellSlotValue('goblin', '9th', '1');

    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openTotalSpellSlots('goblin');

    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '1st', 1);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '2nd', 1);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '3rd', 1);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '4th', 1);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '5th', 1);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '6th', 1);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '7th', 1);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '8th', 1);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('goblin', '9th', 1);
  });

  it('prefills total spell slots when an SRD monster is created with spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addSrdCreature('Mage');
    await dmApp.creatureToolbar.selectTool('Mage', 'Spellcasting');
    await dmApp.spellSlotsTool.openTotalSpellSlots('Mage');
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('Mage', '1st', 4);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('Mage', '2nd', 3);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('Mage', '3rd', 3);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('Mage', '4th', 3);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('Mage', '5th', 1);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('Mage', '6th', 0);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('Mage', '7th', 0);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('Mage', '8th', 0);
    await dmApp.spellSlotsTool.assertTotalSpellSlotValue('Mage', '9th', 0);
  });
});

describe('Used spells', () => {
  it('sets the list of used spells to empty by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openUsedSpells('goblin');
    await dmApp.spellSlotsTool.assertUsedSpellsEmpty('goblin');
  });

  it('allows a spell to be added to the list', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openUsedSpells('goblin');
    await dmApp.spellSlotsTool.addUsedSpell('goblin', 'cure wounds');
    await dmApp.spellSlotsTool.assertUsedSpellsContains('goblin', 'cure wounds');
  });

  it('sets the number of uses of a spells to 0 by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openUsedSpells('goblin');
    await dmApp.spellSlotsTool.addUsedSpell('goblin', 'cure wounds');
    await dmApp.spellSlotsTool.assertUsedSpellValue('goblin', 'cure wounds', 0);
  });

  it('sets the minimum number of uses of a spell to 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openUsedSpells('goblin');
    await dmApp.spellSlotsTool.addUsedSpell('goblin', 'cure wounds');
    await dmApp.spellSlotsTool.assertUsedSpellMin('goblin', 'cure wounds', '0');
  });

  it('sets the default maximum number of uses of a spell', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openUsedSpells('goblin');
    await dmApp.spellSlotsTool.addUsedSpell('goblin', 'cure wounds');
    await dmApp.spellSlotsTool.assertUsedSpellMax('goblin', 'cure wounds', '5');
  });

  it('sets the maximum number of uses of a spell when the total for the same spell is modified', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellSlotsTool.openTotalSpells('goblin');
    await dmApp.spellSlotsTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellSlotsTool.addTotalSpell('goblin', 'inflict wounds');
    await dmApp.spellSlotsTool.setTotalSpellValue('goblin', 'cure wounds', '0');

    await dmApp.spellSlotsTool.openUsedSpells('goblin');
    await dmApp.spellSlotsTool.assertUsedSpellMax('goblin', 'cure wounds', '0');
    await dmApp.spellSlotsTool.assertUsedSpellMax('goblin', 'inflict wounds', '5');
  });

  it('sets the number of uses of a spell when the total for the same level is set lower than the current used value', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openUsedSpells('goblin');
    await dmApp.spellSlotsTool.addUsedSpell('goblin', 'cure wounds');

    await dmApp.spellSlotsTool.setUsedSpellValue('goblin', 'cure wounds', '1');

    await dmApp.spellSlotsTool.openTotalSpells('goblin');
    await dmApp.spellSlotsTool.setTotalSpellValue('goblin', 'cure wounds', '0');

    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openUsedSpells('goblin');

    await dmApp.spellSlotsTool.assertUsedSpellValue('goblin', 'cure wounds', 0);
  });

  it('disables used spells when the total the same spell is set to 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellSlotsTool.openTotalSpells('goblin');
    await dmApp.spellSlotsTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellSlotsTool.setTotalSpellValue('goblin', 'cure wounds', '0');

    await dmApp.spellSlotsTool.openUsedSpells('goblin');
    await dmApp.spellSlotsTool.assertUsedSpellDisabled('goblin', 'cure wounds');
  });
});

describe('Total spells', () => {
  it('sets the list of total spells to empty by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openTotalSpells('goblin');
    await dmApp.spellSlotsTool.assertTotalSpellsEmpty('goblin');
  });

  it('allows a spell to be added to the list', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openTotalSpells('goblin');
    await dmApp.spellSlotsTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellSlotsTool.assertTotalSpellsContains('goblin', 'cure wounds');
  });

  it('does not set the number of total uses of a spell by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openTotalSpells('goblin');
    await dmApp.spellSlotsTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellSlotsTool.assertTotalSpellValue('goblin', 'cure wounds', null);
  });

  it('sets the minimum number of total uses of a spell to 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openTotalSpells('goblin');
    await dmApp.spellSlotsTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellSlotsTool.assertTotalSpellMin('goblin', 'cure wounds', '0');
  });

  it('sets the maximum number of total spell slots for all levels', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openTotalSpells('goblin');
    await dmApp.spellSlotsTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellSlotsTool.assertTotalSpellMax('goblin', 'cure wounds', '5');
  });

  it('allows the number of total uses of a spell to be set and persisted', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openTotalSpells('goblin');
    await dmApp.spellSlotsTool.addTotalSpell('goblin', 'cure wounds');

    await dmApp.spellSlotsTool.setTotalSpellValue('goblin', 'cure wounds', '1');

    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellSlotsTool.openTotalSpells('goblin');

    await dmApp.spellSlotsTool.assertTotalSpellValue('goblin', 'cure wounds', 1);
  });
});
