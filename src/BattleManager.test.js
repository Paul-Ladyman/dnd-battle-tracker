import { 
  newBattleState,
  getSecondsElapsed,
  startBattle
} from './BattleManager';

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
  ],
  creatureIdCount: 1,
  creatureCount: 1,
  activeCreature: undefined,
  round: 0
};

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

describe('startBattle', () => {
  test('it starts the first round with the first creature in the list', () => {
    const expected = {
      ...defaultState,
      round: 1,
      activeCreature: 0
    };
    expect(startBattle(defaultState)).toEqual(expected);
  });

  test('it does nothing to a battle that has just started', () => {
    const state = {
      ...defaultState,
      round: 1,
      activeCreature: 0
    };
    expect(startBattle(state)).toEqual(state);
  });

  test('it resets a battle that is in progress', () => {
    const state = {
      ...defaultState,
      round: 5,
      activeCreature: 3
    };

    const expected = {
      ...defaultState,
      round: 1,
      activeCreature: 0
    };

    expect(startBattle(state)).toEqual(expected);
  });
});