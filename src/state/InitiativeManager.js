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
  let sharedActiveCreature = 0;
  let round = 1;

  if (state.round > 0) {
    activeCreature = currentlyActiveCreature + 1;
    sharedActiveCreature = activeCreature;
    round = state.round;

    if (activeCreature === state.creatures.length) {
      activeCreature = 0;
      sharedActiveCreature = 0;
      round += 1;
    }
  }

  const { sharedActiveCreature: previousSharedActiveCreature } = state;
  const { shared: nextCreatureIsShared } = state.creatures[sharedActiveCreature];

  if (!nextCreatureIsShared) {
    sharedActiveCreature = previousSharedActiveCreature;
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

  if (activeCreatureIndex === null || activeCreatureIndex === undefined) {
    return ['', null];
  }

  const { name, id } = creatures[activeCreatureIndex];

  return [name, id];
}
