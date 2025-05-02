import {
  newBattleState,
  resetBattle,
  toggleSync,
} from './BattleManager';
import { resetCreature } from './CreatureManager';
import defaultState from '../../test/fixtures/battle';

jest.mock('./CreatureManager');
jest.mock('../../package.json', () => ({ version: '1.0.0' }));

beforeEach(() => {
  resetCreature.mockClear();
});

describe('newBattleState', () => {
  test('returns the initial battle state', () => {
    const expected = {
      creatures: [],
      creatureIdCount: 0,
      activeCreature: null,
      focusedCreature: undefined,
      round: 0,
      ariaAnnouncements: [],
      errors: [],
      createCreatureErrors: {},
      battleCreated: false,
      shareEnabled: false,
      battleId: undefined,
      battleTrackerVersion: '1.0.0',
      sharedTimestamp: null,
    };

    expect(newBattleState()).toEqual(expected);
  });
});

describe('resetBattle', () => {
  test('resets to the initial battle state', () => {
    const expected = {
      creatureIdCount: 2,
      activeCreature: null,
      focusedCreature: undefined,
      round: 0,
      ariaAnnouncements: ['battle reset'],
      errors: [],
      createCreatureErrors: {},
      battleTrackerVersion: '1.0.0',
    };

    expect(resetBattle(defaultState)).toMatchObject(expected);
    expect(resetCreature).toHaveBeenCalledTimes(2);
  });

  test('resets the battle state, keeping and resetting locked creatures', () => {
    const resetCreature1 = {
      ...defaultState.creatures[1],
      id: 0,
      initiative: undefined,
    };
    const resetCreature2 = {
      ...defaultState.creatures[2],
      id: 1,
      initiative: undefined,
    };
    resetCreature.mockReturnValueOnce(resetCreature1).mockReturnValueOnce(resetCreature2);
    const expected = {
      creatures: [
        resetCreature1,
        resetCreature2,
      ],
    };

    expect(resetBattle(defaultState)).toMatchObject(expected);
    expect(resetCreature).toHaveBeenCalledTimes(2);
  });

  test('resets the battle state, keeping the battleId', () => {
    const expected = {
      battleId: '123',
    };

    expect(resetBattle(defaultState)).toMatchObject(expected);
  });

  test('resets the battle state, keeping share enabled', () => {
    const state = { ...defaultState, shareEnabled: true };
    const expected = { shareEnabled: true };
    expect(resetBattle(state)).toMatchObject(expected);
  });

  test('resets the battle state, keeping battleCreated', () => {
    const state = { ...defaultState, battleCreated: true };
    const expected = { battleCreated: true };
    expect(resetBattle(state)).toMatchObject(expected);
  });

  test('resets the battle state, keeping sharedTimestamp', () => {
    const state = { ...defaultState, sharedTimestamp: 1743339621000 };
    const expected = { sharedTimestamp: 1743339621000 };
    expect(resetBattle(state)).toMatchObject(expected);
  });
});

describe('toggleSync', () => {
  it('enables share if it is disabled', () => {
    const state = {
      ...defaultState,
      shareEnabled: false,
    };
    expect(toggleSync(state)).toEqual({
      ...state,
      shareEnabled: true,
      ariaAnnouncements: ['share enabled'],
    });
  });

  it('disables share if it is disabled', () => {
    expect(toggleSync(defaultState)).toEqual({
      ...defaultState,
      shareEnabled: false,
      ariaAnnouncements: ['share disabled'],
    });
  });
});
