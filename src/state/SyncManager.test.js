import { nanoid } from 'nanoid';
import { share, handleShareError } from './SyncManager';
import { dismissErrors, updateErrors } from './ErrorManager';
import defaultState from '../../test/fixtures/battle';
import now from '../util/date';

jest.mock('nanoid');
jest.mock('../util/date');
jest.mock('./ErrorManager');

const createBattleMock = jest.fn();
const updateBattleMock = jest.fn();

const timestamp = 1605815493000;
now.mockReturnValue(timestamp);

const expectedInput = (battleId) => ({
  variables: {
    battleinput: {
      battleId: battleId || defaultState.battleId,
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
        },
        {
          ...defaultState.creatures[1],
          statBlock: undefined,
          armorClass: undefined,
          totalSpellSlots: undefined,
          usedSpellSlots: undefined,
          initiativeRoll: undefined,
          spells: undefined,
        },
        {
          ...defaultState.creatures[2],
          statBlock: undefined,
          armorClass: undefined,
          totalSpellSlots: undefined,
          usedSpellSlots: undefined,
          initiativeRoll: undefined,
          spells: undefined,
        },
      ],
      activeCreature: defaultState.activeCreature,
      expdate: 1605901893,
    },
  },
});

beforeEach(() => {
  createBattleMock.mockReset();
  updateBattleMock.mockReset();
  nanoid.mockReset();
  updateErrors.mockReset();
  dismissErrors.mockReset();
});

describe('share', () => {
  it('creates a new battle with a 24 hour TTL', () => {
    const newState = share(defaultState, createBattleMock, updateBattleMock);

    expect(newState).toEqual({
      ...defaultState,
      battleCreated: true,
      sharedTimestamp: timestamp,
    });
    expect(createBattleMock).toHaveBeenCalledTimes(1);
    expect(createBattleMock.mock.calls[0][0]).toEqual(expectedInput());
    expect(updateBattleMock).not.toHaveBeenCalled();
  });

  it('updates an existing battle with a 24 hour TTL', () => {
    const state = { ...defaultState, battleCreated: true };
    const newState = share(state, createBattleMock, updateBattleMock);

    expect(newState).toEqual(state);
    expect(updateBattleMock).toHaveBeenCalledTimes(1);
    expect(updateBattleMock.mock.calls[0][0]).toEqual(expectedInput());
    expect(createBattleMock).not.toHaveBeenCalled();
  });

  it('does nothing if share is disabled', () => {
    const state = { ...defaultState, shareEnabled: false };
    const newState = share(state, createBattleMock, updateBattleMock);

    expect(newState).toEqual(state);
    expect(createBattleMock).not.toHaveBeenCalled();
    expect(updateBattleMock).not.toHaveBeenCalled();
  });

  it('creates a battle ID if one is not defined', () => {
    nanoid.mockReturnValue('new-id');

    const state = { ...defaultState, battleId: undefined };
    const newState = share(state, createBattleMock, updateBattleMock);

    const expectedState = {
      ...defaultState,
      battleCreated: true,
      battleId: 'new-id',
      sharedTimestamp: timestamp,
    };

    expect(newState).toEqual(expectedState);
    expect(createBattleMock).toHaveBeenCalledTimes(1);
    expect(createBattleMock.mock.calls[0][0]).toEqual(expectedInput('new-id'));
    expect(updateBattleMock).not.toHaveBeenCalled();
  });
});

describe('handleShareError', () => {
  it('sets an error in state and sets battleCreated to false on create battle error', () => {
    const state = { ...defaultState, battleCreated: true };
    const error = 'Error sharing battle with players. Try toggling share button.';
    const stateWithErrors = { ...state, errors: [error] };
    updateErrors.mockReturnValue(stateWithErrors);

    const newState = handleShareError(state, new Error('createError'), undefined);

    const expectedState = { ...stateWithErrors, battleCreated: false };
    expect(newState).toEqual(expectedState);
    expect(updateErrors).toHaveBeenCalledTimes(1);
    expect(updateErrors).toHaveBeenCalledWith(state, error);
  });

  it('sets an error in state on update battle error', () => {
    const state = { ...defaultState, battleCreated: true };
    const error = 'Error sharing battle with players. Try toggling share button.';
    const stateWithErrors = { ...state, errors: [error] };
    updateErrors.mockReturnValue(stateWithErrors);

    const newState = handleShareError(state, undefined, new Error('updateError'));

    expect(newState).toEqual(stateWithErrors);
    expect(updateErrors).toHaveBeenCalledTimes(1);
    expect(updateErrors).toHaveBeenCalledWith(state, error);
  });

  it('sets an error in state and sets battleCreated to false on create and update battle error', () => {
    const state = { ...defaultState, battleCreated: true };
    const error = 'Error sharing battle with players. Try toggling share button.';
    const stateWithErrors = { ...state, errors: [error] };
    updateErrors.mockReturnValue(stateWithErrors);

    const newState = handleShareError(state, new Error('createError'), new Error('updateError'));

    const expectedState = { ...stateWithErrors, battleCreated: false };
    expect(newState).toEqual(expectedState);
    expect(updateErrors).toHaveBeenCalledTimes(1);
    expect(updateErrors).toHaveBeenCalledWith(state, error);
  });

  it('unshares the battle on update battle error for a loaded battle', () => {
    const state = { ...defaultState, battleCreated: true, loaded: true };
    const error = 'Error rejoining previously shared battle. Try resharing the battle.';
    const stateWithErrors = { ...state, errors: [error] };
    updateErrors.mockReturnValue(stateWithErrors);

    const newState = handleShareError(state, undefined, new Error('updateError'));

    const expectedState = {
      ...stateWithErrors,
      battleCreated: false,
      shareEnabled: false,
      battleId: undefined,
    };
    expect(newState).toEqual(expectedState);
    expect(updateErrors).toHaveBeenCalledTimes(1);
    expect(updateErrors).toHaveBeenCalledWith(state, error);
  });

  it('clears errors in state if there are no errors', () => {
    const state = { ...defaultState, errors: ['some error'] };
    dismissErrors.mockReturnValue(defaultState);
    const newState = handleShareError(state, undefined, undefined);

    expect(newState).toEqual(defaultState);
    expect(updateErrors).not.toHaveBeenCalled();
    expect(dismissErrors).toHaveBeenCalledTimes(1);
    expect(dismissErrors).toHaveBeenCalledWith(state);
  });
});
