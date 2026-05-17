import defaultState from '../../test/fixtures/battle';
import Creatures from './creatures';
import Encounter from './Encounter';
import MissingInitiativeError from './MissingInitiativeError';

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

describe('nextTurn', () => {
  it('starts on round 0 with no turn', () => {
    const creatures = new Creatures(defaultState.creatures);
    const encounter = new Encounter(creatures);
    expect(encounter.creatures).toEqual(creatures);
    expect(encounter.round).toBe(0);
    expect(encounter.turn).toBeNull();
  });

  it("advances to the first round and the first creature's turn", () => {
    const creatures = new Creatures(defaultState.creatures);
    const encounter = new Encounter(creatures);
    const nextTurn = encounter.nextTurn();
    expect(nextTurn.creatures).toEqual(creatures);
    expect(nextTurn.round).toBe(1);
    expect(nextTurn.turn).toBe(0);
    expect(nextTurn.turns).toEqual([0]);
  });

  it('sorts creatures by their initiative before advancing to the first turn in a round', () => {
    const creatures = new Creatures([
      ...defaultState.creatures,
      droop,
    ]);
    const encounter = new Encounter(creatures);
    const nextTurn = encounter.nextTurn();

    const expectedCreatures = new Creatures([
      droop,
      ...defaultState.creatures,
    ]);
    expect(nextTurn.creatures).toEqual(expectedCreatures);
    expect(nextTurn.round).toBe(1);
    expect(nextTurn.turn).toBe(3);
  });

  it("advances to the next creature's turn", () => {
    const creatures = new Creatures(defaultState.creatures);
    const encounter = new Encounter(creatures);
    const nextTurn = encounter.nextTurn().nextTurn();
    expect(nextTurn.creatures).toEqual(creatures);
    expect(nextTurn.round).toBe(1);
    expect(nextTurn.turn).toBe(1);
    expect(nextTurn.turns).toEqual([0, 1]);
  });

  it('sorts creatures by their initiative before advancing to the next turn in a round', () => {
    const creatures = new Creatures([
      ...defaultState.creatures,
      droop,
    ]);
    const encounter = new Encounter(creatures, 1, 0, [0]);
    const nextTurn = encounter.nextTurn();

    const expectedCreatures = new Creatures([
      droop,
      ...defaultState.creatures,
    ]);
    expect(nextTurn.creatures).toEqual(expectedCreatures);
    expect(nextTurn.round).toBe(1);
    expect(nextTurn.turn).toBe(3);
  });

  it('starts at the top of the next round after all creatures have had their turn', () => {
    const creatures = new Creatures(defaultState.creatures);
    const encounter = new Encounter(creatures);
    const nextTurn = encounter.nextTurn().nextTurn().nextTurn().nextTurn();
    expect(nextTurn.creatures).toEqual(creatures);
    expect(nextTurn.round).toBe(2);
    expect(nextTurn.turn).toBe(0);
    expect(nextTurn.turns).toEqual([0]);
  });

  it('advances several rounds', () => {
    const creatures = new Creatures([
      droop,
    ]);
    const encounter = new Encounter(creatures);
    const nextTurn = encounter.nextTurn().nextTurn().nextTurn();

    expect(nextTurn.creatures).toEqual(creatures);
    expect(nextTurn.round).toBe(3);
    expect(nextTurn.turn).toBe(3);
    expect(nextTurn.turns).toEqual([3]);
  });

  test('it does nothing if there are no creatures', () => {
    const creatures = new Creatures([]);
    const encounter = new Encounter(creatures);
    const nextTurn = encounter.nextTurn();
    expect(nextTurn.creatures).toEqual(creatures);
    expect(nextTurn.round).toBe(0);
    expect(nextTurn.turn).toBeNull();
    expect(nextTurn.turns).toEqual([]);
  });

  test('throws an error if a creature is missing initiative', () => {
    expect.assertions(2);
    const creatures = new Creatures([
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
    ]);
    const encounter = new Encounter(creatures);

    try {
      encounter.nextTurn();
    } catch (e) {
      expect(e instanceof MissingInitiativeError).toBe(true);
      expect(e.creature).toEqual(creatures.get(3));
    }
  });

  test('throws an error if a creature has an initiative of null', () => {
    expect.assertions(2);
    const creatures = new Creatures([
      ...defaultState.creatures,
      {
        name: 'Droop',
        healthPoints: 10,
        maxHealthPoints: 10,
        initiative: null,
        id: 3,
        alive: true,
        conditions: [],
        notes: [],
      },
    ]);
    const encounter = new Encounter(creatures);

    try {
      encounter.nextTurn();
    } catch (e) {
      expect(e instanceof MissingInitiativeError).toBe(true);
      expect(e.creature).toEqual(creatures.get(3));
    }
  });
});
