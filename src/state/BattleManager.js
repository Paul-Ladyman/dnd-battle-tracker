import { resetCreature } from './CreatureManager';

function findCreatureIndex(creatures, creature) {
  return creatures.findIndex(({ id }) => creature.id === id);
}

export const newBattleState = {
  creatures: [],
  creatureIdCount: 0,
  creatureCount: 0,
  activeCreature: undefined,
  sharedActiveCreature: null,
  focusedCreature: undefined,
  round: 0,
  ariaAnnouncements: [],
  errors: [],
  createCreatureErrors: {},
  battleId: undefined,
  battleCreated: false,
  shareEnabled: false,
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

  return { ...state, focusedCreature };
}

export function prevFocus(state) {
  if (state.creatures.length === 0) {
    return state;
  }

  let focusedCreature = state.focusedCreature - 1;

  if (state.focusedCreature === undefined || state.focusedCreature === 0) {
    focusedCreature = state.creatureCount - 1;
  }

  return { ...state, focusedCreature };
}

export function setFocus(state, creature) {
  let focusedCreature = findCreatureIndex(state.creatures, creature);
  if (focusedCreature === -1) {
    focusedCreature = 0;
  }
  return { ...state, focusedCreature };
}

export function resetBattle(state) {
  const {
    creatures,
    ariaAnnouncements: currentAriaAnnouncements,
    battleId,
    shareEnabled,
    battleCreated,
  } = state;
  const lockedCreatures = creatures.filter((creature) => creature.locked);
  const creatureCount = lockedCreatures.length;
  const resetLockedCreatures = lockedCreatures.map((creature, id) => resetCreature(id, creature));
  const ariaAnnouncements = currentAriaAnnouncements.concat(['battle reset']);
  return {
    ...newBattleState,
    battleCreated,
    shareEnabled,
    battleId,
    creatureCount,
    creatureIdCount: creatureCount,
    creatures: resetLockedCreatures,
    ariaAnnouncements,
  };
}

export function toggleSync(state) {
  const { shareEnabled, ariaAnnouncements: currentAriaAnnouncements } = state;
  const announcement = shareEnabled ? 'share disabled' : 'share enabled';
  const ariaAnnouncements = currentAriaAnnouncements.concat([announcement]);
  return { ...state, shareEnabled: !shareEnabled, ariaAnnouncements };
}
