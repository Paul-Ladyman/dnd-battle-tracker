import { 
  newBattleState,
  getSecondsElapsed,
  nextInitiative,
  getInitiative,
  removeCreature,
  addCreature
} from './BattleManager';
import { createCreature } from './CreatureManager';

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
      name: 'Goblin',
      initiative: 12,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 1,
      alive: true,
      conditions: [],
      notes: []
    },
    {
      name: 'Goblin 2',
      initiative: 10,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 2,
      alive: true,
      conditions: [],
      notes: []
    }
  ],
  creatureIdCount: 3,
  creatureCount: 3,
  activeCreature: 1,
  round: 1
};

beforeEach(() => {
  createCreature.mockClear();
});

describe('newBattleState', () => {
  test('contains the initial battle state', () => {
    const expected = {
      creatures: [],
      creatureIdCount: 0,
      creatureCount: 0,
      activeCreature: undefined,
      round: 0
    };

    expect(newBattleState).toEqual(expected);
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
      activeCreature: undefined
    };
    const expected = {
      ...defaultState,
      round: 1,
      activeCreature: 0
    };
    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it advances the active creature by 1', () => {
    const state = {
      ...defaultState,
      round: 1,
      activeCreature: 0
    };

    const expected = {
      ...defaultState,
      round: 1,
      activeCreature: 1
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it starts at the top of the next round after all creatures have had their go', () => {
    const state = {
      ...defaultState,
      round: 1,
      activeCreature: 2
    };

    const expected = {
      ...defaultState,
      round: 2,
      activeCreature: 0
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it does nothing if there are no creatures', () => {
    const state = {
      ...defaultState,
      creatures: []
    };

    expect(nextInitiative(state)).toEqual(state);
  });
});

describe('getInitiative', () => {
  test('it gets the name of the currently active creature', () => {
    expect(getInitiative(defaultState)).toEqual('Goblin');
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
      activeCreature: undefined
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
      activeCreature: 0
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
      activeCreature: 0
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
      activeCreature: 1
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
      activeCreature: 1
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
      activeCreature: undefined
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
      creatureIdCount: 4
    };

    expect(addCreature(defaultState, creature)).toEqual(expectedState);
    expect(createCreature).toHaveBeenCalledWith(3, creature);
  });

  test('it sorts creatures by their initiative', () => {
    const creature = {
      name: 'name',
      initiative: 11,
      healthPoints: 10
    };

    const createdCreature = {
      name: 'name',
      initiative: 11,
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
        createdCreature,
        defaultState.creatures[2]
      ],
      creatureCount: 4,
      creatureIdCount: 4
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
      activeCreature: 2
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
    };

    expect(addCreature(state, creature)).toEqual(expectedState);
    expect(createCreature).toHaveBeenCalledWith(3, creature);
  });
});