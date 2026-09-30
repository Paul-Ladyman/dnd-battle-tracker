import { nanoid } from 'nanoid';
import {
  share,
  shareRecovery,
  handleShareError,
  handleRecoveryError,
  waitForPendingShares,
} from './SyncManager';
import { dismissErrors, updateErrors } from './ErrorManager';
import {
  createDmRecoveryKey,
  encryptDmRecovery,
} from './DmRecoveryManager';
import defaultState from '../../test/fixtures/battle';
import now from '../util/date';

jest.mock('nanoid');
jest.mock('../util/date');
jest.mock('./ErrorManager');
jest.mock('./DmRecoveryManager');

const createBattleMock = jest.fn();
const updateBattleMock = jest.fn();
const createRecoveryMock = jest.fn();
const updateRecoveryMock = jest.fn();

const timestamp = 1605815493000;
now.mockReturnValue(timestamp);

const expectedPublicInput = (battleId = defaultState.battleId) => ({
  variables: {
    battleinput: {
      battleId,
      round: defaultState.round,
      creatures: [
        {
          ...defaultState.creatures[0],
          statBlock: undefined,
          armorClass: undefined,
          totalSpellSlots: undefined,
          usedSpellSlots: undefined,
          initiativeRoll: undefined,
          spells: undefined,
          selected: undefined,
        },
        {
          ...defaultState.creatures[1],
          statBlock: undefined,
          armorClass: undefined,
          totalSpellSlots: undefined,
          usedSpellSlots: undefined,
          initiativeRoll: undefined,
          spells: undefined,
          selected: undefined,
        },
        {
          ...defaultState.creatures[2],
          statBlock: undefined,
          armorClass: undefined,
          totalSpellSlots: undefined,
          usedSpellSlots: undefined,
          initiativeRoll: undefined,
          spells: undefined,
          selected: undefined,
        },
      ],
      activeCreature: defaultState.activeCreature,
      expdate: 1605901893,
    },
  },
});

const expectedRecoveryInput = (
  recoveryId = 'dm-recovery-token',
  dmSnapshot = 'encrypted-snapshot',
) => ({
  variables: {
    battleinput: {
      battleId: recoveryId,
      round: 0,
      creatures: [],
      activeCreature: null,
      dmSnapshot,
      expdate: 1610999493,
    },
  },
});

beforeEach(async () => {
  await waitForPendingShares();
  createBattleMock.mockReset();
  updateBattleMock.mockReset();
  createRecoveryMock.mockReset();
  updateRecoveryMock.mockReset();
  nanoid.mockReset();
  updateErrors.mockReset();
  dismissErrors.mockReset();
  createDmRecoveryKey.mockReset();
  encryptDmRecovery.mockReset();

  createBattleMock.mockResolvedValue();
  updateBattleMock.mockResolvedValue();
  createRecoveryMock.mockResolvedValue();
  updateRecoveryMock.mockResolvedValue();
  nanoid.mockImplementation((size) => (
    size === 11 ? 'new-player-id' : 'recovery-token'
  ));
  createDmRecoveryKey.mockReturnValue('private-key');
  encryptDmRecovery.mockResolvedValue('encrypted-snapshot');
});

describe('share', () => {
  it('creates separate player and DM recovery records with different TTLs', async () => {
    const newState = share(
      defaultState,
      createBattleMock,
      updateBattleMock,
      createRecoveryMock,
      updateRecoveryMock,
    );

    expect(newState).toEqual({
      ...defaultState,
      battleCreated: true,
      dmRecoveryId: 'dm-recovery-token',
      dmRecoveryKey: 'private-key',
      dmRecoveryCreated: true,
      sharedTimestamp: timestamp,
    });

    await waitForPendingShares();

    expect(createBattleMock).toHaveBeenCalledTimes(1);
    expect(createBattleMock).toHaveBeenCalledWith(expectedPublicInput());
    expect(createRecoveryMock).toHaveBeenCalledTimes(1);
    expect(createRecoveryMock).toHaveBeenCalledWith(expectedRecoveryInput());
    expect(updateBattleMock).not.toHaveBeenCalled();
    expect(updateRecoveryMock).not.toHaveBeenCalled();

    expect(encryptDmRecovery).toHaveBeenCalledWith(
      expect.objectContaining({
        battleId: defaultState.battleId,
        dmRecoveryId: 'dm-recovery-token',
        dmRecoveryKey: 'private-key',
      }),
      'private-key',
      'dm-recovery-token',
    );
  });

  it('updates existing player and DM recovery records independently', async () => {
    const state = {
      ...defaultState,
      battleCreated: true,
      dmRecoveryId: 'dm-existing',
      dmRecoveryKey: 'existing-private-key',
      dmRecoveryCreated: true,
    };

    const newState = share(
      state,
      createBattleMock,
      updateBattleMock,
      createRecoveryMock,
      updateRecoveryMock,
    );

    expect(newState).toEqual(state);

    await waitForPendingShares();

    expect(updateBattleMock).toHaveBeenCalledTimes(1);
    expect(updateBattleMock).toHaveBeenCalledWith(expectedPublicInput());
    expect(updateRecoveryMock).toHaveBeenCalledTimes(1);
    expect(updateRecoveryMock).toHaveBeenCalledWith(
      expectedRecoveryInput('dm-existing'),
    );
    expect(createBattleMock).not.toHaveBeenCalled();
    expect(createRecoveryMock).not.toHaveBeenCalled();
  });

  it('does nothing if sharing is disabled', async () => {
    const state = { ...defaultState, shareEnabled: false };
    const newState = share(
      state,
      createBattleMock,
      updateBattleMock,
      createRecoveryMock,
      updateRecoveryMock,
    );

    expect(newState).toEqual(state);
    await waitForPendingShares();

    expect(createBattleMock).not.toHaveBeenCalled();
    expect(updateBattleMock).not.toHaveBeenCalled();
    expect(createRecoveryMock).not.toHaveBeenCalled();
    expect(updateRecoveryMock).not.toHaveBeenCalled();
    expect(createDmRecoveryKey).not.toHaveBeenCalled();
  });

  it('creates a fresh player ID when one is not defined', async () => {
    const state = {
      ...defaultState,
      battleId: undefined,
      battleCreated: false,
      dmRecoveryId: 'dm-existing',
      dmRecoveryKey: 'existing-private-key',
      dmRecoveryCreated: true,
    };

    const newState = share(
      state,
      createBattleMock,
      updateBattleMock,
      createRecoveryMock,
      updateRecoveryMock,
    );

    expect(newState.battleId).toBe('new-player-id');
    expect(newState.battleCreated).toBe(true);
    expect(newState.sharedTimestamp).toBe(timestamp);
    expect(newState.dmRecoveryId).toBe('dm-existing');

    await waitForPendingShares();

    expect(createBattleMock).toHaveBeenCalledWith(
      expectedPublicInput('new-player-id'),
    );
    expect(updateRecoveryMock).toHaveBeenCalledWith(
      expectedRecoveryInput('dm-existing'),
    );
  });

  it('keeps an existing DM recovery key and ID', async () => {
    const state = {
      ...defaultState,
      battleCreated: true,
      dmRecoveryId: 'dm-existing',
      dmRecoveryKey: 'existing-private-key',
      dmRecoveryCreated: true,
    };

    const newState = share(
      state,
      createBattleMock,
      updateBattleMock,
      createRecoveryMock,
      updateRecoveryMock,
    );
    await waitForPendingShares();

    expect(newState.dmRecoveryId).toBe('dm-existing');
    expect(newState.dmRecoveryKey).toBe('existing-private-key');
    expect(createDmRecoveryKey).not.toHaveBeenCalled();
    expect(encryptDmRecovery).toHaveBeenCalledWith(
      state,
      'existing-private-key',
      'dm-existing',
    );
  });

  it('keeps player sharing working if DM recovery encryption fails', async () => {
    encryptDmRecovery.mockRejectedValue(new Error('crypto failed'));

    share(
      defaultState,
      createBattleMock,
      updateBattleMock,
      createRecoveryMock,
      updateRecoveryMock,
    );
    await waitForPendingShares();

    expect(createBattleMock).toHaveBeenCalledWith(expectedPublicInput());
    expect(createRecoveryMock).not.toHaveBeenCalled();
  });
});

describe('shareRecovery', () => {
  it('updates only the private recovery snapshot for an existing recovery record', async () => {
    const state = {
      ...defaultState,
      battleCreated: true,
      dmRecoveryId: 'dm-existing',
      dmRecoveryKey: 'existing-private-key',
      dmRecoveryCreated: true,
    };

    const newState = shareRecovery(
      state,
      createRecoveryMock,
      updateRecoveryMock,
    );

    expect(newState).toEqual(state);

    await waitForPendingShares();

    expect(updateRecoveryMock).toHaveBeenCalledTimes(1);
    expect(updateRecoveryMock).toHaveBeenCalledWith(
      expectedRecoveryInput('dm-existing'),
    );
    expect(createRecoveryMock).not.toHaveBeenCalled();
    expect(encryptDmRecovery).toHaveBeenCalledWith(
      state,
      'existing-private-key',
      'dm-existing',
    );
  });

  it('does nothing when sharing is disabled', async () => {
    const state = {
      ...defaultState,
      shareEnabled: false,
      dmRecoveryId: 'dm-existing',
      dmRecoveryKey: 'existing-private-key',
      dmRecoveryCreated: true,
    };

    expect(shareRecovery(
      state,
      createRecoveryMock,
      updateRecoveryMock,
    )).toBe(state);

    await waitForPendingShares();

    expect(createRecoveryMock).not.toHaveBeenCalled();
    expect(updateRecoveryMock).not.toHaveBeenCalled();
    expect(encryptDmRecovery).not.toHaveBeenCalled();
  });
});

describe('handleShareError', () => {
  it('sets an error and allows player creation to be retried', () => {
    const state = { ...defaultState, battleCreated: true };
    const error = 'Error sharing battle with players. Try toggling share button.';
    const stateWithErrors = { ...state, errors: [error] };
    updateErrors.mockReturnValue(stateWithErrors);

    const newState = handleShareError(state, new Error('createError'), undefined);

    expect(newState).toEqual({
      ...stateWithErrors,
      battleCreated: false,
    });
    expect(updateErrors).toHaveBeenCalledWith(state, error);
  });

  it('sets an error on an update failure', () => {
    const state = { ...defaultState, battleCreated: true };
    const error = 'Error sharing battle with players. Try toggling share button.';
    const stateWithErrors = { ...state, errors: [error] };
    updateErrors.mockReturnValue(stateWithErrors);

    const newState = handleShareError(state, undefined, new Error('updateError'));

    expect(newState).toEqual(stateWithErrors);
    expect(updateErrors).toHaveBeenCalledWith(state, error);
  });

  it('unshares a loaded battle after an update failure', () => {
    const state = { ...defaultState, battleCreated: true, loaded: true };
    const error = 'Error rejoining previously shared battle. Try resharing the battle.';
    const stateWithErrors = { ...state, errors: [error] };
    updateErrors.mockReturnValue(stateWithErrors);

    const newState = handleShareError(state, undefined, new Error('updateError'));

    expect(newState).toEqual({
      ...stateWithErrors,
      battleCreated: false,
      shareEnabled: false,
      battleId: undefined,
    });
    expect(updateErrors).toHaveBeenCalledWith(state, error);
  });

  it('clears sharing errors when mutations are healthy', () => {
    const state = { ...defaultState, errors: ['some error'] };
    dismissErrors.mockReturnValue(defaultState);

    const newState = handleShareError(state, undefined, undefined);

    expect(newState).toEqual(defaultState);
    expect(updateErrors).not.toHaveBeenCalled();
    expect(dismissErrors).toHaveBeenCalledWith(state);
  });
});

describe('handleRecoveryError', () => {
  it('keeps player sharing active and marks recovery for recreation', () => {
    const state = {
      ...defaultState,
      battleCreated: true,
      dmRecoveryId: 'dm-existing',
      dmRecoveryKey: 'private-key',
      dmRecoveryCreated: true,
    };
    const error = 'DM recovery could not be saved. Player sharing is still active.';
    const stateWithErrors = { ...state, errors: [error] };
    updateErrors.mockReturnValue(stateWithErrors);

    const newState = handleRecoveryError(
      state,
      new Error('recovery create failed'),
      undefined,
    );

    expect(newState).toEqual({
      ...stateWithErrors,
      dmRecoveryCreated: false,
    });
    expect(newState.shareEnabled).toBe(true);
    expect(newState.battleCreated).toBe(true);
    expect(updateErrors).toHaveBeenCalledWith(state, error);
  });

  it('leaves state unchanged when recovery mutations are healthy', () => {
    const state = {
      ...defaultState,
      dmRecoveryCreated: true,
    };

    expect(handleRecoveryError(state, undefined, undefined)).toBe(state);
    expect(updateErrors).not.toHaveBeenCalled();
  });
});
