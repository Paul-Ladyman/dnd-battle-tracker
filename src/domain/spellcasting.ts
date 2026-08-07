import { getSpells } from '../client/dnd5eapi';

class SpellList {
  spells

  constructor(spells) {
    this.spells = spells;
  }

  search(name) {
    if (name.length < 2) return [];
    return this.spells
      .filter((spell) => spell.name && spell.name.toLowerCase().includes(name.toLowerCase()))
      .map((spell) => ({
        text: spell.name,
        id: spell.index,
      }));
  }
}

export async function getSpellList() {
  const spells = await getSpells();
  return new SpellList(spells);
}

export type SpellSlots = {
  '1st'?: number,
  '2nd'?: number,
  '3rd'?: number,
  '4th'?: number,
  '5th'?: number,
  '6th'?: number,
  '7th'?: number,
  '8th'?: number,
  '9th'?: number,
};

export type Spells = {
  [index: string]: {
    label: string,
    used?: number,
    total?: number
  }
}

export const maxSpellSlots = {
  '1st': 4,
  '2nd': 3,
  '3rd': 3,
  '4th': 3,
  '5th': 4, // Warlock has 4 level 5 slots from level 17
  '6th': 2,
  '7th': 2,
  '8th': 1,
  '9th': 1,
};

export const maxSpellsPerDay = 4;
