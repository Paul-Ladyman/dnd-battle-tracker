import { nanoid } from 'nanoid';
import { updateErrors, dismissErrors } from './AppManager';

function getSharedCreatures(creatures) {
  return creatures.map((creature) => ({
    ...creature,
    statBlock: undefined,
  }));
}

export function share(state, createBattle, updateBattle, date) {
  if (!state.shareEnabled) {
    return state;
  }

  const battleId = state.battleId || nanoid(11);

  const input = {
    variables: {
      battleinput: {
        battleId,
        round: state.round,
        creatures: getSharedCreatures(state.creatures),
        activeCreature: state.activeCreature,
        expdate: Math.floor(date.getTime() / 1000.0) + 86400,
      },
    },
  };

  const { battleCreated } = state;

  if (battleCreated) {
    updateBattle(input);
    return state;
  }

  createBattle(input);

  return { ...state, battleCreated: true, battleId };
}

export function handleShareError(state, createError, updateError) {
  if (!createError && !updateError) return dismissErrors(state);

  const error = 'Error sharing battle with players. Try toggling share button.';
  const stateWithErrors = updateErrors(state, error);

  if (createError) return { ...stateWithErrors, battleCreated: false };

  return stateWithErrors;
}
