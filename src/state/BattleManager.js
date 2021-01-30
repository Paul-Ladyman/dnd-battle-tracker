import { resetCreature } from './CreatureManager';

function findCreatureIndex(creatures, creature) {
  return creatures.findIndex(({ id }) => creature.id === id);
}

export const newBattleState = {
  creatures: [],
  creatureIdCount: 0,
  activeCreature: undefined,
  sharedActiveCreature: null,
  focusedCreature: undefined,
  round: 0,
  sharedRound: 0,
  ariaAnnouncements: [],
  errors: [],
  createCreatureErrors: {},
  battleId: undefined,
  battleCreated: false,
  shareEnabled: false,
};

export function nextFocus(state) {
  const { creatures, focusedCreature: currentFocusedCreature } = state;
  const creatureCount = creatures.length;
  if (creatureCount === 0) {
    return state;
  }

  let focusedCreature = 0;

  if (currentFocusedCreature !== undefined) {
    focusedCreature = currentFocusedCreature + 1;
  }

  if (focusedCreature === creatureCount) {
    focusedCreature = 0;
  }

  return { ...state, focusedCreature };
}

export function prevFocus(state) {
  const { creatures, focusedCreature: currentFocusedCreature } = state;
  const creatureCount = creatures.length;
  if (creatureCount === 0) {
    return state;
  }

  let focusedCreature = currentFocusedCreature - 1;

  if (currentFocusedCreature === undefined || currentFocusedCreature === 0) {
    focusedCreature = creatureCount - 1;
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
  const creatureIdCount = lockedCreatures.length;
  const resetLockedCreatures = lockedCreatures.map((creature, id) => resetCreature(id, creature));
  const ariaAnnouncements = currentAriaAnnouncements.concat(['battle reset']);
  return {
    ...newBattleState,
    battleCreated,
    shareEnabled,
    battleId,
    creatureIdCount,
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
