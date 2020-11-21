import { 
  newBattleState,
  getSecondsElapsed,
  nextInitiative,
  getInitiative,
  nextFocus,
  prevFocus,
  setFocus,
  removeCreature,
  addCreature,
  resetBattle,
  toggleSync
} from './BattleManager';
import { createCreature, validateCreature, resetCreature } from './CreatureManager';

jest.mock('./CreatureManager');

const defaultState = {
  creatures:[
    {
      name: 'Wellby',
      initiative: 13,
      id: 0,
      alive:true,
      conditions: [],
      notes: []
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
      locked: true
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
      locked: true
    }
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
  battleId: '123'
};

beforeEach(() => {
  resetCreature.mockClear();
  createCreature.mockClear();
});

describe('newBattleState', () => {
  test('returns the initial battle state', () => {
    const expected = {
      creatures: [],
      creatureIdCount: 0,
      creatureCount: 0,
      activeCreature: undefined,
      focusedCreature: undefined,
      round: 0,
      ariaAnnouncements: [],
      errors: [],
      createCreatureErrors: {},
      battleCreated: false,
      shareEnabled: false,
      battleId: undefined
    };

    expect(newBattleState).toEqual(expected);
  });
});

describe('resetBattle', () => {
  test('resets to the initial battle state', () => {
    const expected = {
      creatureIdCount: 2,
      creatureCount: 2,
      activeCreature: undefined,
      focusedCreature: undefined,
      round: 0,
      ariaAnnouncements: ['battle reset'],
      errors: [],
      createCreatureErrors: {}
    };

    expect(resetBattle(defaultState)).toMatchObject(expected);
    expect(resetCreature).toHaveBeenCalledTimes(2);
  });

  test('resets the battle state, keeping and resetting locked creatures', () => {
    const resetCreature1 = {
      ...defaultState.creatures[1],
      id: 0,
      initiative: undefined
    };
    const resetCreature2 = {
      ...defaultState.creatures[2],
      id: 1,
      initiative: undefined
    };
    resetCreature.mockReturnValueOnce(resetCreature1).mockReturnValueOnce(resetCreature2);
    const expected = {
      creatures: [
        resetCreature1,
        resetCreature2
      ],
    };

    expect(resetBattle(defaultState)).toMatchObject(expected);
    expect(resetCreature).toHaveBeenCalledTimes(2);
  }); 

  test('resets the battle state, keeping the battleId', () => {
    const expected = {
      battleId: '123'
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

describe('getSecondsElapsed', () => {
  test('returns the seconds elapsed up to but not including the current round', () => {
    const state = {
      round: 2
    };
    const result = getSecondsElapsed(state);
    expect(result).toBe(6);
  });

  test('returns 0 seconds for round 1', () => {
    const state = {
      round: 1
    };
    const result = getSecondsElapsed(state);
    expect(result).toBe(0);
  });

  test('returns 0 seconds for round 0', () => {
    const state = {
      round: 0
    };
    const result = getSecondsElapsed(state);
    expect(result).toBe(0);
  });

  test('returns 0 seconds for an invalid round', () => {
    const state = {
      round: -1
    };
    const result = getSecondsElapsed(state);
    expect(result).toBe(0);
  });

  test('returns 0 seconds when round is not specified', () => {
    const state = {};
    const result = getSecondsElapsed(state);
    expect(result).toBe(0);
  });
});

describe('nextInitiative', () => {
  test('it starts the first round with the first creature in the list', () => {
    const state = {
      ...defaultState,
      round: 0,
      activeCreature: undefined,
      focusedCreature: undefined
    };
    const expected = {
      ...defaultState,
      round: 1,
      activeCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Wellby\'s go']
    };
    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it sorts creatures by their initiative', () => {
    const state = {
      ...defaultState,
      creatures: [
        ...defaultState.creatures,
        {
          name: 'Droop',
          initiative: 15,
          healthPoints: 10,
          maxHealthPoints: 10,
          id: 3,
          alive: true,
          conditions: [],
          notes: []
        }
      ],
      round: 0,
      activeCreature: undefined,
      focusedCreature: undefined
    };
    const expected = {
      ...defaultState,
      creatures: [
        {
          name: 'Droop',
          initiative: 15,
          healthPoints: 10,
          maxHealthPoints: 10,
          id: 3,
          alive: true,
          conditions: [],
          notes: []
        },
        ...defaultState.creatures
      ],
      round: 1,
      activeCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Droop\'s go']
    };
    expect(nextInitiative(state)).toEqual(expected);
  });

  test('announces if the active creature is dead', () => {
    const state = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[0],
          alive: false
        },
        defaultState.creatures[1],
        defaultState.creatures[2],
      ],
      round: 0,
      activeCreature: undefined,
      focusedCreature: undefined
    };
    const expected = {
      ...state,
      round: 1,
      activeCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Wellby\'s go. Wellby is dead/unconscious']
    };
    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it advances the active creature by 1', () => {
    const state = {
      ...defaultState,
      round: 1,
      activeCreature: 0,
      focusedCreature: 0
    };

    const expected = {
      ...defaultState,
      round: 1,
      activeCreature: 1,
      focusedCreature: 1,
      ariaAnnouncements: ['its Goblin #1\'s go']
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it advances the active creature by 1 after sorting creatures', () => {
    const state = {
      ...defaultState,
      creatures: [
        ...defaultState.creatures,
        {
          name: 'Droop',
          initiative: 15,
          healthPoints: 10,
          maxHealthPoints: 10,
          id: 3,
          alive: true,
          conditions: [],
          notes: []
        }
      ],
      round: 1,
      activeCreature: 0,
      focusedCreature: 0
    };

    const expected = {
      ...defaultState,
      creatures: [
        {
          name: 'Droop',
          initiative: 15,
          healthPoints: 10,
          maxHealthPoints: 10,
          id: 3,
          alive: true,
          conditions: [],
          notes: []
        },
        ...defaultState.creatures
      ],
      round: 1,
      activeCreature: 2,
      focusedCreature: 2,
      ariaAnnouncements: ['its Goblin #1\'s go']
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it resets the focused creature if it has been changed', () => {
    const state = {
      ...defaultState,
      round: 1,
      activeCreature: 0,
      focusedCreature: 2
    };

    const expected = {
      ...defaultState,
      round: 1,
      activeCreature: 1,
      focusedCreature: 1,
      ariaAnnouncements: ['its Goblin #1\'s go']
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it starts at the top of the next round after all creatures have had their go', () => {
    const state = {
      ...defaultState,
      round: 1,
      activeCreature: 2,
      focusedCreature: 2
    };

    const expected = {
      ...defaultState,
      round: 2,
      activeCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Wellby\'s go']
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it does nothing if there are no creatures', () => {
    const state = {
      ...defaultState,
      creatures: [],
      ariaAnnouncements: []
    };

    expect(nextInitiative(state)).toEqual(state);
  });

  test('sets an error and does not continue if a creature is missing initiative', () => {
    const state = {
      ...defaultState,
      creatures: [
        ...defaultState.creatures,
        {
          name: 'Droop',
          healthPoints: 10,
          maxHealthPoints: 10,
          id: 3,
          alive: true,
          conditions: [],
          notes: []
        }
      ],
      round: 0,
      activeCreature: undefined,
      focusedCreature: undefined
    };
    const expected = {
      ...state,
      ariaAnnouncements: ['Cannot continue battle. Droop has no initiative.'],
      errors: ['Cannot continue battle; Droop has no initiative.'],
    };
    expect(nextInitiative(state)).toEqual(expected);
  });

  test('clears existing errors before adding new ones', () => {
    const state = {
      ...defaultState,
      creatures: [
        ...defaultState.creatures,
        {
          name: 'Droop',
          healthPoints: 10,
          maxHealthPoints: 10,
          id: 3,
          alive: true,
          conditions: [],
          notes: []
        }
      ],
      errors: ['some error'],
      round: 0,
      activeCreature: undefined,
      focusedCreature: undefined
    };
    const expected = {
      ...state,
      ariaAnnouncements: ['Cannot continue battle. Droop has no initiative.'],
      errors: ['Cannot continue battle; Droop has no initiative.'],
    };
    expect(nextInitiative(state)).toEqual(expected);
  });

  test('clears existing errors when advancing to next initiative', () => {
    const state = {
      ...defaultState,
      creatures: [
        ...defaultState.creatures,
        {
          name: 'Droop',
          initiative: 1,
          healthPoints: 10,
          maxHealthPoints: 10,
          id: 3,
          alive: true,
          conditions: [],
          notes: []
        }
      ],
      errors: ['some error'],
      round: 0,
      activeCreature: undefined,
      focusedCreature: undefined
    };
    const expected = {
      ...state,
      round: 1,
      activeCreature: 0,
      focusedCreature: 0,
      errors: [],
      ariaAnnouncements: ['its Wellby\'s go']
    };
    expect(nextInitiative(state)).toEqual(expected);
  });
});

describe('getInitiative', () => {
  test('it gets the name of the currently active creature', () => {
    expect(getInitiative(defaultState)).toEqual('Goblin #1');
  });

  test('it returns an empty string if there are no creatures', () => {
    const state = {
      ...defaultState,
      creatures: []
    }
    expect(getInitiative(state)).toEqual('');
  });

  test('it returns an empty string if the battle has not started', () => {
    const state = {
      ...defaultState,
      round: 0
    }
    expect(getInitiative(state)).toEqual('');
  });
});

describe('nextFocus', () => {
  test('it starts with the first creature in the list', () => {
    const state = {
      ...defaultState,
      focusedCreature: undefined
    };
    const expected = {
      ...defaultState,
      focusedCreature: 0
    };
    expect(nextFocus(state)).toEqual(expected);
  });

  test('it advances the focused creature by 1', () => {
    const state = {
      ...defaultState,
      focusedCreature: 0
    };

    const expected = {
      ...defaultState,
      focusedCreature: 1
    };

    expect(nextFocus(state)).toEqual(expected);
  });

  test('it starts at the first creature after all creatures have been focused', () => {
    const state = {
      ...defaultState,
      focusedCreature: 2
    };

    const expected = {
      ...defaultState,
      focusedCreature: 0
    };

    expect(nextFocus(state)).toEqual(expected);
  });

  test('it does nothing if there are no creatures', () => {
    const state = {
      ...defaultState,
      creatures: []
    };

    expect(nextFocus(state)).toEqual(state);
  });
});

describe('prevFocus', () => {
  test('it starts with the last creature in the list', () => {
    const state = {
      ...defaultState,
      focusedCreature: undefined
    };
    const expected = {
      ...defaultState,
      focusedCreature: 2
    };
    expect(prevFocus(state)).toEqual(expected);
  });

  test('it reduces the focused creature by 1', () => {
    const state = {
      ...defaultState,
      focusedCreature: 1
    };

    const expected = {
      ...defaultState,
      focusedCreature: 0
    };

    expect(prevFocus(state)).toEqual(expected);
  });

  test('it returns to the last creature after all creatures have been focused in reverse', () => {
    const state = {
      ...defaultState,
      focusedCreature: 0
    };

    const expected = {
      ...defaultState,
      focusedCreature: 2
    };

    expect(prevFocus(state)).toEqual(expected);
  });

  test('it does nothing if there are no creatures', () => {
    const state = {
      ...defaultState,
      creatures: []
    };

    expect(prevFocus(state)).toEqual(state);
  });
});

describe('setFocus', () => {
  it('sets the focus to the index of the creature provided', () => {
    const expected = {
      ...defaultState,
      focusedCreature: 2
    };

    expect(setFocus(defaultState, defaultState.creatures[2])).toEqual(expected);
  });

  it('sets the focus to the first creature if the provided creature does not exist', () => {
    const expected = {
      ...defaultState,
      focusedCreature: 0
    };

    expect(setFocus(defaultState, {id: 3})).toEqual(expected);
  });
});

describe('removeCreature', () => {
  test('returns the new state when the battle has not yet started', () => {
    const state = {
      ...defaultState,
      activeCreature: undefined,
      round: 0
    };

    const expected = {
      ...state,
      creatures: [
        state.creatures[0],
        state.creatures[2]
      ],
      creatureCount: 2,
      activeCreature: undefined,
      ariaAnnouncements: ['creature removed from battle']
    };

    const result = removeCreature(state, 1);
    expect(result).toEqual(expected);
  });

  test('returns the new state when the first creature is active', () => {
    const state = {
      ...defaultState,
      activeCreature: 0
    };

    const expected = {
      ...state,
      creatures: [
        state.creatures[0],
        state.creatures[2]
      ],
      creatureCount: 2,
      activeCreature: 0,
      ariaAnnouncements: ['creature removed from battle']
    };
    const result = removeCreature(state, 1);
    expect(result).toEqual(expected);
  });

  test('returns the new state when the creature before the active creature is removed', () => {
    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[1],
        defaultState.creatures[2]
      ],
      creatureCount: 2,
      activeCreature: 0,
      ariaAnnouncements: ['creature removed from battle']
    };
    const result = removeCreature(defaultState, 0);
    expect(result).toEqual(expected);
  });
  
  test('returns the new state when the active creature is removed', () => {
    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        defaultState.creatures[2]
      ],
      creatureCount: 2,
      activeCreature: 1,
      ariaAnnouncements: ['creature removed from battle']
    };
    const result = removeCreature(defaultState, 1);
    expect(result).toEqual(expected);
  });

  test('returns the new state when the creature after the active creature is removed', () => {
    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        defaultState.creatures[1]
      ],
      creatureCount: 2,
      activeCreature: 1,
      ariaAnnouncements: ['creature removed from battle']
    };
    const result = removeCreature(defaultState, 2);
    expect(result).toEqual(expected);
  });

  test('returns the new state when the last creature is removed', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0]
      ],
      activeCreature: 0,
      creatureCount: 1
    };
    const expected = {
      ...state,
      creatures: [],
      creatureCount: 0,
      activeCreature: undefined,
      ariaAnnouncements: ['creature removed from battle']
    };
    const result = removeCreature(state, 0);
    expect(result).toEqual(expected);
  });

  test('returns the current state if it is not valid', () => {
    const state = { not: 'valid'};
    const result = removeCreature(state, 0);
    expect(result).toEqual(state);
  });
});

describe('addCreature', () => {
  test('it creates a creature, adds it to the list and increments relevant counts', () => {
    const creature = {
      name: 'name',
      initiative: 9,
      healthPoints: 10
    };

    const createdCreature = {
      name: 'name',
      initiative: 9,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 3,
      alive: true,
      conditions: [],
      notes: []
    };

    createCreature.mockReturnValue(createdCreature);

    const expectedState = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        defaultState.creatures[1],
        defaultState.creatures[2],
        createdCreature
      ],
      creatureCount: 4,
      creatureIdCount: 4,
      ariaAnnouncements: ['name added']
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
    expect(createCreature).toHaveBeenCalledWith(3, creature);
  });

  test('it sorts creatures by their initiative', () => {
    const creature = {
      name: 'name',
      initiative: 5,
      healthPoints: 10
    };

    const createdCreature = {
      name: 'name',
      initiative: 5,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 3,
      alive: true,
      conditions: [],
      notes: []
    };

    createCreature.mockReturnValue(createdCreature);

    const expectedState = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        defaultState.creatures[1],
        defaultState.creatures[2],
        createdCreature
      ],
      creatureCount: 4,
      creatureIdCount: 4,
      ariaAnnouncements: ['name added']
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
    expect(createCreature).toHaveBeenCalledWith(3, creature);
  });

  test('it keeps the currently active creature', () => {
    const creature = {
      name: 'name',
      initiative: 15,
      healthPoints: 10
    };

    const createdCreature = {
      name: 'name',
      initiative: 15,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 3,
      alive: true,
      conditions: [],
      notes: []
    };

    createCreature.mockReturnValue(createdCreature);

    const expectedState = {
      ...defaultState,
      creatures: [
        createdCreature,
        defaultState.creatures[0],
        defaultState.creatures[1],
        defaultState.creatures[2]
      ],
      creatureCount: 4,
      creatureIdCount: 4,
      activeCreature: 2,
      ariaAnnouncements: ['name added']
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
    expect(createCreature).toHaveBeenCalledWith(3, creature);
  });

  test('it does not change the active creature if the battle has not begun', () => {
    const creature = {
      name: 'name',
      initiative: 15,
      healthPoints: 10
    };

    const createdCreature = {
      name: 'name',
      initiative: 15,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 3,
      alive: true,
      conditions: [],
      notes: []
    };

    createCreature.mockReturnValue(createdCreature);

    const state = {
      ...defaultState,
      round: 0,
      activeCreature: 0
    }

    const expectedState = {
      ...state,
      creatures: [
        createdCreature,
        defaultState.creatures[0],
        defaultState.creatures[1],
        defaultState.creatures[2]
      ],
      creatureCount: 4,
      creatureIdCount: 4,
      ariaAnnouncements: ['name added']
    };

    expect(addCreature(state, creature)).toEqual(expectedState);
    expect(createCreature).toHaveBeenCalledWith(3, creature);
  });

  test('it creates multiple creatures at once based on a multiplier', () => {
    const creature = {
      name: 'name',
      initiative: 9,
      healthPoints: 10,
      multiplier: 2
    };

    const createdCreature = {
      name: 'name #1',
      initiative: 9,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 3,
      alive: true,
      conditions: [],
      notes: []
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
        createdCreature2
      ],
      creatureCount: 5,
      creatureIdCount: 5,
      ariaAnnouncements: ['creatures added']
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
    expect(createCreature.mock.calls.length).toBe(2)
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
      multiplier: 2
    };

    const createdCreature = {
      name: 'goblin #5',
      initiative: 9,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 5,
      alive: true,
      conditions: [],
      notes: []
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
      notes: []
    };
    const initialCreature2 = { ...initialCreature, name: 'goblin#4', id: 4 };

    const initialState = {
      ...defaultState,
      creatures: [
        initialCreature,
        initialCreature2,
        ...defaultState.creatures
      ],
      creatureCount: 5,
      creatureIdCount: 5,
    }

    const expectedState = {
      ...initialState,
      creatures: [
        ...initialState.creatures,
        createdCreature,
        createdCreature2
      ],
      creatureCount: 7,
      creatureIdCount: 7,
      ariaAnnouncements: ['creatures added']
    };

    expect(addCreature(initialState, creature)).toEqual(expectedState);
    expect(createCreature.mock.calls.length).toBe(2)
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
      multiplier: 2
    };

    validateCreature.mockReturnValue({nameError: 'some error'});

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['Failed to create creature. some error'],
      errors: ['Failed to create creature. Create creature form is invalid.'],
      createCreatureErrors: {nameError: 'some error'}
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
  });

  test('resets all errors if a creature is valid', () => {
    const creature = {
      name: 'name',
      initiative: 9,
      healthPoints: 10,
      multiplier: 2
    };

    validateCreature.mockReturnValue(undefined);

    const state = {
      ...defaultState,
      createCreatureErrors: {nameError: 'some error'},
      errors: ['create creature error']
    }

    const result = addCreature(state, creature);
    expect(result.createCreatureErrors).toEqual(defaultState.createCreatureErrors);
    expect(result.errors).toEqual(defaultState.errors);
  });
});

describe('toggleSync', () => {
  it('enables share if it is disabled', () => {
    expect(toggleSync(defaultState)).toEqual({ ...defaultState, shareEnabled: true });
  });

  it('disables share if it is disabled', () => {
    const state = { ...defaultState, shareEnabled: true };
    expect(toggleSync(state)).toEqual({ ...state, shareEnabled: false });
  });
});