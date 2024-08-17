import { addInitiativeError } from './ErrorManager';

function findCreatureIndex(creatures, creature) {
  return creatures.findIndex(({ id }) => creature.id === id);
}

function sortCreatures(creatures) {
  return creatures.sort((creatureA, creatureB) => {
    const initiativeA = creatureA.initiative;
    const initiativeB = creatureB.initiative;

    if (initiativeA === initiativeB) {
      const tieBreakerA = creatureA.initiativeTieBreaker || 0;
      const tieBreakerB = creatureB.initiativeTieBreaker || 0;
      return tieBreakerB - tieBreakerA;
    }

    return initiativeB - initiativeA;
  });
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

export function nextInitiative(state) {
  if (state.creatures.length === 0) {
    return state;
  }

  const creaturesWithoutInitiative = state.creatures.filter(
    (creature) => creature.initiative === undefined || creature.initiative === null,
  );

  if (creaturesWithoutInitiative.length > 0) {
    const { name, id } = creaturesWithoutInitiative[0];
    return addInitiativeError(state, name, id);
  }

  const [
    sortedCreatures,
    currentlyActiveCreature,
  ] = sortByInitiative(state.creatures, state.activeCreature, state.round);

  const [
    activeCreature,
    round,
  ] = getNextActiveCreatureAndRound(currentlyActiveCreature, state.creatures.length, state.round);

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
    activeCreature,
    focusedCreature: activeCreature,
    ariaAnnouncements,
    errors: [],
  };
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

export function getInitiative(state, playerSession) {
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
