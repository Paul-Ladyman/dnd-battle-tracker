export function shareBattle(state, createBattle, updateBattle, date) {
  if (!state.shareEnabled) {
    return state;
  }

  const input = { variables: { battleinput: {
    battleId: state.battleId,
    creatureCount: state.creatureCount,
    round: state.round,
    creatures: state.creatures,
    activeCreature: state.activeCreature,
    focusedCreature: state.focusedCreature,
    expdate: Math.floor(date.getTime()/1000.0) + 86400
  }}};

  const { battleCreated } = state;

  if (battleCreated) {
    updateBattle(input);
    return state;
  }

  createBattle(input);
  return { ...state, battleCreated: true };
}