import getSecondsElapsed from './TimeManager';
import { allConditions, addCondition, removeCondition } from './ConditionsManager';

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
  const newConditions = addCondition(allConditions.Unconscious, creature, state.round);
  return updateCreature(
    state,
    creatureId,
    { alive: false, healthPoints, conditions: newConditions },
    ariaAnnouncement,
  );
}

export function stabalizeCreature(state, creatureId) {
  const creature = findCreature(state.creatures, creatureId);
  const ariaAnnouncement = `${creature.name} stabalized`;
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
    conditions = addCondition(allConditions.Unconscious, creature, state.round);
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
    conditions = removeCondition(allConditions.Unconscious, creature);
  }

  const ariaAnnouncement = `healed ${creature.name} by ${health}. ${creature.name}'s health is ${healthPoints}`;
  return updateCreature(state, creatureId, { alive, healthPoints, conditions }, ariaAnnouncement);
}

export function getRawName(name) {
  return name.replace(/[0-9]|#/g, '').trim();
}

export function createCreature(creatureId, {
  name, number, initiative, healthPoints,
}) {
  const groupedName = number ? `${name} #${number}` : name;
  return {
    name: groupedName,
    initiative,
    healthPoints,
    maxHealthPoints: healthPoints,
    temporaryHealthPoints: null,
    id: creatureId,
    alive: true,
    conditions: [],
    notes: [],
    locked: false,
    shared: true,
    hitPointsShared: true,
  };
}

export function validateCreature(name, initiative, healthPoints, multiplier) {
  const nameError = name === '';
  const initiativeError = initiative !== undefined && Number.isNaN(initiative);
  const healthError = healthPoints <= 0;
  const multiplierError = multiplier <= 0 || multiplier > 50;

  if (nameError || initiativeError || healthError || multiplierError) {
    return {
      nameError: nameError ? 'Name must be provided.' : false,
      initiativeError: initiativeError ? 'Initiative must be a number.' : false,
      healthError: healthError ? 'Health must be greater than 0.' : false,
      multiplierError: multiplierError ? 'Multiplier must be greater than 0 and less than 50.' : false,
    };
  }

  return undefined;
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
  const creature = findCreature(state.creatures, creatureId);

  if (creature.initiative !== undefined) {
    return state;
  }

  const ariaAnnouncement = `${creature.name}'s initiative is ${initiative}`;
  return updateCreature(state, creatureId, { initiative }, ariaAnnouncement);
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
    ({ text }) => text === allConditions.Unconscious,
  ) > -1;

  return healthPoints === 0 || isUnconscious;
}
