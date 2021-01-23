import {
  nextInitiative,
  getInitiative,
  sortByInitiative,
} from './InitiativeManager';

const defaultState = {
  creatures: [
    {
      name: 'Wellby',
      initiative: 13,
      id: 0,
      alive: true,
      conditions: [],
      notes: [],
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

describe('nextInitiative', () => {
  test('it starts the first round with the first creature in the list', () => {
    const state = {
      ...defaultState,
      round: 0,
      activeCreature: undefined,
      focusedCreature: undefined,
    };
    const expected = {
      ...defaultState,
      round: 1,
      activeCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Wellby\'s go'],
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
          notes: [],
        },
      ],
      round: 0,
      activeCreature: undefined,
      focusedCreature: undefined,
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
          notes: [],
        },
        ...defaultState.creatures,
      ],
      round: 1,
      activeCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Droop\'s go'],
    };
    expect(nextInitiative(state)).toEqual(expected);
  });

  test('announces if the active creature is dead', () => {
    const state = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[0],
          alive: false,
        },
        defaultState.creatures[1],
        defaultState.creatures[2],
      ],
      round: 0,
      activeCreature: undefined,
      focusedCreature: undefined,
    };
    const expected = {
      ...state,
      round: 1,
      activeCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Wellby\'s go. Wellby is dead/unconscious'],
    };
    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it advances the active creature by 1', () => {
    const state = {
      ...defaultState,
      round: 1,
      activeCreature: 0,
      focusedCreature: 0,
    };

    const expected = {
      ...defaultState,
      round: 1,
      activeCreature: 1,
      focusedCreature: 1,
      ariaAnnouncements: ['its Goblin #1\'s go'],
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
          notes: [],
        },
      ],
      round: 1,
      activeCreature: 0,
      focusedCreature: 0,
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
          notes: [],
        },
        ...defaultState.creatures,
      ],
      round: 1,
      activeCreature: 2,
      focusedCreature: 2,
      ariaAnnouncements: ['its Goblin #1\'s go'],
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it resets the focused creature if it has been changed', () => {
    const state = {
      ...defaultState,
      round: 1,
      activeCreature: 0,
      focusedCreature: 2,
    };

    const expected = {
      ...defaultState,
      round: 1,
      activeCreature: 1,
      focusedCreature: 1,
      ariaAnnouncements: ['its Goblin #1\'s go'],
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it starts at the top of the next round after all creatures have had their go', () => {
    const state = {
      ...defaultState,
      round: 1,
      activeCreature: 2,
      focusedCreature: 2,
    };

    const expected = {
      ...defaultState,
      round: 2,
      activeCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Wellby\'s go'],
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  test('it does nothing if there are no creatures', () => {
    const state = {
      ...defaultState,
      creatures: [],
      ariaAnnouncements: [],
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
          notes: [],
        },
      ],
      round: 0,
      activeCreature: undefined,
      focusedCreature: undefined,
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
          notes: [],
        },
      ],
      errors: ['some error'],
      round: 0,
      activeCreature: undefined,
      focusedCreature: undefined,
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
          notes: [],
        },
      ],
      errors: ['some error'],
      round: 0,
      activeCreature: undefined,
      focusedCreature: undefined,
    };
    const expected = {
      ...state,
      round: 1,
      activeCreature: 0,
      focusedCreature: 0,
      errors: [],
      ariaAnnouncements: ['its Wellby\'s go'],
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
      creatures: [],
    };
    expect(getInitiative(state)).toEqual('');
  });

  test('it returns an empty string if the battle has not started', () => {
    const state = {
      ...defaultState,
      round: 0,
    };
    expect(getInitiative(state)).toEqual('');
  });
});

describe('sortByInitiative', () => {
  it('sorts out of order creatures by their initiative, maintaining the active creature', () => {
    const creatures = [
      {
        ...defaultState.creatures[0],
        initiative: 1,
      },
      {
        ...defaultState.creatures[1],
        initiative: 3,
      },
      {
        ...defaultState.creatures[2],
        initiative: 2,
      },
    ];

    const expectedCreatures = [
      creatures[1],
      creatures[2],
      creatures[0],
    ];

    expect(sortByInitiative(creatures, 1, 1)).toEqual([expectedCreatures, 0]);
  });

  it('does not change the active creature after sorting if combat as not started yet', () => {
    const creatures = [
      {
        ...defaultState.creatures[0],
        initiative: 1,
      },
      {
        ...defaultState.creatures[1],
        initiative: 3,
      },
      {
        ...defaultState.creatures[2],
        initiative: 2,
      },
    ];

    const expectedCreatures = [
      creatures[1],
      creatures[2],
      creatures[0],
    ];

    const result = sortByInitiative(expectedCreatures, undefined, 0);
    expect(result).toEqual([expectedCreatures, undefined]);
  });
});
