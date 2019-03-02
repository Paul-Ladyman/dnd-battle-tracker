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

export function killCreature(state, creatureId) {
  const creature = findCreature(state.creatures, creatureId);
  const healthPoints = creature.healthPoints === undefined ? undefined : 0;
  return updateCreature(state, creatureId, {alive: false, healthPoints});
};

export function reviveCreature(state, creatureId) {
  return updateCreature(state, creatureId, {alive: true});
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

  return updateCreature(state, creatureId, {alive, healthPoints});
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

  return updateCreature(state, creatureId, {alive, healthPoints});
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