import { nanoid } from 'nanoid';
import { dismissErrors, updateErrors } from './ErrorManager';

function getSharedCreatures(creatures) {
  return creatures.map((creature) => ({
    ...creature,
    statBlock: undefined,
    armorClass: undefined,
    totalSpellSlots: undefined,
    usedSpellSlots: undefined,
    initiativeRoll: undefined,
    spells: undefined,
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

  console.log('>>> SHARE ERROR', state.loaded);
  const error = state.loaded
    ? 'Error rejoining previously shared battle. Try resharing the battle.'
    : 'Error sharing battle with players. Try toggling share button.';
  const stateWithErrors = updateErrors(state, error);

  if (createError) return { ...stateWithErrors, battleCreated: false };

  if (state.loaded) {
    return {
      ...stateWithErrors,
      battleCreated: false,
      shareEnabled: false,
      battleId: undefined,
    };
  }

  return stateWithErrors;
}
