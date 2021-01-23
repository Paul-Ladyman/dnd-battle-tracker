import { createCreature, validateCreature } from './CreatureManager';
import { sortByInitiative } from './InitiativeManager';
import { addError } from './AppManager';

function findCreatureIndex(creatures, creature) {
  return creatures.findIndex(({ id }) => creature.id === id);
}

export function removeCreature(state, creatureId) {
  if (state.creatures === undefined
    || state.creatureCount === undefined) {
    return state;
  }

  const creatures = state.creatures.filter(({ id }) => creatureId !== id);

  let creatureCount;
  let activeCreature;

  if (creatures.length === 0) {
    creatureCount = 0;
    activeCreature = undefined;
  } else {
    creatureCount = state.creatureCount - 1;

    if (state.activeCreature) {
      const currentlyActiveCreature = state.creatures[state.activeCreature];
      activeCreature = currentlyActiveCreature.id === creatureId
        ? state.activeCreature
        : findCreatureIndex(creatures, currentlyActiveCreature);
    } else {
      activeCreature = state.activeCreature;
    }
  }

  const ariaAnnouncement = 'creature removed from battle';
  const ariaAnnouncements = state.ariaAnnouncements.concat([ariaAnnouncement]);
  return {
    ...state, creatures, creatureCount, activeCreature, ariaAnnouncements,
  };
}

function createCreatures(creatureIdCount, creatures, creature, multiplier) {
  if (multiplier <= 1) {
    return [createCreature(creatureIdCount, creature)];
  }

  const groupRegex = new RegExp(`^${creature.name.toLowerCase()}\\s*#(\\d*)$`);
  const groupMatch = (_) => _.name.toLowerCase().match(groupRegex);

  const groupIndexes = creatures
    .filter((_) => groupMatch(_) !== null)
    .map((_) => parseInt(groupMatch(_)[1], 10))
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
      .filter((error) => createCreatureErrors[error])
      .map((error) => createCreatureErrors[error])
      .join('. ');

    const ariaAnnouncements = state.ariaAnnouncements.concat(`Failed to create creature. ${createCreatureErrorMessages}`);
    const errors = addError(state, 'Failed to create creature. Create creature form is invalid.');
    return {
      ...state, ariaAnnouncements, errors, createCreatureErrors,
    };
  }

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

  const creatureCount = state.creatureCount + creatureMultiplier;
  const creatureIdCount = state.creatureIdCount + creatureMultiplier;

  const ariaAnnouncement = newCreatures.length > 1 ? 'creatures added' : `${newCreatures[0].name} added`;
  const ariaAnnouncements = state.ariaAnnouncements.concat([ariaAnnouncement]);

  return {
    ...state,
    creatures,
    creatureCount,
    creatureIdCount,
    activeCreature,
    ariaAnnouncements,
    createCreatureErrors: {},
    errors: [],
  };
}

export function getCreatureList(state, playerSession = false) {
  if (!playerSession) {
    return state.creatures;
  }

  return state.creatures.filter(({ shared }) => shared);
}
