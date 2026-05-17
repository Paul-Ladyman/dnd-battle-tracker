import Creatures from '../domain/creatures';
import Encounter from '../domain/Encounter';
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

function getNextTurnAnnouncement(state, activeCreature) {
  if (!activeCreature) return state.ariaAnnouncements;

  const { name, alive } = activeCreature;
  let ariaAnnouncement = `its ${name}'s go`;

  if (!alive) {
    ariaAnnouncement = `${ariaAnnouncement}. ${name} is dead/unconscious`;
  }
  return state.ariaAnnouncements.concat([ariaAnnouncement]);
}

export function nextInitiative(state) {
  const {
    creatures: originalCreatures,
    round: originalRound,
    turn: originalTurn,
    turns: originalTurns,
  } = state;

  const encounter = new Encounter(
    new Creatures(originalCreatures),
    originalRound,
    originalTurn,
    originalTurns,
  );

  try {
    const {
      creatures,
      round,
      turn,
      turns,
    } = encounter.nextTurn();

    const activeCreature = creatures.get(turn);
    const activeCreatureIndex = creatures.getIndex(turn);

    return {
      ...state,
      creatures: creatures.serialize(),
      round,
      activeCreature: activeCreatureIndex,
      focusedCreature: activeCreatureIndex,
      ariaAnnouncements: getNextTurnAnnouncement(state, activeCreature),
      errors: [],
      turn,
      turns,
    };
  } catch (e) {
    const { name, id } = e.creature;
    return addInitiativeError(state, name, id);
  }
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
