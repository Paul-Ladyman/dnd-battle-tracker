import {
  nextInitiative,
  getInitiative,
  getInitiative2,
  sortByInitiative,
  getRound,
} from './InitiativeManager';
import defaultState from '../../test/fixtures/battle';

const droop = {
  name: 'Droop',
  initiative: 15,
  healthPoints: 10,
  maxHealthPoints: 10,
  id: 3,
  alive: true,
  conditions: [],
  notes: [],
  shared: true,
};

describe('nextInitiative', () => {
  it('starts the first round with the first creature in the list', () => {
    const expected = {
      ...defaultState,
      round: 1,
      sharedRound: 1,
      activeCreature: 0,
      sharedActiveCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Wellby\'s go'],
    };
    expect(nextInitiative(defaultState)).toEqual(expected);
  });

  it('does not advance the shared active creature or shared round on the first round if the first creature is not shared', () => {
    const state = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[0],
          shared: false,
        },
        defaultState.creatures[1],
        defaultState.creatures[2],
      ],
    };
    const expected = {
      ...state,
      round: 1,
      activeCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Wellby\'s go'],
    };
    expect(nextInitiative(state)).toEqual(expected);
  });

  it('sorts creatures by their initiative', () => {
    const state = {
      ...defaultState,
      creatures: [
        ...defaultState.creatures,
        droop,
      ],
    };
    const expected = {
      ...defaultState,
      creatures: [
        droop,
        ...defaultState.creatures,
      ],
      round: 1,
      sharedRound: 1,
      activeCreature: 0,
      sharedActiveCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Droop\'s go'],
    };
    expect(nextInitiative(state)).toEqual(expected);
  });

  it('announces if the active creature is dead', () => {
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
    };
    const expected = {
      ...state,
      round: 1,
      sharedRound: 1,
      activeCreature: 0,
      sharedActiveCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Wellby\'s go. Wellby is dead/unconscious'],
    };
    expect(nextInitiative(state)).toEqual(expected);
  });

  it('advances the active creature by 1', () => {
    const state = {
      ...defaultState,
      round: 1,
      activeCreature: 0,
      sharedActiveCreature: 0,
      focusedCreature: 0,
    };

    const expected = {
      ...defaultState,
      round: 1,
      sharedRound: 1,
      activeCreature: 1,
      sharedActiveCreature: 1,
      focusedCreature: 1,
      ariaAnnouncements: ['its Goblin #1\'s go'],
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  it('does not advance the shared active creature if the next creature is not shared', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          shared: false,
        },
        defaultState.creatures[2],
      ],
      round: 1,
      sharedRound: 1,
      activeCreature: 0,
      sharedActiveCreature: 0,
      focusedCreature: 0,
    };

    const expected = {
      ...state,
      round: 1,
      sharedRound: 1,
      activeCreature: 1,
      sharedActiveCreature: 0,
      focusedCreature: 1,
      ariaAnnouncements: ['its Goblin #1\'s go'],
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  it('advances the active creature by 1 after sorting creatures', () => {
    const state = {
      ...defaultState,
      creatures: [
        ...defaultState.creatures,
        droop,
      ],
      round: 1,
      sharedRound: 1,
      activeCreature: 0,
      sharedActiveCreature: 0,
      focusedCreature: 0,
    };

    const expected = {
      ...defaultState,
      creatures: [
        droop,
        ...defaultState.creatures,
      ],
      round: 1,
      sharedRound: 1,
      activeCreature: 2,
      sharedActiveCreature: 2,
      focusedCreature: 2,
      ariaAnnouncements: ['its Goblin #1\'s go'],
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  it('resets the focused creature if it has been changed', () => {
    const state = {
      ...defaultState,
      round: 1,
      sharedRound: 1,
      activeCreature: 0,
      sharedActiveCreature: 0,
      focusedCreature: 2,
    };

    const expected = {
      ...defaultState,
      round: 1,
      sharedRound: 1,
      activeCreature: 1,
      sharedActiveCreature: 1,
      focusedCreature: 1,
      ariaAnnouncements: ['its Goblin #1\'s go'],
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  it('starts at the top of the next round after all creatures have had their turn', () => {
    const state = {
      ...defaultState,
      round: 1,
      sharedRound: 1,
      activeCreature: 2,
      sharedActiveCreature: 2,
      focusedCreature: 2,
    };

    const expected = {
      ...defaultState,
      round: 2,
      sharedRound: 2,
      activeCreature: 0,
      sharedActiveCreature: 0,
      focusedCreature: 0,
      ariaAnnouncements: ['its Wellby\'s go'],
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  it('does not restart the shared active creature or increment shared round if the first creature is not shared', () => {
    const state = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[0],
          shared: false,
        },
        defaultState.creatures[1],
        defaultState.creatures[2],
      ],
      round: 1,
      sharedRound: 1,
      activeCreature: 2,
      sharedActiveCreature: 2,
      focusedCreature: 2,
    };

    const expected = {
      ...state,
      round: 2,
      sharedRound: 1,
      activeCreature: 0,
      sharedActiveCreature: 2,
      focusedCreature: 0,
      ariaAnnouncements: ['its Wellby\'s go'],
    };

    expect(nextInitiative(state)).toEqual(expected);
  });

  it('restarts the shared active creature and increments shared round on the next shared creature from the top', () => {
    const state = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[0],
          shared: false,
        },
        defaultState.creatures[1],
        defaultState.creatures[2],
      ],
      round: 2,
      sharedRound: 1,
      activeCreature: 0,
      sharedActiveCreature: 2,
      focusedCreature: 0,
    };

    const expected = {
      ...state,
      round: 2,
      sharedRound: 2,
      activeCreature: 1,
      sharedActiveCreature: 1,
      focusedCreature: 1,
      ariaAnnouncements: ['its Goblin #1\'s go'],
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
    };
    const expected = {
      ...state,
      round: 1,
      sharedRound: 1,
      activeCreature: 0,
      sharedActiveCreature: 0,
      focusedCreature: 0,
      errors: [],
      ariaAnnouncements: ['its Wellby\'s go'],
    };
    expect(nextInitiative(state)).toEqual(expected);
  });
});

describe('getInitiative', () => {
  it('gets the name and id of the currently active creature for a DM session', () => {
    const state = {
      ...defaultState,
      activeCreature: 1,
      sharedActiveCreature: 0,
      round: 1,
    };
    expect(getInitiative(state)).toEqual(['Goblin #1', 2]);
  });

  it('gets the name and id of the currently active creature for a player session', () => {
    const state = {
      ...defaultState,
      activeCreature: 1,
      sharedActiveCreature: 0,
      round: 1,
    };
    expect(getInitiative(state, true)).toEqual(['Wellby', 1]);
  });

  it('returns no name and id if a shared active creature has not yet been assigned', () => {
    const state = {
      ...defaultState,
      activeCreature: 0,
    };
    expect(getInitiative(state, true)).toEqual(['', null]);
  });

  it('returns no name and id if there are no creatures', () => {
    const state = {
      ...defaultState,
      creatures: [],
    };
    expect(getInitiative(state)).toEqual(['', null]);
  });

  it('returns no name and id if the battle has not started', () => {
    expect(getInitiative(defaultState)).toEqual(['', null]);
  });
});

describe('getInitiative2', () => {
  it('gets the round and the name and id of the currently active creature for a DM session', () => {
    const state = {
      ...defaultState,
      activeCreature: 1,
      round: 1,
    };
    expect(getInitiative2(state)).toEqual([1, 'Goblin #1', 2]);
  });

  it('gets the round and the name and id of the currently active creature for a player session', () => {
    const state = {
      ...defaultState,
      activeCreature: 1,
      round: 1,
    };
    expect(getInitiative2(state, true)).toEqual([1, 'Goblin #1', 2]);
  });

  it('gets the round and the name and id of the currently active creature if it is not shared for a DM session', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          shared: false,
        },
        defaultState.creatures[2],
      ],
      activeCreature: 1,
      round: 1,
    };
    expect(getInitiative2(state, false)).toEqual([1, 'Goblin #1', 2]);
  });

  it('gets the round and the name and id of the previously active creature if the current one is not shared for a player session', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          shared: false,
        },
        defaultState.creatures[2],
      ],
      activeCreature: 1,
      round: 1,
    };
    expect(getInitiative2(state, true)).toEqual([1, 'Wellby', 1]);
  });

  it('reverses through the creatures and rounds if the active creature is not shared until it finds one that is for a player session', () => {
    const state = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[1],
          shared: false,
        },
        {
          ...defaultState.creatures[1],
          shared: false,
        },
        defaultState.creatures[2],
      ],
      activeCreature: 1,
      round: 2,
    };
    expect(getInitiative2(state, true)).toEqual([1, 'Goblin #2', 3]);
  });

  it('returns round 0 and no name and id if a shared creature is not yet active on round 1 for a player session', () => {
    const state = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[1],
          shared: false,
        },
        {
          ...defaultState.creatures[1],
          shared: false,
        },
        defaultState.creatures[2],
      ],
      activeCreature: 1,
      round: 1,
    };
    expect(getInitiative2(state, true)).toEqual([0, '', null]);
  });

  it('returns round 0 and no name and id if there are no shared creatures for a player session', () => {
    const state = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[1],
          shared: false,
        },
        {
          ...defaultState.creatures[1],
          shared: false,
        },
        {
          ...defaultState.creatures[2],
          shared: false,
        },
      ],
      activeCreature: 1,
      round: 1,
    };
    expect(getInitiative2(state, true)).toEqual([0, '', null]);
  });

  it('returns round 0 and no name and id if there are no creatures', () => {
    const state = {
      ...defaultState,
      creatures: [],
    };
    expect(getInitiative2(state)).toEqual([0, '', null]);
  });

  it('returns round 0 and no name and id if the battle has not started', () => {
    const state = {
      ...defaultState,
      round: 0,
    };
    expect(getInitiative2(state)).toEqual([0, '', null]);
  });
});

describe('getRound', () => {
  it('gets the round for a DM session', () => {
    const state = {
      ...defaultState,
      activeCreature: 0,
      sharedActiveCreature: 2,
      round: 2,
      sharedRound: 1,
    };
    expect(getRound(state)).toEqual(2);
  });

  it('gets the shared round for a player session', () => {
    const state = {
      ...defaultState,
      activeCreature: 0,
      sharedActiveCreature: 2,
      round: 2,
      sharedRound: 1,
    };
    expect(getRound(state, true)).toEqual(1);
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
