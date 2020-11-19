export function syncBattle(state, createBattle, updateBattle, date) {
  const syncInput = { variables: { battleinput: {
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
    updateBattle(syncInput);
    return state;
  }

  createBattle(syncInput);
  return { ...state, battleCreated: true };
}