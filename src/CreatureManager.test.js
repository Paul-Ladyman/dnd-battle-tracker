import { 
  killCreature,
  reviveCreature,
  damageCreature,
  healCreature,
  createCreature,
  addNoteToCreature,
  removeNoteFromCreature,
  addHealthToCreature
} from './CreatureManager';
import { conditionDescriptions } from './conditions';

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

describe('createCreature', () => {
  test('it creates a new creature given a name, initiative and health points', () => {
    const expectedCreature = {
      name: 'name',
      initiative: 13,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 1,
      alive: true,
      conditions: [],
      notes: []
    };

    const creature = createCreature(1, {name: 'name', initiative: 13,  healthPoints: 10});
    expect(creature).toEqual(expectedCreature);
  });
});

describe('addNoteToCreature', () => {
  test('it adds a note to a creature including application round and time', () => {
    const state = {
      ...defaultState,
      round: 2
    };

    const result = addNoteToCreature(state, 1, 'some note', false);

    const expectedNote = {
      text: 'some note',
      appliedAtRound: 2,
      appliedAtSeconds: 6
    };

    const expectedState = {
      ...state,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          notes: [
            expectedNote
          ]
        },
        defaultState.creatures[2]
      ]
    };
    expect(result).toEqual(expectedState);
  });

  test('it adds a note as a condition to a creature if isCondition is true', () => {
    const state = {
      ...defaultState,
      round: 2
    };

    const result = addNoteToCreature(state, 1, 'blinded', true);

    const expectedCondition = {
      text: 'blinded',
      appliedAtRound: 2,
      appliedAtSeconds: 6,
      url: conditionDescriptions.blinded
    };

    const expectedState = {
      ...state,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          conditions: [
            expectedCondition
          ]
        },
        defaultState.creatures[2]
      ]
    };
    expect(result).toEqual(expectedState);
  });

  test('it does not add a URL to a condition if no URL is known', () => {
    const state = {
      ...defaultState,
      round: 2
    };

    const result = addNoteToCreature(state, 1, 'unknown', true);

    const expectedCondition = {
      text: 'unknown',
      appliedAtRound: 2,
      appliedAtSeconds: 6
    };

    const expectedState = {
      ...state,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          conditions: [
            expectedCondition
          ]
        },
        defaultState.creatures[2]
      ]
    };
    expect(result).toEqual(expectedState);
  });
});

describe('removeNoteFromCreature', () => {
  test('it removes a note from a creature', () => {
    const note = {
      text: 'some note',
      appliedAtRound: 2,
      appliedAtSeconds: 6
    };
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          notes: [ note ]
        },
        defaultState.creatures[2]
      ]
    };

    const result = removeNoteFromCreature(state, 1, note, false);

    expect(result).toEqual(defaultState);
  });

  test('it does not remove other notes with the same text as the one being removed', () => {
    const note = {
      text: 'some note',
      appliedAtRound: 2,
      appliedAtSeconds: 6
    };
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          notes: [
            {
              text: 'some note',
              appliedAtRound: 1,
              appliedAtSeconds: 0
            },
            note
          ]
        },
        defaultState.creatures[2]
      ]
    };

    const expectedState = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          notes: [
            {
              text: 'some note',
              appliedAtRound: 1,
              appliedAtSeconds: 0
            }
          ]
        },
        defaultState.creatures[2]
      ]
    };

    const result = removeNoteFromCreature(state, 1, note, false);

    expect(result).toEqual(expectedState);
  });

  test('it removes all duplicate notes from a creature', () => {
    const note = {
      text: 'some note',
      appliedAtRound: 2,
      appliedAtSeconds: 6
    };
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          notes: [
            note,
            note
          ]
        },
        defaultState.creatures[2]
      ]
    };

    const result = removeNoteFromCreature(state, 1, note, false);

    expect(result).toEqual(defaultState);
  });

  test('it removes a condition from a creature if isCondition is true', () => {
    const condition = {
      text: 'some condition',
      appliedAtRound: 2,
      appliedAtSeconds: 6
    };

    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          conditions: [ condition ]
        },
        defaultState.creatures[2]
      ]
    };

    const result = removeNoteFromCreature(state, 1, condition, true);

    expect(result).toEqual(defaultState);
  });
});

describe('addHealthToCreature', () => {
  it('adds health to a creature that does not already have it', () => {
    const expectedState = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[0],
          healthPoints: 10,
          maxHealthPoints: 10
        },
        defaultState.creatures[1],
        defaultState.creatures[2]
      ]
    };

    const result = addHealthToCreature(defaultState, 0, 10);
    expect(result).toEqual(expectedState);
  });

  it('sets healthPoints to 0 if creature is dead', () => {
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

    const expectedState = {
      ...state,
      creatures: [
        {
          ...state.creatures[0],
          healthPoints: 0,
          maxHealthPoints: 10
        },
        defaultState.creatures[1],
        defaultState.creatures[2]
      ]
    };

    const result = addHealthToCreature(state, 0, 10);
    expect(result).toEqual(expectedState);
  });

  it('does nothing to a creature that already has health', () => {
    const result = addHealthToCreature(defaultState, 1, 30);
    expect(result).toEqual(defaultState);
  });

  it('does nothing to a creature if 0 health is added', () => {
    const result = addHealthToCreature(defaultState, 0, 0);
    expect(result).toEqual(defaultState);
  });

  it('does nothing to a creature if less than 0 health is added', () => {
    const result = addHealthToCreature(defaultState, 0, -1);
    expect(result).toEqual(defaultState);
  });
});