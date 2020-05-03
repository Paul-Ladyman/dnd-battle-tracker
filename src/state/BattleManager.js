import findIndex from 'lodash.findindex';
import { createCreature, validateCreature, resetCreature } from './CreatureManager';
import { addError } from './AppManager';

function findCreatureIndex(creatures, creature) {
  return findIndex(creatures, ({id}) => {
    return creature.id === id;
  });
}

function sortCreatures(creatures) {
  return creatures.sort((creatureA, creatureB) => {
    return creatureB.initiative - creatureA.initiative;
  });
}

export const newBattleState = {
  creatures: [],
  creatureIdCount: 0,
  creatureCount: 0,
  activeCreature: undefined,
  focusedCreature: undefined,
  round: 0,
  ariaAnnouncements: [],
  errors: [],
  createCreatureErrors: {}
};

export function getSecondsElapsed(state) {
  if (!state.round || state.round <= 0) {
    return 0;
  }
  return (state.round - 1) * 6;
};

export function nextInitiative(state) {
  if (state.creatures.length === 0) {
    return state;
  }
  
  const creaturesWithoutInitiative = state.creatures.filter(creature => creature.initiative === undefined);
  if (creaturesWithoutInitiative.length > 0) {
    const { name } = creaturesWithoutInitiative[0];
    const ariaAnnouncements = state.ariaAnnouncements.concat(`Cannot continue battle. ${name} has no initiative.`);
    const errors = addError({...state, errors: []}, `Cannot continue battle. ${name} has no initiative.`);
    return {...state, ariaAnnouncements, errors};
  }

  const initialActiveCreature = state.creatures[state.activeCreature];
  const sortedCreatures = sortCreatures(state.creatures);

  const currentlyActiveCreature = state.round > 0 ? 
    findCreatureIndex(sortedCreatures, initialActiveCreature) :
    state.activeCreature;

  let activeCreature = 0;
  let round = 1;

  if (state.round > 0) {
    activeCreature = currentlyActiveCreature + 1;
    round = state.round;

    if (activeCreature === state.creatureCount) {
      activeCreature = 0;
      round = round + 1;
    }
  }

  const { name, alive } = state.creatures[activeCreature];
  let ariaAnnouncement = `its ${name}'s go`;

  if (!alive) {
    ariaAnnouncement = `${ariaAnnouncement}. ${name} is dead/unconscious`;
  }
  const ariaAnnouncements = state.ariaAnnouncements.concat([ariaAnnouncement]);

  return {...state, creatures: sortedCreatures, round, activeCreature, focusedCreature: activeCreature, ariaAnnouncements, errors: []};
};

export function nextFocus(state) {
  if (state.creatures.length === 0) {
    return state;
  }

  let focusedCreature = 0;

  if (state.focusedCreature !== undefined) {
    focusedCreature = state.focusedCreature + 1;
  }
  
  if (focusedCreature === state.creatureCount) {
    focusedCreature = 0;
  }

  return {...state, focusedCreature};
}

export function prevFocus(state) {
  if (state.creatures.length === 0) {
    return state;
  }

  let focusedCreature = state.focusedCreature - 1;

  if (state.focusedCreature === undefined || state.focusedCreature === 0) {
    focusedCreature = state.creatureCount - 1;
  }

  return {...state, focusedCreature};
}

export function setFocus(state, creature) {
  let focusedCreature = findCreatureIndex(state.creatures, creature);
  if (focusedCreature === -1) {
    focusedCreature = 0;
  }
  return {...state, focusedCreature};
}

export function getInitiative(state) {
  if (state.creatures.length === 0) {
    return '';
  }

  if (state.round === 0) {
    return '';
  }

  return state.creatures[state.activeCreature].name;
};

export function removeCreature(state, creatureId) {
  if (state.creatures === undefined ||
    state.creatureCount === undefined) {
    return state;
  }

  const creatures = state.creatures.filter(({id}) => {
    return creatureId !== id;
  });

  let creatureCount;
  let activeCreature;

  if (creatures.length === 0) {
    creatureCount = 0;
    activeCreature = undefined;
  } else {
    creatureCount = state.creatureCount - 1;

    if (state.activeCreature) {
      const currentlyActiveCreature = state.creatures[state.activeCreature];
      activeCreature = currentlyActiveCreature.id === creatureId ?
        state.activeCreature :
        findCreatureIndex(creatures, currentlyActiveCreature);
    } else {
      activeCreature = state.activeCreature;
    }
  }

  const ariaAnnouncement = 'creature removed from battle';
  const ariaAnnouncements = state.ariaAnnouncements.concat([ariaAnnouncement]);
  return {...state, creatures, creatureCount, activeCreature, ariaAnnouncements};
};

function createCreatures(creatureIdCount, creatures, creature, multiplier) {
  if (multiplier <= 1) {
    return [ createCreature(creatureIdCount, creature) ];
  }

  const groupRegex = new RegExp(`^${creature.name.toLowerCase()}\\s*#(\\d*)$`);
  const groupMatch = _ => _.name.toLowerCase().match(groupRegex);

  const groupIndexes = creatures
    .filter(_ => groupMatch(_) !== null)
    .map(_ => parseInt(groupMatch(_)[1]))
    .sort((a, b) => a - b);

  const groupSize = groupIndexes.length;
  const groupOffset = groupSize > 0 ? groupIndexes[groupSize - 1] : 0;

  return Array(multiplier).fill().map((_, i) => {
    const { name } = creature;
    const number = i + 1 + groupOffset;
    return createCreature(creatureIdCount + i, { ...creature, name, number });
  });
}

export function addCreature(state, creature) {
  const { multiplier, ...creatureStats } = creature;
  const creatureMultiplier = multiplier || 1;

  const { name, initiative, healthPoints } = creatureStats;
  const createCreatureErrors = validateCreature(name, initiative, healthPoints, multiplier); 

  if (createCreatureErrors) {
    const createCreatureErrorMessages = Object.keys(createCreatureErrors)
      .filter(error => createCreatureErrors[error])
      .map(error => createCreatureErrors[error])
      .join('. ');

    const ariaAnnouncements = state.ariaAnnouncements.concat(`Failed to create creature. ${createCreatureErrorMessages}`);
    const errors = addError(state, 'Failed to create creature. Create creature form is invalid.');
    return {...state, ariaAnnouncements, errors, createCreatureErrors};
  }

  const newCreatures = createCreatures(state.creatureIdCount, state.creatures, creatureStats, creatureMultiplier);
  const creatures = sortCreatures([...state.creatures, ...newCreatures]);
  const currentlyActiveCreature = state.creatures[state.activeCreature];

  const activeCreature = state.round > 0 ? 
    findCreatureIndex(creatures, currentlyActiveCreature) :
    state.activeCreature;

  const creatureCount = state.creatureCount + creatureMultiplier;
  const creatureIdCount = state.creatureIdCount + creatureMultiplier;

  const ariaAnnouncement = newCreatures.length > 1 ? 'creatures added' : `${newCreatures[0].name} added`;
  const ariaAnnouncements = state.ariaAnnouncements.concat([ariaAnnouncement]);

  return {...state, creatures, creatureCount, creatureIdCount, activeCreature, ariaAnnouncements, createCreatureErrors: {}, errors: []};
};

export function resetBattle(state) {
  const lockedCreatures = state.creatures.filter(creature => creature.locked);
  const creatureCount = lockedCreatures.length;
  const resetLockedCreatures = lockedCreatures.map((creature, id) => resetCreature(id, creature));
  const ariaAnnouncements = state.ariaAnnouncements.concat(['battle reset']);
  return {...newBattleState, creatureCount, creatureIdCount: creatureCount, creatures: resetLockedCreatures, ariaAnnouncements};
}
