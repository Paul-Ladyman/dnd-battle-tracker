import { 
  removeCreature,
  killCreature,
  reviveCreature,
  damageCreature,
  healCreature
} from './CreatureManager';

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
      initiative: 10,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 1,
      alive: true,
      conditions: [],
      notes: []
    },
    {
      name: 'Goblin 2',
      initiative: 12,
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

describe('killCreature', () => {
  test('it kills a creature', () => {
    const expected = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[0],
          alive: false
        },
        defaultState.creatures[1],
        defaultState.creatures[2]
      ]
    };

    const result = killCreature(defaultState, 0);
    expect(result).toEqual(expected);
  });
  
  test('it kills a creature and sets its health points to 0 if it has them', () => {
    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          alive: false,
          healthPoints: 0
        },
        defaultState.creatures[2]
      ]
    };

    const result = killCreature(defaultState, 1);
    expect(result).toEqual(expected);
  });
});

describe('reviveCreature', () => {
  test('it revives a creature who is dead with 0 hit points', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          alive: false,
          healthPoints: 0
        },
        defaultState.creatures[2]
      ]
    };

    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          alive: true,
          healthPoints: 0
        },
        defaultState.creatures[2]
      ]
    };

    expect(reviveCreature(state, 1)).toEqual(expected);
  });

  test('it revives a creature who is dead with no hit points', () => {
    const state = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[0],
          alive: false
        },
        defaultState.creatures[1],
        defaultState.creatures[2]
      ]
    };

    const expected = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[0],
          alive: true
        },
        defaultState.creatures[1],
        defaultState.creatures[2]
      ]
    };

    expect(reviveCreature(state, 0)).toEqual(expected);
  });

  test('it revives a creature who is already alive', () => {
    expect(reviveCreature(defaultState, 0)).toEqual(defaultState);
  });
});

describe('damageCreature', () => {
  test('it does nothing if a creature has no health points', () => {
    expect(damageCreature(defaultState, 0, 5)).toEqual(defaultState);
  });

  test('it does nothing to an already dead creature', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          healthPoints: 0,
          alive: false
        },
        defaultState.creatures[2]
      ]
    };

    expect(damageCreature(state, 1, 5)).toEqual(state);
  });

  test('it removes health points from a creature', () => {
    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          healthPoints: 5
        },
        defaultState.creatures[2]
      ]
    };

    expect(damageCreature(defaultState, 1, 5)).toEqual(expected);
  });

  test('it kills a creature if it drops to 0 health points', () => {
    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          healthPoints: 0,
          alive: false
        },
        defaultState.creatures[2]
      ]
    };

    expect(damageCreature(defaultState, 1, 10)).toEqual(expected);
  });

  test('it kills a creature and sets its HP to 0 if it drops below 0 health points', () => {
    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          healthPoints: 0,
          alive: false
        },
        defaultState.creatures[2]
      ]
    };

    expect(damageCreature(defaultState, 1, 100)).toEqual(expected);
  });
});

describe('healCreature', () => {
  test('it does nothing if a creature has no health points', () => {
    expect(healCreature(defaultState, 0, 5)).toEqual(defaultState);
  });

  test('it does nothing to a fully healed creature', () => {
    expect(healCreature(defaultState, 1, 5)).toEqual(defaultState);
  });

  test('it adds health points to a creature', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          healthPoints: 5
        },
        defaultState.creatures[2]
      ]
    };

    expect(healCreature(state, 1, 5)).toEqual(defaultState);
  });

  test('it does not exceed a creature\'s maximum health points', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          healthPoints: 5
        },
        defaultState.creatures[2]
      ]
    };

    expect(healCreature(state, 1, 10)).toEqual(defaultState);
  });

  test('it revives a creature if it was dead', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          healthPoints: 0,
          alive: false
        },
        defaultState.creatures[2]
      ]
    };

    const expected = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          healthPoints: 1,
          alive: true
        },
        defaultState.creatures[2]
      ]
    };

    expect(healCreature(state, 1, 1)).toEqual(expected);
  });
});