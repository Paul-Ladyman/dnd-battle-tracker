import { createCreature } from './CreatureManager';
import { removeCreature, addCreature, getCreatureList } from './CreatureListManager';
import defaultState from '../../test/fixtures/battle';

jest.mock('./CreatureManager');

beforeEach(() => {
  createCreature.mockClear();
});

describe('removeCreature', () => {
  it('returns the new state when the battle has not yet started', () => {
    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        defaultState.creatures[2],
      ],
      ariaAnnouncements: ['creature removed from battle'],
    };

    const result = removeCreature(defaultState, 1);
    expect(result).toEqual(expected);
  });

  it('returns the new state when the first creature is active', () => {
    const state = {
      ...defaultState,
      activeCreature: 0,
    };

    const expected = {
      ...state,
      creatures: [
        state.creatures[0],
        state.creatures[2],
      ],
      ariaAnnouncements: ['creature removed from battle'],
    };
    const result = removeCreature(state, 1);
    expect(result).toEqual(expected);
  });

  it('returns the new state when the creature before the active creature is removed', () => {
    const state = {
      ...defaultState,
      activeCreature: 1,
    };

    const expected = {
      ...state,
      creatures: [
        state.creatures[1],
        state.creatures[2],
      ],
      activeCreature: 0,
      ariaAnnouncements: ['creature removed from battle'],
    };
    const result = removeCreature(state, 0);
    expect(result).toEqual(expected);
  });

  it('returns the new state when the active creature is removed', () => {
    const state = {
      ...defaultState,
      activeCreature: 1,
    };

    const expected = {
      ...state,
      creatures: [
        state.creatures[0],
        state.creatures[2],
      ],
      ariaAnnouncements: ['creature removed from battle'],
    };
    const result = removeCreature(state, 1);
    expect(result).toEqual(expected);
  });

  it('returns the new state when the creature after the active creature is removed', () => {
    const state = {
      ...defaultState,
      activeCreature: 1,
    };

    const expected = {
      ...state,
      creatures: [
        state.creatures[0],
        state.creatures[1],
      ],
      ariaAnnouncements: ['creature removed from battle'],
    };
    const result = removeCreature(state, 2);
    expect(result).toEqual(expected);
  });

  it('returns the new state when the last creature is removed', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
      ],
      activeCreature: 0,
    };
    const expected = {
      ...state,
      creatures: [],
      activeCreature: null,
      ariaAnnouncements: ['creature removed from battle'],
    };
    const result = removeCreature(state, 0);
    expect(result).toEqual(expected);
  });

  it('returns the current state if it is not valid', () => {
    const state = { not: 'valid' };
    const result = removeCreature(state, 0);
    expect(result).toEqual(state);
  });
});

describe('addCreature', () => {
  it('creates a creature, adds it to the list and increments relevant counts', () => {
    const creature = {
      name: 'name',
      initiative: () => 9,
      healthPoints: () => 10,
    };

    const createdCreature = {
      name: 'name',
      initiative: 9,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 3,
      alive: true,
      conditions: [],
      notes: [],
    };

    createCreature.mockReturnValue(createdCreature);

    const expectedState = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        defaultState.creatures[1],
        defaultState.creatures[2],
        createdCreature,
      ],
      creatureIdCount: 4,
      ariaAnnouncements: ['name added'],
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
    const expectedCreature = {
      name: 'name',
      initiative: 9,
      healthPoints: 10,
    };
    expect(createCreature).toHaveBeenCalledWith(3, expectedCreature);
  });

  it('removes focus on a creature if it is set', () => {
    const creature = {
      name: 'name',
      initiative: () => 9,
      healthPoints: () => 10,
    };

    const createdCreature = {
      name: 'name',
      initiative: 9,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 3,
      alive: true,
      conditions: [],
      notes: [],
    };

    createCreature.mockReturnValue(createdCreature);

    const state = {
      ...defaultState,
      focusedCreature: 0,
    };

    const expectedState = {
      ...state,
      creatures: [
        state.creatures[0],
        state.creatures[1],
        state.creatures[2],
        createdCreature,
      ],
      creatureIdCount: 4,
      focusedCreature: undefined,
      ariaAnnouncements: ['name added'],
    };

    expect(addCreature(state, creature)).toEqual(expectedState);
    const expectedCreature = {
      name: 'name',
      initiative: 9,
      healthPoints: 10,
    };
    expect(createCreature).toHaveBeenCalledWith(3, expectedCreature);
  });

  it('sorts creatures by their initiative', () => {
    const creature = {
      name: 'name',
      initiative: () => 5,
      healthPoints: () => 10,
    };

    const createdCreature = {
      name: 'name',
      initiative: 5,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 3,
      alive: true,
      conditions: [],
      notes: [],
    };

    createCreature.mockReturnValue(createdCreature);

    const expectedState = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        defaultState.creatures[1],
        defaultState.creatures[2],
        createdCreature,
      ],
      creatureIdCount: 4,
      ariaAnnouncements: ['name added'],
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
    const expectedCreature = {
      name: 'name',
      initiative: 5,
      healthPoints: 10,
    };

    expect(createCreature).toHaveBeenCalledWith(3, expectedCreature);
  });

  it('keeps the currently active creature', () => {
    const creature = {
      name: 'name',
      initiative: () => 15,
      healthPoints: () => 10,
    };

    const createdCreature = {
      name: 'name',
      initiative: 15,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 4,
      alive: true,
      conditions: [],
      notes: [],
    };

    createCreature.mockReturnValue(createdCreature);

    const state = {
      ...defaultState,
      round: 1,
      activeCreature: 1,
    };

    const expectedState = {
      ...state,
      creatures: [
        createdCreature,
        state.creatures[0],
        state.creatures[1],
        state.creatures[2],
      ],
      creatureIdCount: 4,
      activeCreature: 2,
      ariaAnnouncements: ['name added'],
    };

    expect(addCreature(state, creature)).toEqual(expectedState);
    const expectedCreature = {
      name: 'name',
      initiative: 15,
      healthPoints: 10,
    };
    expect(createCreature).toHaveBeenCalledWith(3, expectedCreature);
  });

  it('does not change the active creature if the battle has not begun', () => {
    const creature = {
      name: 'name',
      initiative: () => 15,
      healthPoints: () => 10,
    };

    const createdCreature = {
      name: 'name',
      initiative: 15,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 3,
      alive: true,
      conditions: [],
      notes: [],
    };

    createCreature.mockReturnValue(createdCreature);

    const state = {
      ...defaultState,
      round: 0,
      activeCreature: 0,
    };

    const expectedState = {
      ...state,
      creatures: [
        createdCreature,
        defaultState.creatures[0],
        defaultState.creatures[1],
        defaultState.creatures[2],
      ],
      creatureIdCount: 4,
      ariaAnnouncements: ['name added'],
    };

    expect(addCreature(state, creature)).toEqual(expectedState);
    const expectedCreature = {
      name: 'name',
      initiative: 15,
      healthPoints: 10,
    };
    expect(createCreature).toHaveBeenCalledWith(3, expectedCreature);
  });

  it('creates multiple creatures at once based on the quantity', () => {
    const initiative = jest.fn()
      .mockReturnValueOnce(9)
      .mockReturnValueOnce(10);

    const healthPoints = jest.fn()
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(5);

    const creature = {
      name: 'name',
      initiative,
      healthPoints,
      quantity: 2,
    };

    const createdCreature = {
      name: 'name #1',
      initiative: 9,
      healthPoints: 4,
      maxHealthPoints: 4,
      id: 3,
      alive: true,
      conditions: [],
      notes: [],
    };

    const createdCreature2 = {
      ...createdCreature,
      initiative: 10,
      healthPoints: 5,
      maxHealthPoints: 5,
      name: 'name #2',
      id: 4,
    };

    createCreature
      .mockReturnValueOnce(createdCreature)
      .mockReturnValueOnce(createdCreature2);

    const expectedState = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        defaultState.creatures[1],
        defaultState.creatures[2],
        createdCreature2,
        createdCreature,
      ],
      creatureIdCount: 5,
      ariaAnnouncements: ['creatures added'],
    };

    const newState = addCreature(defaultState, creature);

    expect(newState).toEqual(expectedState);
    expect(createCreature.mock.calls.length).toBe(2);
    const expectedCreature1 = {
      name: 'name',
      number: 1,
      initiative: 9,
      healthPoints: 4,
    };
    const expectedCreature2 = {
      name: 'name',
      number: 2,
      initiative: 10,
      healthPoints: 5,
    };
    expect(createCreature).toHaveBeenCalledWith(3, expectedCreature1);
    expect(createCreature).toHaveBeenCalledWith(4, expectedCreature2);
  });

  it('adds multiple creatures to an existing group based on the quantity', () => {
    const creature = {
      name: 'Goblin',
      initiative: () => 9,
      healthPoints: () => 10,
      quantity: 2,
    };

    const createdCreature = {
      name: 'goblin #5',
      initiative: 9,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 5,
      alive: true,
      conditions: [],
      notes: [],
    };
    const createdCreature2 = { ...createdCreature, name: 'goblin #6', id: 6 };

    createCreature
      .mockReturnValueOnce(createdCreature)
      .mockReturnValueOnce(createdCreature2);

    const initialCreature = {
      name: 'goblin #3',
      initiative: 15,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 3,
      alive: true,
      conditions: [],
      notes: [],
    };
    const initialCreature2 = { ...initialCreature, name: 'goblin#4', id: 4 };

    const initialState = {
      ...defaultState,
      creatures: [
        initialCreature,
        initialCreature2,
        ...defaultState.creatures,
      ],
      creatureIdCount: 5,
    };

    const expectedState = {
      ...initialState,
      creatures: [
        ...initialState.creatures,
        createdCreature,
        createdCreature2,
      ],
      creatureIdCount: 7,
      ariaAnnouncements: ['creatures added'],
    };

    const newState = addCreature(initialState, creature);

    expect(newState).toEqual(expectedState);
    expect(createCreature.mock.calls.length).toBe(2);
    const expectedCreature1 = {
      name: 'Goblin',
      number: 5,
      initiative: 9,
      healthPoints: 10,
    };
    const expectedCreature2 = {
      name: 'Goblin',
      number: 6,
      initiative: 9,
      healthPoints: 10,
    };
    expect(createCreature).toHaveBeenCalledWith(5, expectedCreature1);
    expect(createCreature).toHaveBeenCalledWith(6, expectedCreature2);
  });

  it('resets all errors', () => {
    const creature = {
      name: 'name',
      initiative: () => 9,
      healthPoints: () => 10,
      quantity: 2,
    };

    const state = {
      ...defaultState,
      createCreatureErrors: { nameError: 'some error' },
      errors: ['create creature error'],
    };

    const result = addCreature(state, creature);
    expect(result.createCreatureErrors).toEqual(defaultState.createCreatureErrors);
    expect(result.errors).toEqual(defaultState.errors);
  });
});

describe('getCreatureList', () => {
  it('returns the creature list and creature count', () => {
    const expected = [defaultState.creatures, 3];
    expect(getCreatureList(defaultState)).toEqual(expected);
  });

  it('returns only shared creatures for a player session', () => {
    const expectedCreatures = [
      defaultState.creatures[0],
      defaultState.creatures[2],
    ];
    const expected = [expectedCreatures, 2];
    expect(getCreatureList(defaultState, true)).toEqual(expected);
  });
});
