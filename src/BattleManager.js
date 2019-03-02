import { createCreature } from './CreatureManager';

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
  round: 0
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

  if (state.round === 0) {
    return {...state, round: 1, activeCreature: 0};
  }

  let activeCreature = state.activeCreature + 1;
  let round = state.round;

  if (activeCreature === state.creatureCount) {
    activeCreature = 0;
    round = round + 1;
  }

  return {...state, round, activeCreature};
};

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

  return {...state, creatures, creatureCount, activeCreature};
};

export function addCreature(state, creature) {
  const newCreature = createCreature(state.creatureIdCount, creature);
  const creatures = sortCreatures([...state.creatures, newCreature]);
  const currentlyActiveCreature = state.creatures[state.activeCreature];

  let activeCreature = state.activeCreature;
  if (state.round > 0) {
    activeCreature = findCreatureIndex(creatures, currentlyActiveCreature);
  }
  const creatureCount = state.creatureCount + 1;
  const creatureIdCount = state.creatureIdCount + 1;

  return {...state, creatures, creatureCount, creatureIdCount, activeCreature};
};
