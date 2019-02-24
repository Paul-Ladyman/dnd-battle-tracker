export const newBattleState = {
  creatures: [],
  creatureIdCount: 0,
  creatureCount: 0,
  activeCreature: undefined,
  round: 0
};

export function getSecondsElapsed(state) {
  if (!state.round || state.round <= 0) {
    return 0;
  }
  return (state.round - 1) * 6;
};

export function nextInitiative(state) {
  if (state.creatures.length === 0) {
    return state;
  }

  if (state.round === 0) {
    return {...state, round: 1, activeCreature: 0};
  }

  let activeCreature = state.activeCreature + 1;
  let round = state.round;

  if (activeCreature === state.creatureCount) {
    activeCreature = 0;
    round = round + 1;
  }

  return {...state, round, activeCreature};
};

export function getInitiative(state) {
  if (state.creatures.length === 0) {
    return '';
  }

  if (state.round === 0) {
    return '';
  }

  return state.creatures[state.activeCreature].name;
}
