import { createCreature } from './CreatureManager';
import { sortByInitiative } from './InitiativeManager';

function findCreatureIndex(creatures, creature) {
  return creatures.findIndex(({ id }) => creature.id === id);
}

export function removeCreature(state, creatureId) {
  if (state.creatures === undefined) {
    return state;
  }

  const creatures = state.creatures.filter(({ id }) => creatureId !== id);

  let activeCreature;

  if (creatures.length === 0) {
    activeCreature = undefined;
  } else if (state.activeCreature) {
    const currentlyActiveCreature = state.creatures[state.activeCreature];
    activeCreature = currentlyActiveCreature.id === creatureId
      ? state.activeCreature
      : findCreatureIndex(creatures, currentlyActiveCreature);
  } else {
    activeCreature = state.activeCreature;
  }

  const ariaAnnouncement = 'creature removed from battle';
  const ariaAnnouncements = state.ariaAnnouncements.concat([ariaAnnouncement]);
  return {
    ...state, creatures, activeCreature, ariaAnnouncements,
  };
}

function createCreatures(creatureIdCount, creatures, creatureStats, multiplier) {
  if (multiplier <= 1) {
    const initiative = creatureStats.initiative();
    const creature = { ...creatureStats, initiative };
    return [createCreature(creatureIdCount, creature)];
  }

  const groupRegex = new RegExp(`^${creatureStats.name.toLowerCase()}\\s*#(\\d*)$`);
  const groupMatch = (_) => _.name.toLowerCase().match(groupRegex);

  const groupIndexes = creatures
    .filter((_) => groupMatch(_) !== null)
    .map((_) => parseInt(groupMatch(_)[1], 10))
    .sort((a, b) => a - b);

  const groupSize = groupIndexes.length;
  const groupOffset = groupSize > 0 ? groupIndexes[groupSize - 1] : 0;

  return Array(multiplier).fill().map((_, i) => {
    const { name } = creatureStats;
    const number = i + 1 + groupOffset;
    const initiative = creatureStats.initiative();
    return createCreature(creatureIdCount + i, {
      ...creatureStats,
      initiative,
      name,
      number,
    });
  });
}

export function addCreature(state, creature) {
  const { multiplier, ...creatureStats } = creature;
  const creatureMultiplier = multiplier || 1;

  const newCreatures = createCreatures(
    state.creatureIdCount,
    state.creatures,
    creatureStats,
    creatureMultiplier,
  );

  const [
    creatures,
    activeCreature,
  ] = sortByInitiative([...state.creatures, ...newCreatures], state.activeCreature, state.round);

  const creatureIdCount = state.creatureIdCount + creatureMultiplier;

  const ariaAnnouncement = newCreatures.length > 1 ? 'creatures added' : `${newCreatures[0].name} added`;
  const ariaAnnouncements = state.ariaAnnouncements.concat([ariaAnnouncement]);

  return {
    ...state,
    creatures,
    creatureIdCount,
    activeCreature,
    focusedCreature: undefined,
    ariaAnnouncements,
    createCreatureErrors: {},
    errors: [],
  };
}

export function getCreatureList(state, playerSession = false) {
  if (!playerSession) {
    const { creatures } = state;
    return [creatures, creatures.length];
  }

  const sharedCreatures = state.creatures.filter(({ shared }) => shared);
  return [sharedCreatures, sharedCreatures.length];
}
