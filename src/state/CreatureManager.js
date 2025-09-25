import getSecondsElapsed from './TimeManager';
import { addCondition, removeCondition } from './ConditionsManager';
import { monsterUrlFrom5eApiIndex } from '../client/dndBeyond';
import { maxSpellSlots } from '../domain/spellcasting';
import conditionsData from '../domain/conditions';

function findCreature(creatures, creatureId) {
  return creatures.find(({ id }) => creatureId === id);
}

function updateCreature(state, id, updates, announcement) {
  const newCreatures = [...state.creatures];
  const creatureIndex = newCreatures.findIndex((creature) => creature.id === id);
  const existingCreature = newCreatures[creatureIndex];
  newCreatures[creatureIndex] = { ...existingCreature, ...updates };

  const ariaAnnouncement = announcement ? [announcement] : [];
  const ariaAnnouncements = state.ariaAnnouncements.concat(ariaAnnouncement);

  return { ...state, creatures: newCreatures, ariaAnnouncements };
}

export function killCreature(state, creatureId) {
  const creature = findCreature(state.creatures, creatureId);
  const healthPoints = creature.healthPoints === undefined ? undefined : 0;
  const ariaAnnouncement = `${creature.name} killed/made unconscious`;
  const newConditions = addCondition(conditionsData.Unconscious.text, creature, state.round);
  return updateCreature(
    state,
    creatureId,
    { alive: false, healthPoints, conditions: newConditions },
    ariaAnnouncement,
  );
}

export function stabilizeCreature(state, creatureId) {
  const creature = findCreature(state.creatures, creatureId);
  const ariaAnnouncement = `${creature.name} stabilized`;
  return updateCreature(state, creatureId, { alive: true }, ariaAnnouncement);
}

export function damageCreature(state, creatureId, damage) {
  if (damage < 0) {
    return state;
  }

  const creature = findCreature(state.creatures, creatureId);
  let { healthPoints, temporaryHealthPoints } = creature;

  if (!healthPoints && !temporaryHealthPoints) {
    return state;
  }

  let remainingDamage = damage;
  if (temporaryHealthPoints !== null) {
    temporaryHealthPoints -= damage;
    remainingDamage = 0;
    if (temporaryHealthPoints < 0) {
      remainingDamage = Math.abs(temporaryHealthPoints);
      temporaryHealthPoints = 0;
    }
  }

  healthPoints -= remainingDamage;
  let { alive, conditions } = creature;
  if (healthPoints <= 0) {
    healthPoints = 0;
    alive = false;
    conditions = addCondition(conditionsData.Unconscious.text, creature, state.round);
  }

  const temporaryHealthPointsAnnouncement = temporaryHealthPoints !== null ? `${creature.name}'s temporary health is ${temporaryHealthPoints}. ` : '';
  const ariaAnnouncement = `damaged ${creature.name} by ${damage}. ${temporaryHealthPointsAnnouncement}${creature.name}'s health is ${healthPoints}`;
  return updateCreature(
    state,
    creatureId,
    {
      alive,
      healthPoints,
      temporaryHealthPoints,
      conditions,
    },
    ariaAnnouncement,
  );
}

export function healCreature(state, creatureId, health) {
  if (health < 0) {
    return state;
  }

  const creature = findCreature(state.creatures, creatureId);

  if (creature.healthPoints === undefined) {
    return state;
  }

  let healthPoints = creature.healthPoints + health;
  if (healthPoints > creature.maxHealthPoints) {
    healthPoints = creature.maxHealthPoints;
  }

  let { alive, conditions } = creature;
  if (creature.healthPoints === 0 && healthPoints > 0) {
    alive = true;
    conditions = removeCondition(conditionsData.Unconscious.text, creature);
  }

  const ariaAnnouncement = `healed ${creature.name} by ${health}. ${creature.name}'s health is ${healthPoints}`;
  return updateCreature(state, creatureId, { alive, healthPoints, conditions }, ariaAnnouncement);
}

export function getRawName(name) {
  return name.replace(/[0-9]|#/g, '').trim();
}

function getTotalSpellSlots(stats) {
  const abilities = stats?.special_abilities;
  const spellcastingAbility = Array.isArray(abilities) && abilities.find((_) => _.spellcasting);
  const srdSlots = spellcastingAbility?.spellcasting?.slots;

  if (!srdSlots) return null;

  return Object.keys(maxSpellSlots).reduce((totalSlots, level, i) => {
    const slots = Object.values(srdSlots)[i] || 0;
    return {
      ...totalSlots,
      [level]: slots,
    };
  }, {});
}

function getTotalSpells(stats) {
  const abilities = stats?.special_abilities;
  const spellcastingAbility = Array.isArray(abilities) && abilities.find((_) => _.spellcasting);
  const srdSpells = spellcastingAbility?.spellcasting?.spells;

  if (!srdSpells) return {};

  return srdSpells.reduce((spells, spell) => {
    const { name, usage } = spell;
    const type = usage?.type;
    if (type !== 'per day') return spells;

    const { times } = usage;
    const key = name.toLowerCase().replace(/\s/g, '');
    return {
      ...spells,
      [key]: {
        label: name,
        total: times,
      },
    };
  }, {});
}

export function createCreature(creatureId, {
  name, number, initiative, healthPoints, armorClass, stats,
}) {
  const groupedName = number ? `${name} #${number}` : name;
  const index = stats?.index;
  const statBlock = index ? monsterUrlFrom5eApiIndex(index) : null;
  const hp = healthPoints === null || healthPoints > 0 ? healthPoints : 1;

  return {
    name: groupedName,
    initiative: initiative.result,
    initiativeRoll: initiative,
    initiativeTieBreaker: null,
    healthPoints: hp,
    maxHealthPoints: hp,
    armorClass: armorClass || null,
    temporaryHealthPoints: null,
    id: creatureId,
    alive: true,
    conditions: [],
    notes: [],
    locked: false,
    shared: true,
    hitPointsShared: true,
    statBlock,
    totalSpellSlots: getTotalSpellSlots(stats),
    usedSpellSlots: null,
    spells: getTotalSpells(stats),
  };
}

export function addNoteToCreature(state, creatureId, text, isCondition) {
  const creature = findCreature(state.creatures, creatureId);

  if (isCondition) {
    const ariaAnnouncement = `${text} condition added to ${creature.name}`;
    const conditions = addCondition(text, creature, state.round);
    return updateCreature(state, creatureId, { conditions }, ariaAnnouncement);
  }

  const noteIds = creature.notes.map(({ id }) => id);
  const largestId = noteIds.sort((id1, id2) => id2 - id1)[0];
  const nextId = largestId === undefined ? 0 : largestId + 1;

  const note = {
    text,
    appliedAtRound: state.round,
    appliedAtSeconds: getSecondsElapsed(state.round),
    id: nextId,
  };
  const notes = [...creature.notes, note];
  const ariaAnnouncement = `note added to ${creature.name}`;
  return updateCreature(state, creatureId, { notes }, ariaAnnouncement);
}

export function updateNoteForCreature(state, creatureId, noteId, text) {
  const creature = findCreature(state.creatures, creatureId);
  if (!creature) return state;
  const existingNote = creature.notes.find(({ id }) => id === noteId);
  if (!existingNote) return state;
  const newNote = {
    ...existingNote,
    text,
  };
  const notes = creature.notes.map((note) => {
    if (note.id === noteId) return newNote;
    return note;
  });
  const ariaAnnouncement = `note updated for ${creature.name}`;
  return updateCreature(state, creatureId, { notes }, ariaAnnouncement);
}

export function removeNoteFromCreature(state, creatureId, note, isCondition) {
  const creature = findCreature(state.creatures, creatureId);

  if (isCondition) {
    const conditions = removeCondition(note.text, creature);
    const ariaAnnouncement = `${note.text} condition removed from ${creature.name}`;
    return updateCreature(state, creatureId, { conditions }, ariaAnnouncement);
  }

  const notes = creature.notes.filter(({ id }) => id !== note.id);
  const ariaAnnouncement = `note removed from ${creature.name}`;
  return updateCreature(state, creatureId, { notes }, ariaAnnouncement);
}

export function addHitPointsToCreature(state, creatureId, hitPoints) {
  if (hitPoints <= 0) {
    return state;
  }

  const {
    alive,
    healthPoints,
    maxHealthPoints,
    name,
  } = findCreature(state.creatures, creatureId);

  let newHitPoints;

  if (!alive) {
    newHitPoints = 0;
  } else if (hitPoints > maxHealthPoints) {
    const difference = hitPoints - maxHealthPoints;
    newHitPoints = healthPoints + difference;
  } else if (hitPoints > healthPoints) {
    newHitPoints = healthPoints;
  } else {
    newHitPoints = hitPoints;
  }

  const ariaAnnouncement = `${name}'s hp is ${newHitPoints}, max hp is ${hitPoints}`;
  return updateCreature(
    state,
    creatureId,
    { healthPoints: newHitPoints, maxHealthPoints: hitPoints },
    ariaAnnouncement,
  );
}

export function addArmorClassToCreature(state, creatureId, ac) {
  if (ac < 0) {
    return state;
  }

  const creature = findCreature(state.creatures, creatureId);
  const ariaAnnouncement = `${creature.name}'s AC is ${ac}`;
  return updateCreature(
    state,
    creatureId,
    { armorClass: ac },
    ariaAnnouncement,
  );
}

export function addTemporaryHealthToCreature(state, creatureId, health) {
  if (health < 0) {
    return state;
  }

  const creature = findCreature(state.creatures, creatureId);
  const ariaAnnouncement = `${creature.name} has ${health} temporary health points`;
  return updateCreature(
    state,
    creatureId,
    { temporaryHealthPoints: health },
    ariaAnnouncement,
  );
}

export function addInitiativeToCreature(state, creatureId, initiative) {
  const { creatures, activeCreature } = state;
  const creature = findCreature(creatures, creatureId);
  const activeCreatureId = creatures[activeCreature]?.id;
  if (creature.id === activeCreatureId) return state;
  const ariaAnnouncement = `${creature.name}'s initiative is ${initiative}`;
  return updateCreature(state, creatureId, { initiative, initiativeRoll: null }, ariaAnnouncement);
}

export function addTieBreakerToCreature(state, creatureId, initiativeTieBreaker) {
  const { creatures, activeCreature } = state;
  const creature = findCreature(creatures, creatureId);
  const activeCreatureId = creatures[activeCreature]?.id;
  if (creature.id === activeCreatureId) return state;
  const ariaAnnouncement = `${creature.name}'s initiative tie breaker is ${initiativeTieBreaker}`;
  return updateCreature(state, creatureId, { initiativeTieBreaker }, ariaAnnouncement);
}

export function toggleCreatureLock(state, creatureId) {
  const creature = findCreature(state.creatures, creatureId);
  const newState = creature.locked ? 'unlocked' : 'locked';
  const ariaAnnouncement = `${creature.name} is ${newState}`;
  return updateCreature(state, creatureId, { locked: !creature.locked }, ariaAnnouncement);
}

export function toggleCreatureShare(state, creatureId) {
  const creature = findCreature(state.creatures, creatureId);
  const newState = creature.shared ? 'not shared' : 'shared';
  const ariaAnnouncement = `${creature.name} is ${newState}`;
  return updateCreature(state, creatureId, { shared: !creature.shared }, ariaAnnouncement);
}

export function toggleCreatureHitPointsShare(state, creatureId) {
  const creature = findCreature(state.creatures, creatureId);
  const newState = creature.hitPointsShared ? 'not shared' : 'shared';
  const ariaAnnouncement = `${creature.name}'s hit points are ${newState}`;
  return updateCreature(
    state,
    creatureId,
    { hitPointsShared: !creature.hitPointsShared },
    ariaAnnouncement,
  );
}

export function resetCreature(id, creature) {
  const notes = creature.notes.map((note) => ({ ...note, appliedAtRound: 0, appliedAtSeconds: 0 }));
  const conditions = creature.conditions.map(
    (condition) => ({ ...condition, appliedAtRound: 0, appliedAtSeconds: 0 }),
  );
  return {
    ...creature,
    id,
    initiative: undefined,
    initiativeRoll: undefined,
    initiativeTieBreaker: null,
    notes,
    conditions,
  };
}

export function isCreatureStable(creature) {
  const { alive, healthPoints, conditions } = creature;

  if (!alive || healthPoints > 0) {
    return false;
  }

  const isUnconscious = conditions.findIndex(
    ({ text }) => text === conditionsData.Unconscious.text,
  ) > -1;

  return healthPoints === 0 || isUnconscious;
}

export function addTotalSpellSlots(state, creatureId, level, slots) {
  const max = maxSpellSlots[level];
  if (max === undefined || slots < 0 || slots > max) return state;

  const creature = findCreature(state.creatures, creatureId);
  const { totalSpellSlots, usedSpellSlots } = creature;

  const newTotalSpellSlots = {
    ...totalSpellSlots,
    [level]: slots,
  };

  const usedSlots = usedSpellSlots?.[level];
  const totalBelowUsed = slots < usedSlots;

  const newUsedSpellSlots = totalBelowUsed
    ? {
      ...usedSpellSlots,
      [level]: slots,
    }
    : usedSpellSlots;

  const update = { totalSpellSlots: newTotalSpellSlots, usedSpellSlots: newUsedSpellSlots };

  const ariaAnnouncement = `${creature.name} has ${slots} ${level} level spell slots`;
  return updateCreature(state, creatureId, update, ariaAnnouncement);
}

export function addUsedSpellSlots(state, creatureId, level, slots) {
  const max = maxSpellSlots[level];
  if (max === undefined || slots < 0 || slots > max) return state;

  const creature = findCreature(state.creatures, creatureId);
  const { usedSpellSlots, totalSpellSlots } = creature;

  const total = totalSpellSlots?.[level];
  if (slots > total) return state;

  const newUsedSpellSlots = {
    ...usedSpellSlots,
    [level]: slots,
  };

  const update = { usedSpellSlots: newUsedSpellSlots };

  const ariaAnnouncement = `${creature.name} has used ${slots} ${level} level spell slots`;
  return updateCreature(state, creatureId, update, ariaAnnouncement);
}

export function addSpell(state, creatureId, spell) {
  const creature = findCreature(state.creatures, creatureId);
  const { spells } = creature;
  const key = spell.replace(/\s/g, '').toLowerCase();

  if (spells?.[key]) return state;

  const newSpells = {
    ...spells,
    [key]: {
      label: spell,
    },
  };

  const update = { spells: newSpells };

  const ariaAnnouncement = `added spell ${spell} to ${creature.name}`;
  return updateCreature(state, creatureId, update, ariaAnnouncement);
}

export function addSpellTotalUses(state, creatureId, spellKey, uses) {
  if (uses < 0 || uses > 5) return state;

  const creature = findCreature(state.creatures, creatureId);
  const { spells } = creature;
  const oldSpell = spells?.[spellKey];

  if (!oldSpell) return state;

  const { used } = oldSpell;

  const newUsed = uses < used ? uses : used;

  const newSpells = {
    ...spells,
    [spellKey]: {
      ...oldSpell,
      used: newUsed,
      total: uses,
    },
  };

  const update = { spells: newSpells };

  const ariaAnnouncement = `${creature.name} has ${uses} uses of ${oldSpell.label}`;
  return updateCreature(state, creatureId, update, ariaAnnouncement);
}

export function addSpellUses(state, creatureId, spellKey, uses) {
  if (uses < 0 || uses > 5) return state;
  const creature = findCreature(state.creatures, creatureId);
  const { spells } = creature;
  const oldSpell = spells?.[spellKey];

  if (!oldSpell) return state;

  const { total } = oldSpell;
  if (uses > total) return state;

  const newSpells = {
    ...spells,
    [spellKey]: {
      ...oldSpell,
      used: uses,
    },
  };

  const update = { spells: newSpells };

  const ariaAnnouncement = `${creature.name} has used ${uses} ${oldSpell.label}`;
  return updateCreature(state, creatureId, update, ariaAnnouncement);
}
