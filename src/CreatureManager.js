function findCreatureIndex(creatures, creature) {
  return creatures.findIndex(({id}) => {
    return creature.id === id;
  });
}

function findCreature(creatures, creatureId) {
  return creatures.find(({id}) => {
    return creatureId === id;
  });
}

function updateCreature(state, id, updates) {
  let newCreatures = [...state.creatures];
  const creatureIndex = newCreatures.findIndex((creature) => {
    return creature.id === id;
  });
  const existingCreature = newCreatures[creatureIndex]
  newCreatures[creatureIndex] = {...existingCreature, ...updates};

  return { ...state, creatures: newCreatures };
}

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

export function killCreature(state, creatureId) {
  const creature = findCreature(state.creatures, creatureId);
  const healthPoints = creature.healthPoints === undefined ? undefined : 0;
  return updateCreature(state, creatureId, {alive: false, healthPoints});
};

export function reviveCreature(state, creatureId) {
  return updateCreature(state, creatureId, {alive: true});
};