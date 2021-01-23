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

  let activeCreature = 0;
  let round = 1;

  if (state.round > 0) {
    activeCreature = currentlyActiveCreature + 1;
    round = state.round;

    if (activeCreature === state.creatureCount) {
      activeCreature = 0;
      round += 1;
    }
  }

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

function findPreviousSharedCreature(creatures, startingIndex, currentIndex = startingIndex) {
  const { name, shared } = creatures[currentIndex];

  if (shared) {
    return [name, currentIndex];
  }

  const lastIndex = creatures.length - 1;
  const previousIndex = currentIndex - 1;
  const previousCreatureIndex = previousIndex < 0 ? lastIndex : previousIndex;

  if (previousCreatureIndex === startingIndex) {
    return ['', undefined];
  }

  return findPreviousSharedCreature(creatures, startingIndex, previousCreatureIndex);
}

export function getInitiative(state, playerSession) {
  const { creatures, round, activeCreature } = state;
  if (creatures.length === 0 || round === 0) {
    return ['', undefined];
  }

  if (playerSession) {
    return findPreviousSharedCreature(creatures, activeCreature);
  }

  const { name } = creatures[activeCreature];

  return [name, activeCreature];
}
