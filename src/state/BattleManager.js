import { createCreature, validateCreature } from './CreatureManager';
import { addError } from './AppManager';

function findCreatureIndex(creatures, creature) {
  return creatures.findIndex(({id}) => {
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

  let activeCreature = 0;
  let round = 1;

  if (state.round > 0) {
    activeCreature = state.activeCreature + 1;
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

  return {...state, round, activeCreature, focusedCreature: activeCreature, ariaAnnouncements};
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

  const groupRegex = new RegExp(`^${creature.name} #(\\d*)$`);
  const groupMatch = _ => _.name.toLowerCase().match(groupRegex);

  const groupIndexes = creatures
    .filter(c => groupMatch(c) !== null)
    .map(c => parseInt(groupMatch(c)[1]))
    .sort((a, b) => a - b);

  const groupSize = groupIndexes.length;
  const groupOffset = groupSize > 0 ? groupIndexes[groupSize - 1] : 0;

  return Array(multiplier).fill().map((_, i) => {
    const name = `${creature.name} #${i + 1 + groupOffset}`;
    return createCreature(creatureIdCount + i, { ...creature, name });
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
  const ariaAnnouncements = state.ariaAnnouncements.concat(['battle reset']);
  return {...newBattleState, ariaAnnouncements};
}
