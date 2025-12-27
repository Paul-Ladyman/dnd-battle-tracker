import getSecondsElapsed from '../state/TimeManager';
import conditionsData from './conditions';

export default class Creature {
  constructor(data) {
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

  toggleSelect() {
    return new Creature({
      ...this.data,
      selected: !this.selected,
    });
  }

  unselect() {
    return new Creature({
      ...this.data,
      selected: false,
    });
  }

  kill(round) {
    const healthPoints = this.healthPoints === undefined ? undefined : 0;
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

  stabilize() {
    return new Creature({
      ...this.data,
      alive: true,
    });
  }

  serialize() {
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
