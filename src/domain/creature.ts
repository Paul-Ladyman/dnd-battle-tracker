import getSecondsElapsed from '../state/TimeManager';
import conditionsData, { AppliedCondition } from './conditions';
import { Roll } from './dice';
import { AppliedNote } from './notes';
import { Spells, SpellSlots } from './spellcasting';

export type CreatureData = {
  name: string,
  initiative: number | null,
  initiativeRoll: Roll,
  initiativeTieBreaker: number | null,
  healthPoints: number | null,
  maxHealthPoints: number | null,
  armorClass: number | null,
  temporaryHealthPoints: number | null,
  id: number,
  alive: boolean,
  conditions: AppliedCondition[],
  notes: AppliedNote[],
  locked: boolean,
  shared: boolean,
  hitPointsShared: boolean,
  statBlock: string | null,
  totalSpellSlots: SpellSlots | null,
  usedSpellSlots: SpellSlots | null,
  spells: Spells,
  selected: boolean,
}

export default class Creature {
  private data: CreatureData
  name: string
  initiative: number | null
  initiativeRoll: Roll
  initiativeTieBreaker: number | null
  healthPoints: number | null
  maxHealthPoints: number | null
  armorClass: number | null
  temporaryHealthPoints: number | null
  id: number
  alive: boolean
  conditions: AppliedCondition[]
  notes: AppliedNote[]
  locked: boolean
  shared: boolean
  hitPointsShared: boolean
  statBlock: string | null
  totalSpellSlots: SpellSlots | null
  usedSpellSlots: SpellSlots | null
  spells: Spells
  selected: boolean

  constructor(data: CreatureData) {
    const {
      name,
      initiative,
      initiativeRoll,
      initiativeTieBreaker,
      healthPoints,
      maxHealthPoints,
      armorClass,
      temporaryHealthPoints,
      id,
      alive,
      conditions,
      notes,
      locked,
      shared,
      hitPointsShared,
      statBlock,
      totalSpellSlots,
      usedSpellSlots,
      spells,
      selected,
    } = data;

    this.data = data;
    this.name = name;
    this.initiative = initiative;
    this.initiativeRoll = initiativeRoll;
    this.initiativeTieBreaker = initiativeTieBreaker;
    this.healthPoints = healthPoints;
    this.maxHealthPoints = maxHealthPoints;
    this.armorClass = armorClass;
    this.temporaryHealthPoints = temporaryHealthPoints;
    this.id = id;
    this.alive = alive;
    this.conditions = conditions;
    this.notes = notes;
    this.locked = locked;
    this.shared = shared;
    this.hitPointsShared = hitPointsShared;
    this.statBlock = statBlock;
    this.totalSpellSlots = totalSpellSlots;
    this.usedSpellSlots = usedSpellSlots;
    this.spells = spells;
    this.selected = selected;
  }

  toggleSelect(): Creature {
    return new Creature({
      ...this.data,
      selected: !this.selected,
    });
  }

  unselect(): Creature {
    return new Creature({
      ...this.data,
      selected: false,
    });
  }

  lock(): Creature {
    return new Creature({
      ...this.data,
      locked: true,
    });
  }

  unlock(): Creature {
    return new Creature({
      ...this.data,
      locked: false,
    });
  }

  share(): Creature {
    return new Creature({
      ...this.data,
      shared: true,
    });
  }

  unshare(): Creature {
    return new Creature({
      ...this.data,
      shared: false,
    });
  }

  shareHitPoints(): Creature {
    return new Creature({
      ...this.data,
      hitPointsShared: true,
    });
  }

  unshareHitPoints(): Creature {
    return new Creature({
      ...this.data,
      hitPointsShared: false,
    });
  }

  kill(round: number): Creature {
    const healthPoints = this.healthPoints === null ? null : 0;
    const unconsciousCondition = {
      text: conditionsData.Unconscious.text,
      appliedAtRound: round,
      appliedAtSeconds: getSecondsElapsed(round),
      url: conditionsData.Unconscious.url,
      id: conditionsData.Unconscious.id,
    };
    const alreadyUnconscious = this.conditions
      .findIndex(({ id }) => id === conditionsData.Unconscious.id) > -1;
    const conditions = alreadyUnconscious
      ? this.conditions
      : [...this.conditions, unconsciousCondition];

    const newData = {
      ...this.data,
      alive: false,
      healthPoints,
      conditions,
    };
    return new Creature(newData);
  }

  stabilize(): Creature {
    return new Creature({
      ...this.data,
      alive: true,
    });
  }

  serialize(): CreatureData {
    return {
      name: this.name,
      initiative: this.initiative,
      initiativeRoll: this.initiativeRoll,
      initiativeTieBreaker: this.initiativeTieBreaker,
      healthPoints: this.healthPoints,
      maxHealthPoints: this.maxHealthPoints,
      armorClass: this.armorClass,
      temporaryHealthPoints: this.temporaryHealthPoints,
      id: this.id,
      alive: this.alive,
      conditions: this.conditions,
      notes: this.notes,
      locked: this.locked,
      shared: this.shared,
      hitPointsShared: this.hitPointsShared,
      statBlock: this.statBlock,
      totalSpellSlots: this.totalSpellSlots,
      usedSpellSlots: this.usedSpellSlots,
      spells: this.spells,
      selected: this.selected,
    };
  }
}
