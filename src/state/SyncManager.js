import { nanoid } from 'nanoid';
import { dismissErrors, updateErrors } from './ErrorManager';
import now from '../util/date';
import {
  createDmRecoveryKey,
  encryptDmRecovery,
} from './DmRecoveryManager';

const PLAYER_TTL_SECONDS = 24 * 60 * 60;
const DM_RECOVERY_TTL_SECONDS = 60 * 24 * 60 * 60;
const DM_RECOVERY_ID_SIZE = 21;

let shareQueue = Promise.resolve();

function getSharedCreatures(creatures) {
  return creatures.map((creature) => ({
    ...creature,
    statBlock: undefined,
    armorClass: undefined,
    totalSpellSlots: undefined,
    usedSpellSlots: undefined,
    initiativeRoll: undefined,
    spells: undefined,
    selected: undefined,
  }));
}

function publicBattleInput(state, battleId, timestamp) {
  return {
    variables: {
      battleinput: {
        battleId,
        round: state.round,
        creatures: getSharedCreatures(state.creatures),
        activeCreature: state.activeCreature,
        expdate: Math.floor(timestamp / 1000.0) + PLAYER_TTL_SECONDS,
      },
    },
  };
}

function recoveryBattleInput(recoveryId, dmSnapshot, timestamp) {
  return {
    variables: {
      battleinput: {
        battleId: recoveryId,
        round: 0,
        creatures: [],
        activeCreature: null,
        dmSnapshot,
        expdate: Math.floor(timestamp / 1000.0) + DM_RECOVERY_TTL_SECONDS,
      },
    },
  };
}

async function persistRecovery(state, recoveryMutation, timestamp) {
  if (!state.dmRecoveryKey || !state.dmRecoveryId || !recoveryMutation) return;

  let dmSnapshot;
  try {
    dmSnapshot = await encryptDmRecovery(
      state,
      state.dmRecoveryKey,
      state.dmRecoveryId,
    );
  } catch {
    return;
  }

  try {
    await recoveryMutation(
      recoveryBattleInput(state.dmRecoveryId, dmSnapshot, timestamp),
    );
  } catch {
    // Recovery errors are surfaced separately without disabling player sharing.
  }
}

function queueShare(
  state,
  publicMutation,
  publicInput,
  recoveryMutation,
  timestamp,
) {
  const run = async () => {
    try {
      await publicMutation(publicInput);
    } catch {
      // Public sharing errors are surfaced by the Apollo mutation state.
    }

    await persistRecovery(state, recoveryMutation, timestamp);
  };

  shareQueue = shareQueue.then(run, run).catch(() => undefined);
}

function queueRecovery(state, recoveryMutation, timestamp) {
  const run = () => persistRecovery(state, recoveryMutation, timestamp);
  shareQueue = shareQueue.then(run, run).catch(() => undefined);
}

export function waitForPendingShares() {
  return shareQueue;
}

export function share(
  state,
  createBattle,
  updateBattle,
  createRecovery = createBattle,
  updateRecovery = updateBattle,
) {
  if (!state.shareEnabled) {
    return state;
  }

  const battleId = state.battleId || nanoid(11);
  const timestamp = now();
  const dmRecoveryKey = state.dmRecoveryKey || createDmRecoveryKey();
  const dmRecoveryId = dmRecoveryKey
    ? (state.dmRecoveryId || `dm-${nanoid(DM_RECOVERY_ID_SIZE)}`)
    : undefined;

  const sharedState = {
    ...state,
    battleId,
    dmRecoveryId,
    dmRecoveryKey,
  };

  const publicMutation = state.battleCreated ? updateBattle : createBattle;
  let recoveryMutation;
  if (dmRecoveryId) {
    recoveryMutation = state.dmRecoveryCreated ? updateRecovery : createRecovery;
  }

  queueShare(
    sharedState,
    publicMutation,
    publicBattleInput(state, battleId, timestamp),
    recoveryMutation,
    timestamp,
  );

  return {
    ...sharedState,
    battleCreated: true,
    dmRecoveryCreated: Boolean(dmRecoveryId),
    ...(!state.battleCreated ? { sharedTimestamp: timestamp } : {}),
  };
}

export function shareRecovery(state, createRecovery, updateRecovery) {
  if (!state.shareEnabled) return state;

  const timestamp = now();
  const dmRecoveryKey = state.dmRecoveryKey || createDmRecoveryKey();
  const dmRecoveryId = dmRecoveryKey
    ? (state.dmRecoveryId || `dm-${nanoid(DM_RECOVERY_ID_SIZE)}`)
    : undefined;

  if (!dmRecoveryId) return state;

  const recoveryState = {
    ...state,
    dmRecoveryId,
    dmRecoveryKey,
  };
  const recoveryMutation = state.dmRecoveryCreated
    ? updateRecovery
    : createRecovery;

  queueRecovery(recoveryState, recoveryMutation, timestamp);

  return {
    ...recoveryState,
    dmRecoveryCreated: true,
  };
}

export function handleShareError(state, createError, updateError) {
  if (!createError && !updateError) return dismissErrors(state);

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

export function handleRecoveryError(state, createError, updateError) {
  if (!createError && !updateError) return state;

  const error = 'DM recovery could not be saved. Player sharing is still active.';
  return {
    ...updateErrors(state, error),
    dmRecoveryCreated: false,
  };
}
