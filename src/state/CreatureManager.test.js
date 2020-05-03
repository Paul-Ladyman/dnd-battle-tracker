import { 
  killCreature,
  stabalizeCreature,
  damageCreature,
  healCreature,
  createCreature,
  addNoteToCreature,
  removeNoteFromCreature,
  addHealthToCreature,
  validateCreature,
  addInitiativeToCreature,
  toggleCreatureLock,
  resetCreature
} from './CreatureManager';
import conditions, { conditionDescriptions } from '../model/conditions';

const defaultState = {
  creatures:[
    {
      name: 'Wellby',
      initiative: 13,
      id: 0,
      alive:true,
      conditions: [],
      notes: [],
      locked: false
    },
    {
      name: 'Goblin',
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 1,
      alive: true,
      conditions: [],
      notes: [],
      locked: true
    },
    {
      name: 'Goblin 2',
      initiative: 12,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 2,
      alive: true,
      conditions: [],
      notes: [],
      locked: false
    }
  ],
  creatureIdCount: 3,
  creatureCount: 3,
  activeCreature: 1,
  round: 1,
  ariaAnnouncements: [],
  errors: [],
  createCreatureErrors: {}
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
      ],
      ariaAnnouncements: ['Wellby killed/made unconscious']
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
      ],
      ariaAnnouncements: ['Goblin killed/made unconscious']
    };

    const result = killCreature(defaultState, 1);
    expect(result).toEqual(expected);
  });
});

describe('stabalizeCreature', () => {
  test('it stabalizes a creature who is dead with 0 hit points', () => {
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
      ],
      ariaAnnouncements: ['Goblin stabalized']
    };

    expect(stabalizeCreature(state, 1)).toEqual(expected);
  });

  test('it stabalizes a creature who is dead with no hit points', () => {
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
      ],
      ariaAnnouncements: ['Wellby stabalized']
    };

    expect(stabalizeCreature(state, 0)).toEqual(expected);
  });

  test('it stabalizes a creature who is already alive', () => {
    const expected = {
      ...defaultState,
      ariaAnnouncements: ['Wellby stabalized']
    }
    expect(stabalizeCreature(defaultState, 0)).toEqual(expected);
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

  test('it does nothing if the damage is negative', () => {
    expect(damageCreature(defaultState, 1, -1)).toEqual(defaultState);
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
      ],
      ariaAnnouncements: ['damaged Goblin by 5. Goblin\'s health is 5']
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
      ],
      ariaAnnouncements: ['damaged Goblin by 10. Goblin\'s health is 0']
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
      ],
      ariaAnnouncements: ['damaged Goblin by 100. Goblin\'s health is 0']
    };

    expect(damageCreature(defaultState, 1, 100)).toEqual(expected);
  });
});

describe('healCreature', () => {
  test('it does nothing if a creature has no health points', () => {
    expect(healCreature(defaultState, 0, 5)).toEqual(defaultState);
  });

  test('it does nothing to a fully healed creature', () => {
    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['healed Goblin by 5. Goblin\'s health is 10']
    };
    expect(healCreature(defaultState, 1, 5)).toEqual(expectedState);
  });

  test('it does nothing if the damage is negative', () => {
    expect(healCreature(defaultState, 1, -1)).toEqual(defaultState);
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

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['healed Goblin by 5. Goblin\'s health is 10']
    };

    expect(healCreature(state, 1, 5)).toEqual(expectedState);
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

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['healed Goblin by 10. Goblin\'s health is 10']
    };

    expect(healCreature(state, 1, 10)).toEqual(expectedState);
  });

  test('it stabalizes a creature if it was dead', () => {
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
      ],
      ariaAnnouncements: ['healed Goblin by 1. Goblin\'s health is 1']
    };

    expect(healCreature(state, 1, 1)).toEqual(expected);
  });
});

describe('createCreature', () => {
  test('it creates a new creature given a name, initiative and health points', () => {
    const expectedCreature = {
      name: 'name',
      rawName: 'name',
      initiative: 13,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 1,
      alive: true,
      conditions: [],
      notes: [],
      locked: false
    };

    const creature = createCreature(1, {name: 'name', initiative: 13,  healthPoints: 10});
    expect(creature).toEqual(expectedCreature);
  });

  test('it strips numbers and whitespace from the name to create the rawName', () => {
    const expectedCreature = {
      name: 'name 1',
      rawName: 'name',
      initiative: 13,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 1,
      alive: true,
      conditions: [],
      notes: [],
      locked: false
    };

    const creature = createCreature(1, {name: 'name 1', initiative: 13,  healthPoints: 10});
    expect(creature).toEqual(expectedCreature);
  });

  test('it creates a new creature given a name, initiative, health points and a number', () => {
    const expectedCreature = {
      name: 'name #3',
      rawName: 'name',
      initiative: 13,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 1,
      alive: true,
      conditions: [],
      notes: [],
      locked: false
    };

    const creature = createCreature(1, {name: 'name', number: 3, initiative: 13,  healthPoints: 10});
    expect(creature).toEqual(expectedCreature);
  });
});

describe('validateCreature', () => {
  test('returns undefined if creature is valid', () => {
    expect(validateCreature('a', '1', 1, 1)).toEqual(undefined);
  });

  test('initiative is optional', () => {
    expect(validateCreature('a', undefined, 1, 1)).toEqual(undefined);
  });

  test('health is optional', () => {
    expect(validateCreature('a', '1', undefined, 1)).toEqual(undefined);
  });

  test('name must be non-empty', () => {
    const expectedErrors = {
      nameError: 'Name must be provided.',
      initiativeError: false,
      healthError: false,
      multiplierError: false
    };
    expect(validateCreature('', '1', 1, 1)).toEqual(expectedErrors);
  });

  test('initiative must be a number if non-empty', () => {
    const expectedErrors = {
      nameError: false,
      initiativeError: 'Initiative must be a number.',
      healthError: false,
      multiplierError: false
    };
    expect(validateCreature('a', NaN, 1, 1)).toEqual(expectedErrors);
  });

  test('health must be greater than 0', () => {
    const expectedErrors = {
      nameError: false,
      initiativeError: false,
      healthError: 'Health must be greater than 0.',
      multiplierError: false
    };
    expect(validateCreature('a', 1, 0, 1)).toEqual(expectedErrors);
  });

  test('multiplier must be greater than 0', () => {
    const expectedErrors = {
      nameError: false,
      initiativeError: false,
      healthError: false,
      multiplierError: 'Multiplier must be greater than 0 and less than 50.'
    };
    expect(validateCreature('a', 1, 1, 0)).toEqual(expectedErrors);
  });

  test('multiplier must be less than 51', () => {
    const expectedErrors = {
      nameError: false,
      initiativeError: false,
      healthError: false,
      multiplierError: 'Multiplier must be greater than 0 and less than 50.'
    };
    expect(validateCreature('a', 1, 1, 51)).toEqual(expectedErrors);
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
      ],
      ariaAnnouncements: ['note added to Goblin']
    };
    expect(result).toEqual(expectedState);
  });

  test('it adds a note as a condition to a creature if isCondition is true', () => {
    const state = {
      ...defaultState,
      round: 2
    };

    const result = addNoteToCreature(state, 1, conditions[0], true);

    const expectedCondition = {
      text: conditions[0],
      appliedAtRound: 2,
      appliedAtSeconds: 6,
      url: conditionDescriptions.Blinded
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
      ],
      ariaAnnouncements: ['Blinded condition added to Goblin']
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
      ],
      ariaAnnouncements: ['unknown condition added to Goblin']
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

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['note removed from Goblin']
    }

    const result = removeNoteFromCreature(state, 1, note, false);

    expect(result).toEqual(expectedState);
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
      ],
      ariaAnnouncements: ['note removed from Goblin']
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

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['note removed from Goblin']
    }

    const result = removeNoteFromCreature(state, 1, note, false);

    expect(result).toEqual(expectedState);
  });

  test('it removes a condition from a creature if isCondition is true', () => {
    const condition = {
      text: 'blinded',
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

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['blinded condition removed from Goblin']
    }

    const result = removeNoteFromCreature(state, 1, condition, true);

    expect(result).toEqual(expectedState);
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
      ],
      ariaAnnouncements: ['Wellby\'s health is 10, max health is 10']
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
      ],
      ariaAnnouncements: ['Wellby\'s health is 0, max health is 10']
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

describe('addInitiativeToCreature', () => {
  it('adds initiative to a creature that does not already have it', () => {
    const expectedState = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          initiative: 10
        },
        defaultState.creatures[2]
      ],
      ariaAnnouncements: ['Goblin\'s initiative is 10']
    };

    const result = addInitiativeToCreature(defaultState, 1, 10);
    expect(result).toEqual(expectedState);
  });

  it('does nothing to a creature that already has initiative', () => {
    const result = addInitiativeToCreature(defaultState, 0, 30);
    expect(result).toEqual(defaultState);
  });
});

describe('toggleCreatureLock', () => {
  it('locks a creature if it is unlocked', () => {
    const expectedState = {
      ...defaultState,
      creatures: [
        {
          ...defaultState.creatures[0],
          locked: true
        },
        defaultState.creatures[1],
        defaultState.creatures[2],
      ],
      ariaAnnouncements: ['Wellby is locked']
    };

    const result = toggleCreatureLock(defaultState, 0);
    expect(result).toEqual(expectedState);
  });

  it('unlocks a creature if it is locked', () => {
    const expectedState = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          locked: false
        },
        defaultState.creatures[2],
      ],
      ariaAnnouncements: ['Goblin is unlocked']
    };

    const result = toggleCreatureLock(defaultState, 1);
    expect(result).toEqual(expectedState);
  });
});

describe('resetCreatures', () => {
  it('resets a creature\'s id, initiative, notes and conditions', () => {
    const creature = {
      name: 'Goblin',
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 1,
      alive: true,
      conditions: [],
      notes: [{text: "Exhaustion", appliedAtRound: 1, appliedAtSeconds: 6}],
      conditions: [{text: "Exhaustion", appliedAtRound: 1, appliedAtSeconds: 6, url: 'someurl'}],
      locked: true
    }
    const expectedCreature = {
      ...creature,
      initiative: undefined,
      id: 0,
      notes: [{text: "Exhaustion", appliedAtRound: 0, appliedAtSeconds: 0}],
      conditions: [{text: "Exhaustion", appliedAtRound: 0, appliedAtSeconds: 0, url: 'someurl'}],
    };
    const result = resetCreature(0, creature);
    expect(result).toEqual(expectedCreature);
  });
});