import { nanoid } from 'nanoid';

export function share(state, createBattle, updateBattle, date) {
  console.log('>>> syncmanager share enabled', state.shareEnabled);
  if (!state.shareEnabled) {
    return state;
  }

  const battleId = state.battleId || nanoid(11);

  const input = { variables: { battleinput: {
    battleId,
    creatureCount: state.creatureCount,
    round: state.round,
    creatures: state.creatures,
    activeCreature: state.activeCreature,
    expdate: Math.floor(date.getTime()/1000.0) + 86400
  }}};

  const { battleCreated } = state;

  if (battleCreated) {
    updateBattle(input);
    return state;
  }

  createBattle(input);

  return { ...state, battleCreated: true, battleId };
}