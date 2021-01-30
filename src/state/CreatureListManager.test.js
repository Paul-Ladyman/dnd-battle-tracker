import { createCreature, validateCreature } from './CreatureManager';
import { removeCreature, addCreature, getCreatureList } from './CreatureListManager';

jest.mock('./CreatureManager');

beforeEach(() => {
  createCreature.mockClear();
  validateCreature.mockClear();
});

const defaultState = {
  creatures: [
    {
      name: 'Wellby',
      initiative: 13,
      id: 0,
      alive: true,
      conditions: [],
      notes: [],
      locked: true,
      shared: true,
    },
    {
      name: 'Goblin #1',
      initiative: 12,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 1,
      alive: true,
      conditions: [],
      notes: [],
      locked: true,
      shared: false,
    },
    {
      name: 'Goblin #2',
      initiative: 12,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 2,
      alive: true,
      conditions: [],
      notes: [],
      locked: true,
      shared: true,
    },
  ],
  creatureIdCount: 3,
  creatureCount: 3,
  activeCreature: 1,
  focusedCreature: 1,
  round: 1,
  ariaAnnouncements: [],
  errors: [],
  createCreatureErrors: {},
  battleCreated: false,
  shareEnabled: false,
  battleId: '123',
};

describe('removeCreature', () => {
  test('returns the new state when the battle has not yet started', () => {
    const state = {
      ...defaultState,
      activeCreature: undefined,
      round: 0,
    };

    const expected = {
      ...state,
      creatures: [
        state.creatures[0],
        state.creatures[2],
      ],
      creatureCount: 2,
      activeCreature: undefined,
      ariaAnnouncements: ['creature removed from battle'],
    };

    const result = removeCreature(state, 1);
    expect(result).toEqual(expected);
  });

  test('returns the new state when the first creature is active', () => {
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
      creatureCount: 2,
      activeCreature: 0,
      ariaAnnouncements: ['creature removed from battle'],
    };
    const result = removeCreature(state, 1);
    expect(result).toEqual(expected);
  });

  test('returns the new state when the creature before the active creature is removed', () => {
    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[1],
        defaultState.creatures[2],
      ],
      creatureCount: 2,
      activeCreature: 0,
      ariaAnnouncements: ['creature removed from battle'],
    };
    const result = removeCreature(defaultState, 0);
    expect(result).toEqual(expected);
  });

  test('returns the new state when the active creature is removed', () => {
    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        defaultState.creatures[2],
      ],
      creatureCount: 2,
      activeCreature: 1,
      ariaAnnouncements: ['creature removed from battle'],
    };
    const result = removeCreature(defaultState, 1);
    expect(result).toEqual(expected);
  });

  test('returns the new state when the creature after the active creature is removed', () => {
    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        defaultState.creatures[1],
      ],
      creatureCount: 2,
      activeCreature: 1,
      ariaAnnouncements: ['creature removed from battle'],
    };
    const result = removeCreature(defaultState, 2);
    expect(result).toEqual(expected);
  });

  test('returns the new state when the last creature is removed', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
      ],
      activeCreature: 0,
      creatureCount: 1,
    };
    const expected = {
      ...state,
      creatures: [],
      creatureCount: 0,
      activeCreature: undefined,
      ariaAnnouncements: ['creature removed from battle'],
    };
    const result = removeCreature(state, 0);
    expect(result).toEqual(expected);
  });

  test('returns the current state if it is not valid', () => {
    const state = { not: 'valid' };
    const result = removeCreature(state, 0);
    expect(result).toEqual(state);
  });
});

describe('addCreature', () => {
  test('it creates a creature, adds it to the list and increments relevant counts', () => {
    const creature = {
      name: 'name',
      initiative: 9,
      healthPoints: 10,
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
      creatureCount: 4,
      creatureIdCount: 4,
      ariaAnnouncements: ['name added'],
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
    expect(createCreature).toHaveBeenCalledWith(3, creature);
  });

  test('it sorts creatures by their initiative', () => {
    const creature = {
      name: 'name',
      initiative: 5,
      healthPoints: 10,
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
      creatureCount: 4,
      creatureIdCount: 4,
      ariaAnnouncements: ['name added'],
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
    expect(createCreature).toHaveBeenCalledWith(3, creature);
  });

  test('it keeps the currently active creature', () => {
    const creature = {
      name: 'name',
      initiative: 15,
      healthPoints: 10,
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

    const expectedState = {
      ...defaultState,
      creatures: [
        createdCreature,
        defaultState.creatures[0],
        defaultState.creatures[1],
        defaultState.creatures[2],
      ],
      creatureCount: 4,
      creatureIdCount: 4,
      activeCreature: 2,
      ariaAnnouncements: ['name added'],
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
    expect(createCreature).toHaveBeenCalledWith(3, creature);
  });

  test('it does not change the active creature if the battle has not begun', () => {
    const creature = {
      name: 'name',
      initiative: 15,
      healthPoints: 10,
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
      creatureCount: 4,
      creatureIdCount: 4,
      ariaAnnouncements: ['name added'],
    };

    expect(addCreature(state, creature)).toEqual(expectedState);
    expect(createCreature).toHaveBeenCalledWith(3, creature);
  });

  test('it creates multiple creatures at once based on a multiplier', () => {
    const creature = {
      name: 'name',
      initiative: 9,
      healthPoints: 10,
      multiplier: 2,
    };

    const createdCreature = {
      name: 'name #1',
      initiative: 9,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 3,
      alive: true,
      conditions: [],
      notes: [],
    };
    const createdCreature2 = { ...createdCreature, name: 'name #2', id: 4 };

    createCreature
      .mockReturnValueOnce(createdCreature)
      .mockReturnValueOnce(createdCreature2);

    const expectedState = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        defaultState.creatures[1],
        defaultState.creatures[2],
        createdCreature,
        createdCreature2,
      ],
      creatureCount: 5,
      creatureIdCount: 5,
      ariaAnnouncements: ['creatures added'],
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
    expect(createCreature.mock.calls.length).toBe(2);
    const expectedCreature1 = {
      name: 'name',
      number: 1,
      initiative: 9,
      healthPoints: 10,
    };
    const expectedCreature2 = {
      name: 'name',
      number: 2,
      initiative: 9,
      healthPoints: 10,
    };
    expect(createCreature).toHaveBeenCalledWith(3, expectedCreature1);
    expect(createCreature).toHaveBeenCalledWith(4, expectedCreature2);
  });

  test('it adds multiple creatures to an existing group based on a multiplier', () => {
    const creature = {
      name: 'Goblin',
      initiative: 9,
      healthPoints: 10,
      multiplier: 2,
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
      creatureCount: 5,
      creatureIdCount: 5,
    };

    const expectedState = {
      ...initialState,
      creatures: [
        ...initialState.creatures,
        createdCreature,
        createdCreature2,
      ],
      creatureCount: 7,
      creatureIdCount: 7,
      ariaAnnouncements: ['creatures added'],
    };

    expect(addCreature(initialState, creature)).toEqual(expectedState);
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

  test('does not add a creature if it is not valid', () => {
    const creature = {
      name: '',
      initiative: 9,
      healthPoints: 10,
      multiplier: 2,
    };

    validateCreature.mockReturnValue({ nameError: 'some error' });

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['Failed to create creature. some error'],
      errors: ['Failed to create creature. Create creature form is invalid.'],
      createCreatureErrors: { nameError: 'some error' },
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
  });

  test('resets all errors if a creature is valid', () => {
    const creature = {
      name: 'name',
      initiative: 9,
      healthPoints: 10,
      multiplier: 2,
    };

    validateCreature.mockReturnValue(undefined);

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
