import {
  newBattleState,
  nextFocus,
  prevFocus,
  setFocus,
  resetBattle,
  toggleSync,
} from './BattleManager';
import { resetCreature } from './CreatureManager';
import defaultState from '../../test/fixtures/battle';

jest.mock('./CreatureManager');

beforeEach(() => {
  resetCreature.mockClear();
});

describe('newBattleState', () => {
  test('returns the initial battle state', () => {
    const expected = {
      creatures: [],
      creatureIdCount: 0,
      activeCreature: null,
      sharedActiveCreature: null,
      focusedCreature: undefined,
      round: 0,
      sharedRound: 0,
      ariaAnnouncements: [],
      errors: [],
      createCreatureErrors: {},
      battleCreated: false,
      shareEnabled: false,
      battleId: undefined,
    };

    expect(newBattleState).toEqual(expected);
  });
});

describe('resetBattle', () => {
  test('resets to the initial battle state', () => {
    const expected = {
      creatureIdCount: 2,
      activeCreature: null,
      sharedActiveCreature: null,
      focusedCreature: undefined,
      round: 0,
      sharedRound: 0,
      ariaAnnouncements: ['battle reset'],
      errors: [],
      createCreatureErrors: {},
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
});

describe('nextFocus', () => {
  test('it starts with the first creature in the list', () => {
    const state = {
      ...defaultState,
      focusedCreature: undefined,
    };
    const expected = {
      ...defaultState,
      focusedCreature: 0,
    };
    expect(nextFocus(state)).toEqual(expected);
  });

  test('it advances the focused creature by 1', () => {
    const state = {
      ...defaultState,
      focusedCreature: 0,
    };

    const expected = {
      ...defaultState,
      focusedCreature: 1,
    };

    expect(nextFocus(state)).toEqual(expected);
  });

  test('it starts at the first creature after all creatures have been focused', () => {
    const state = {
      ...defaultState,
      focusedCreature: 2,
    };

    const expected = {
      ...defaultState,
      focusedCreature: 0,
    };

    expect(nextFocus(state)).toEqual(expected);
  });

  test('it does nothing if there are no creatures', () => {
    const state = {
      ...defaultState,
      creatures: [],
    };

    expect(nextFocus(state)).toEqual(state);
  });
});

describe('prevFocus', () => {
  test('it starts with the last creature in the list', () => {
    const state = {
      ...defaultState,
      focusedCreature: undefined,
    };
    const expected = {
      ...defaultState,
      focusedCreature: 2,
    };
    expect(prevFocus(state)).toEqual(expected);
  });

  test('it reduces the focused creature by 1', () => {
    const state = {
      ...defaultState,
      focusedCreature: 1,
    };

    const expected = {
      ...defaultState,
      focusedCreature: 0,
    };

    expect(prevFocus(state)).toEqual(expected);
  });

  test('it returns to the last creature after all creatures have been focused in reverse', () => {
    const state = {
      ...defaultState,
      focusedCreature: 0,
    };

    const expected = {
      ...defaultState,
      focusedCreature: 2,
    };

    expect(prevFocus(state)).toEqual(expected);
  });

  test('it does nothing if there are no creatures', () => {
    const state = {
      ...defaultState,
      creatures: [],
    };

    expect(prevFocus(state)).toEqual(state);
  });
});

describe('setFocus', () => {
  it('sets the focus to the index of the creature provided', () => {
    const expected = {
      ...defaultState,
      focusedCreature: 2,
    };

    expect(setFocus(defaultState, defaultState.creatures[2])).toEqual(expected);
  });

  it('sets the focus to the first creature if the provided creature does not exist', () => {
    const expected = {
      ...defaultState,
      focusedCreature: 0,
    };

    expect(setFocus(defaultState, { id: 4 })).toEqual(expected);
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
