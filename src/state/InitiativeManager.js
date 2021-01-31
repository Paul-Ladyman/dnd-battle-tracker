import { addError } from './AppManager';

function findCreatureIndex(creatures, creature) {
  return creatures.findIndex(({ id }) => creature.id === id);
}

function sortCreatures(creatures) {
  return creatures.sort((creatureA, creatureB) => creatureB.initiative - creatureA.initiative);
}

export function sortByInitiative(creatures, activeCreature, round) {
  const initialActiveCreature = creatures[activeCreature];
  const sortedCreatures = sortCreatures(creatures);
  const currentlyActiveCreature = round > 0
    ? findCreatureIndex(sortedCreatures, initialActiveCreature)
    : activeCreature;
  return [sortedCreatures, currentlyActiveCreature];
}

function getNextActiveCreatureAndRound(currentActiveCreature, creatureCount, currentRound) {
  if (currentActiveCreature === null) {
    return [0, 1];
  }

  const nextActiveCreature = currentActiveCreature + 1;

  if (nextActiveCreature === creatureCount) {
    return [0, currentRound + 1];
  }

  return [nextActiveCreature, currentRound];
}

function getNextSharedActiveCreatureAndRound(
  currentSharedActiveCreature,
  nextActiveCreature,
  creatures,
  currentSharedRound,
  nextRound,
) {
  const { shared: nextCreatureIsShared } = creatures[nextActiveCreature];

  if (nextCreatureIsShared) {
    return [nextActiveCreature, nextRound];
  }

  return [currentSharedActiveCreature, currentSharedRound];
}

export function nextInitiative(state) {
  if (state.creatures.length === 0) {
    return state;
  }

  const creaturesWithoutInitiative = state.creatures.filter(
    (creature) => creature.initiative === undefined,
  );
  if (creaturesWithoutInitiative.length > 0) {
    const { name } = creaturesWithoutInitiative[0];
    const ariaAnnouncements = state.ariaAnnouncements.concat(`Cannot continue battle. ${name} has no initiative.`);
    const errors = addError({ ...state, errors: [] }, `Cannot continue battle; ${name} has no initiative.`);
    return { ...state, ariaAnnouncements, errors };
  }

  const [
    sortedCreatures,
    currentlyActiveCreature,
  ] = sortByInitiative(state.creatures, state.activeCreature, state.round);

  const [
    activeCreature,
    round,
  ] = getNextActiveCreatureAndRound(currentlyActiveCreature, state.creatures.length, state.round);

  const [
    sharedActiveCreature,
    sharedRound,
  ] = getNextSharedActiveCreatureAndRound(
    state.sharedActiveCreature,
    activeCreature,
    state.creatures,
    state.sharedRound,
    round,
  );

  const { name, alive } = state.creatures[activeCreature];
  let ariaAnnouncement = `its ${name}'s go`;

  if (!alive) {
    ariaAnnouncement = `${ariaAnnouncement}. ${name} is dead/unconscious`;
  }
  const ariaAnnouncements = state.ariaAnnouncements.concat([ariaAnnouncement]);

  return {
    ...state,
    creatures: sortedCreatures,
    round,
    sharedRound,
    activeCreature,
    sharedActiveCreature,
    focusedCreature: activeCreature,
    ariaAnnouncements,
    errors: [],
  };
}

export function getInitiative(state, playerSession) {
  const {
    creatures,
    activeCreature,
    sharedActiveCreature,
  } = state;

  const activeCreatureIndex = playerSession ? sharedActiveCreature : activeCreature;

  if (activeCreatureIndex === null) {
    return ['', null];
  }

  const { name, id } = creatures[activeCreatureIndex];

  return [name, id];
}

function findPreviousSharedCreature(
  startingRound,
  creatures,
  startingIndex,
  currentIndex = startingIndex,
) {
  const { name, shared, id } = creatures[currentIndex];

  if (shared) {
    return [startingRound, name, id];
  }

  const lastIndex = creatures.length - 1;
  const previousIndex = currentIndex - 1;
  const wrapIndex = previousIndex < 0;
  const previousCreatureIndex = wrapIndex ? lastIndex : previousIndex;

  if (previousCreatureIndex === startingIndex) {
    return [0, '', null];
  }

  const round = wrapIndex ? startingRound - 1 : startingRound;

  if (round === 0) {
    return [0, '', null];
  }

  return findPreviousSharedCreature(round, creatures, startingIndex, previousCreatureIndex);
}

export function getInitiative2(state, playerSession) {
  const { creatures, round, activeCreature } = state;
  if (creatures.length === 0 || round === 0) {
    return [0, '', null];
  }

  if (playerSession) {
    return findPreviousSharedCreature(round, creatures, activeCreature);
  }

  const { name, id } = creatures[activeCreature];

  return [round, name, id];
}

export function getRound(state, playerSession) {
  return playerSession ? state.sharedRound : state.round;
}
