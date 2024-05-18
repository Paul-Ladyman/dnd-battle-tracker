import { http, HttpResponse } from 'msw';
import msw from '../mocks/server';
import DmApp from '../page-object-models/dmApp';
import { maxSpellSlots } from '../../src/domain/spellcasting';

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
    await dmApp.spellcastingTool.assertUsedSpellSlotValue('goblin', '1st', 0);
    await dmApp.spellcastingTool.assertUsedSpellSlotValue('goblin', '2nd', 0);
    await dmApp.spellcastingTool.assertUsedSpellSlotValue('goblin', '3rd', 0);
    await dmApp.spellcastingTool.assertUsedSpellSlotValue('goblin', '4th', 0);
    await dmApp.spellcastingTool.assertUsedSpellSlotValue('goblin', '5th', 0);
    await dmApp.spellcastingTool.assertUsedSpellSlotValue('goblin', '6th', 0);
    await dmApp.spellcastingTool.assertUsedSpellSlotValue('goblin', '7th', 0);
    await dmApp.spellcastingTool.assertUsedSpellSlotValue('goblin', '8th', 0);
    await dmApp.spellcastingTool.assertUsedSpellSlotValue('goblin', '9th', 0);
  });

  it('sets the minimum number of used spell slots for all levels to 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.assertUsedSpellSlotMin('goblin', '1st', '0');
    await dmApp.spellcastingTool.assertUsedSpellSlotMin('goblin', '2nd', '0');
    await dmApp.spellcastingTool.assertUsedSpellSlotMin('goblin', '3rd', '0');
    await dmApp.spellcastingTool.assertUsedSpellSlotMin('goblin', '4th', '0');
    await dmApp.spellcastingTool.assertUsedSpellSlotMin('goblin', '5th', '0');
    await dmApp.spellcastingTool.assertUsedSpellSlotMin('goblin', '6th', '0');
    await dmApp.spellcastingTool.assertUsedSpellSlotMin('goblin', '7th', '0');
    await dmApp.spellcastingTool.assertUsedSpellSlotMin('goblin', '8th', '0');
    await dmApp.spellcastingTool.assertUsedSpellSlotMin('goblin', '9th', '0');
  });

  it('sets the default maximum number of used spell slots for all levels', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '1st', '4');
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '2nd', '3');
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '3rd', '3');
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '4th', '3');
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '5th', '4');
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '6th', '2');
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '7th', '2');
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '8th', '1');
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '9th', '1');
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

    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', level, '0');

    await dmApp.spellcastingTool.openUsedSpellSlots('goblin');
    const expectedValue = (expectedLevel) => (expectedLevel === level ? '0' : maxSpellSlots[expectedLevel].toString());
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '1st', expectedValue('1st'));
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '2nd', expectedValue('2nd'));
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '3rd', expectedValue('3rd'));
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '4th', expectedValue('4th'));
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '5th', expectedValue('5th'));
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '6th', expectedValue('6th'));
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '7th', expectedValue('7th'));
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '8th', expectedValue('8th'));
    await dmApp.spellcastingTool.assertUsedSpellSlotMax('goblin', '9th', expectedValue('9th'));
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

    await dmApp.spellcastingTool.setUsedSpellSlotValue('goblin', level, '1');

    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', level, '0');

    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellcastingTool.assertUsedSpellSlotValue('goblin', level, 0);
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

    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', level, '0');

    await dmApp.spellcastingTool.openUsedSpellSlots('goblin');
    await dmApp.spellcastingTool.assertUsedSpellSlotDisabled('goblin', level);
  });
});

describe('Total spell slots', () => {
  it('does not set the number of total spell slots for all levels by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '1st', null);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '2nd', null);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '3rd', null);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '4th', null);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '5th', null);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '6th', null);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '7th', null);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '8th', null);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '9th', null);
  });

  it('sets the minimum number of total spell slots for all levels to 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');
    await dmApp.spellcastingTool.assertTotalSpellSlotMin('goblin', '1st', '0');
    await dmApp.spellcastingTool.assertTotalSpellSlotMin('goblin', '2nd', '0');
    await dmApp.spellcastingTool.assertTotalSpellSlotMin('goblin', '3rd', '0');
    await dmApp.spellcastingTool.assertTotalSpellSlotMin('goblin', '4th', '0');
    await dmApp.spellcastingTool.assertTotalSpellSlotMin('goblin', '5th', '0');
    await dmApp.spellcastingTool.assertTotalSpellSlotMin('goblin', '6th', '0');
    await dmApp.spellcastingTool.assertTotalSpellSlotMin('goblin', '7th', '0');
    await dmApp.spellcastingTool.assertTotalSpellSlotMin('goblin', '8th', '0');
    await dmApp.spellcastingTool.assertTotalSpellSlotMin('goblin', '9th', '0');
  });

  it('sets the maximum number of total spell slots for all levels', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');
    await dmApp.spellcastingTool.assertTotalSpellSlotMax('goblin', '1st', '4');
    await dmApp.spellcastingTool.assertTotalSpellSlotMax('goblin', '2nd', '3');
    await dmApp.spellcastingTool.assertTotalSpellSlotMax('goblin', '3rd', '3');
    await dmApp.spellcastingTool.assertTotalSpellSlotMax('goblin', '4th', '3');
    await dmApp.spellcastingTool.assertTotalSpellSlotMax('goblin', '5th', '4');
    await dmApp.spellcastingTool.assertTotalSpellSlotMax('goblin', '6th', '2');
    await dmApp.spellcastingTool.assertTotalSpellSlotMax('goblin', '7th', '2');
    await dmApp.spellcastingTool.assertTotalSpellSlotMax('goblin', '8th', '1');
    await dmApp.spellcastingTool.assertTotalSpellSlotMax('goblin', '9th', '1');
  });

  it('allows the number of total spell slots for all levels to be set and persisted', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');

    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '1st', '1');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '2nd', '1');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '3rd', '1');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '4th', '1');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '5th', '1');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '6th', '1');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '7th', '1');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '8th', '1');
    await dmApp.spellcastingTool.setTotalSpellSlotValue('goblin', '9th', '1');

    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpellSlots('goblin');

    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '1st', 1);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '2nd', 1);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '3rd', 1);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '4th', 1);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '5th', 1);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '6th', 1);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '7th', 1);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '8th', 1);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('goblin', '9th', 1);
  });

  it('prefills total spell slots when an SRD monster is created with spell slots', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addSrdCreature('Mage');
    await dmApp.creatureToolbar.selectTool('Mage', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpellSlots('Mage');
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('Mage', '1st', 4);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('Mage', '2nd', 3);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('Mage', '3rd', 3);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('Mage', '4th', 3);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('Mage', '5th', 1);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('Mage', '6th', 0);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('Mage', '7th', 0);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('Mage', '8th', 0);
    await dmApp.spellcastingTool.assertTotalSpellSlotValue('Mage', '9th', 0);
  });
});

describe('Used spells', () => {
  it('sets the list of used spells to empty by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.assertUsedSpellsEmpty('goblin');
  });

  it('allows a spell to be added to the list', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.addUsedSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.assertUsedSpellsContains('goblin', 'cure wounds');
  });

  it('sets the number of uses of a spells to 0 by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.addUsedSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.assertUsedSpellValue('goblin', 'cure wounds', 0);
  });

  it('sets the minimum number of uses of a spell to 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.addUsedSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.assertUsedSpellMin('goblin', 'cure wounds', '0');
  });

  it('sets the default maximum number of uses of a spell', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.addUsedSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.assertUsedSpellMax('goblin', 'cure wounds', '4');
  });

  it('sets the maximum number of uses of a spell when the total for the same spell is modified', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'inflict wounds');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'cure wounds', '0');

    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.assertUsedSpellMax('goblin', 'cure wounds', '0');
    await dmApp.spellcastingTool.assertUsedSpellMax('goblin', 'inflict wounds', '4');
  });

  it('sets the number of uses of a spell when the total for the same level is set lower than the current used value', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.addUsedSpell('goblin', 'cure wounds');

    await dmApp.spellcastingTool.setUsedSpellValue('goblin', 'cure wounds', '1');

    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'cure wounds', '0');

    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');

    await dmApp.spellcastingTool.assertUsedSpellValue('goblin', 'cure wounds', 0);
  });

  it('disables used spells when the total the same spell is set to 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');

    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'cure wounds', '0');

    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.assertUsedSpellDisabled('goblin', 'cure wounds');
  });
});

describe('Total spells', () => {
  it('sets the list of total spells to empty by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.assertTotalSpellsEmpty('goblin');
  });

  it('allows a spell to be added to the list', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.assertTotalSpellsContains('goblin', 'cure wounds');
  });

  it('does not set the number of total uses of a spell by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.assertTotalSpellValue('goblin', 'cure wounds', null);
  });

  it('sets the minimum number of total uses of a spell to 0', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.assertTotalSpellMin('goblin', 'cure wounds', '0');
  });

  it('sets the maximum number of total spell slots for all levels', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');
    await dmApp.spellcastingTool.assertTotalSpellMax('goblin', 'cure wounds', '4');
  });

  it('allows the number of total uses of a spell to be set and persisted', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpells('goblin');
    await dmApp.spellcastingTool.addTotalSpell('goblin', 'cure wounds');

    await dmApp.spellcastingTool.setTotalSpellValue('goblin', 'cure wounds', '1');

    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpells('goblin');

    await dmApp.spellcastingTool.assertTotalSpellValue('goblin', 'cure wounds', 1);
  });

  it('prefills total spells when an SRD monster is created with spells', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addSrdCreature('Couatl');
    await dmApp.creatureToolbar.selectTool('Couatl', 'Spellcasting');
    await dmApp.spellcastingTool.openTotalSpells('Couatl');
    await dmApp.spellcastingTool.assertTotalSpells('Couatl', 2);
    await dmApp.spellcastingTool.assertTotalSpellValue('Couatl', 'Bless', 3);
    await dmApp.spellcastingTool.assertTotalSpellValue('Couatl', 'Dream', 1);
  });
});

describe('SRD spell search', () => {
  it('adds an SRD spell to the list', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.addUsedSrdSpell('goblin', 'Acid Arrow');
  });

  it('filters the SRD spell list by the search term', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.searchUsedSrdSpell('goblin', 'Acid');
    await dmApp.spellcastingTool.assertUsedSrdSpell('goblin', 'Acid Arrow');
    await dmApp.spellcastingTool.assertUsedSrdSpell('goblin', 'Acid Splash');
    await dmApp.spellcastingTool.assertNotUsedSrdSpell('goblin', 'Aid');
  });

  it('displays no spells if they do not include a name', async () => {
    msw.use(
      http.get('https://www.dnd5eapi.co/api/spells', () => HttpResponse.json({
        results: [{}],
      })),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.searchUsedSrdSpell('goblin', 'Acid Arrow');
    await dmApp.spellcastingTool.assertNoUsedSrdSpells('goblin');
  });

  it('displays no spells if the response is malformed', async () => {
    msw.use(
      http.get('https://www.dnd5eapi.co/api/spells', () => new HttpResponse('malformed')),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.searchUsedSrdSpell('goblin', 'Acid Arrow');
    await dmApp.spellcastingTool.assertNoUsedSrdSpells('goblin');
  });

  it('displays no spells if there was an error fetching them', async () => {
    msw.use(
      http.get('https://www.dnd5eapi.co/api/spells', () => new HttpResponse(null, {
        status: 500,
      })),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Spellcasting');
    await dmApp.spellcastingTool.openUsedSpells('goblin');
    await dmApp.spellcastingTool.searchUsedSrdSpell('goblin', 'Acid Arrow');
    await dmApp.spellcastingTool.assertNoUsedSrdSpells('goblin');
  });
});
