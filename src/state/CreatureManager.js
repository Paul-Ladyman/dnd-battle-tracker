import { getSecondsElapsed } from './BattleManager';
import { conditionDescriptions } from '../model/conditions';

function findCreature(creatures, creatureId) {
  return creatures.find(({id}) => {
    return creatureId === id;
  });
}

function updateCreature(state, id, updates, announcement) {
  let newCreatures = [...state.creatures];
  const creatureIndex = newCreatures.findIndex((creature) => {
    return creature.id === id;
  });
  const existingCreature = newCreatures[creatureIndex]
  newCreatures[creatureIndex] = {...existingCreature, ...updates};

  const ariaAnnouncement = announcement ? [announcement] : [];
  const ariaAnnouncements = state.ariaAnnouncements.concat(ariaAnnouncement);

  return { ...state, creatures: newCreatures, ariaAnnouncements };
}

export function killCreature(state, creatureId) {
  const creature = findCreature(state.creatures, creatureId);
  const healthPoints = creature.healthPoints === undefined ? undefined : 0;
  const ariaAnnouncement = `${creature.name} killed/made unconscious`;
  return updateCreature(state, creatureId, {alive: false, healthPoints}, ariaAnnouncement);
};

export function stabalizeCreature(state, creatureId) {
  const creature = findCreature(state.creatures, creatureId);
  const ariaAnnouncement = `${creature.name} stabalized`;
  return updateCreature(state, creatureId, {alive: true}, ariaAnnouncement);
};

export function damageCreature(state, creatureId, damage) {
  const creature = findCreature(state.creatures, creatureId);

  if (!creature.healthPoints) {
    return state;
  }

  let healthPoints = creature.healthPoints - damage;
  let alive = creature.alive
  if (healthPoints <= 0) {
    healthPoints = 0;
    alive = false;
  }

  const ariaAnnouncement = `damaged ${creature.name} by ${damage}. ${creature.name}'s health is ${healthPoints}`;
  return updateCreature(state, creatureId, {alive, healthPoints}, ariaAnnouncement);
};

export function healCreature(state, creatureId, health) {
  const creature = findCreature(state.creatures, creatureId);

  if (creature.healthPoints === undefined) {
    return state;
  }

  let healthPoints = creature.healthPoints + health;
  if (healthPoints > creature.maxHealthPoints) {
    healthPoints = creature.maxHealthPoints;
  }

  let alive = creature.alive;
  if (healthPoints > 0) {
    alive = true;
  }

  const ariaAnnouncement = `healed ${creature.name} by ${health}. ${creature.name}'s health is ${healthPoints}`;
  return updateCreature(state, creatureId, {alive, healthPoints}, ariaAnnouncement);
};

export function createCreature(creatureId, {name, initiative, healthPoints}) {
  return {
    name,
    initiative,
    healthPoints,
    maxHealthPoints: healthPoints,
    id: creatureId,
    alive: true,
    conditions: [],
    notes: []
  };
};

export function addNoteToCreature(state, creatureId, text, isCondition) {
  const creature = findCreature(state.creatures, creatureId);
  const note = {
    text,
    appliedAtRound: state.round,
    appliedAtSeconds: getSecondsElapsed(state)
  };

  if (isCondition) {
    const condition = {
      ...note,
      url: conditionDescriptions[note.text]
    };
    const conditions = [...creature.conditions, condition];
    const ariaAnnouncement = `${note.text} condition added to ${creature.name}`;
    return updateCreature(state, creatureId, { conditions }, ariaAnnouncement);
  }

  const notes = [...creature.notes, note];

  const ariaAnnouncement = `note added to ${creature.name}`;
  return updateCreature(state, creatureId, { notes }, ariaAnnouncement);
}

export function removeNoteFromCreature(state, creatureId, note, isCondition) {
  const creature = findCreature(state.creatures, creatureId);
  const notesList = isCondition ? creature.conditions : creature.notes;
  const notes = notesList.filter(({text, appliedAtRound, appliedAtSeconds}) => {
    const notesAreEqual = text === note.text &&
      appliedAtRound === note.appliedAtRound &&
      appliedAtSeconds === note.appliedAtSeconds;

    return !notesAreEqual;
  });
  const newNotes = isCondition ? { conditions: notes } : { notes };
  const ariaAnnouncement = isCondition ?
    `${note.text} condition removed from ${creature.name}` :
    `note removed from ${creature.name}`;
  return updateCreature(state, creatureId, newNotes, ariaAnnouncement);
}

export function addHealthToCreature(state, creatureId, health) {
  if (health <= 0) {
    return state;
  }

  const creature = findCreature(state.creatures, creatureId);
  if (creature.healthPoints !== undefined) {
    return state;
  } 

  let healthPoints = health;
  if (!creature.alive) {
    healthPoints = 0;
  }

  const ariaAnnouncement = `${creature.name}'s health is ${healthPoints}, max health is ${health}`;
  return updateCreature(state, creatureId, { healthPoints, maxHealthPoints: health}, ariaAnnouncement);
}