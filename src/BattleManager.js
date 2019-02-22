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