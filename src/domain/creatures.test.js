import defaultState from '../../test/fixtures/battle';
import Creature from './creature';
import Creatures from './creatures';

const state = {
  ...defaultState,
  creatures: [
    defaultState.creatures[0],
    {
      ...defaultState.creatures[1],
      selected: true,
    },
    {
      ...defaultState.creatures[2],
      selected: true,
    },
  ],
};

describe('updateCreatureAndSelected', () => {
  it('updates the specified creature and all selected creatures', () => {
    const creatures = new Creatures(state.creatures);
    const newCreatures = creatures.updateCreatureAndSelected(0, (creature) => `${creature.name} updated`);
    expect(newCreatures.list).toEqual([
      'Wellby updated',
      'Goblin #1 updated',
      'Goblin #2 updated',
    ]);
  });

  it('updates only the specified creature if there are no selected creatures', () => {
    const creatures = new Creatures(defaultState.creatures);
    const newCreatures = creatures.updateCreatureAndSelected(0, (creature) => `${creature.name} updated`);
    expect(newCreatures.list).toEqual([
      'Wellby updated',
      new Creature(defaultState.creatures[1]),
      new Creature(defaultState.creatures[2]),
    ]);
  });

  it('updates only selected creatures if the specified creature does not exist', () => {
    const creatures = new Creatures(state.creatures);
    const newCreatures = creatures.updateCreatureAndSelected(3, (creature) => `${creature.name} updated`);
    expect(newCreatures.list).toEqual([
      new Creature(defaultState.creatures[0]),
      'Goblin #1 updated',
      'Goblin #2 updated',
    ]);
  });

  it('does nothing if the specified creature does not exist and there are no selected creatures', () => {
    const creatures = new Creatures(defaultState.creatures);
    const newCreatures = creatures.updateCreatureAndSelected(3, (creature) => `${creature.name} updated`);
    expect(newCreatures.list).toEqual([
      new Creature(defaultState.creatures[0]),
      new Creature(defaultState.creatures[1]),
      new Creature(defaultState.creatures[2]),
    ]);
  });
});

describe('updateCreature', () => {
  it('updates a single specified creature', () => {
    const creatures = new Creatures(defaultState.creatures);
    const newCreatures = creatures.updateCreature(1, (creature) => `${creature.name} updated`, false);
    expect(newCreatures.list).toEqual([
      new Creature(defaultState.creatures[0]),
      'Goblin #1 updated',
      new Creature(defaultState.creatures[2]),
    ]);
  });

  it('does nothing if the specified creature does not exist', () => {
    const creatures = new Creatures(defaultState.creatures);
    const newCreatures = creatures.updateCreature(3, (creature) => `${creature.name} updated`, false);
    expect(newCreatures.list).toEqual([
      new Creature(defaultState.creatures[0]),
      new Creature(defaultState.creatures[1]),
      new Creature(defaultState.creatures[2]),
    ]);
  });
});

describe('updateAll', () => {
  it('updates all creatures', () => {
    const creatures = new Creatures(defaultState.creatures);
    const newCreatures = creatures.updateAll((creature) => `${creature.name} updated`, false);
    expect(newCreatures.list).toEqual([
      'Wellby updated',
      'Goblin #1 updated',
      'Goblin #2 updated',
    ]);
  });
});

describe('getIndex', () => {
  it('returns the index of the specified creature', () => {
    const creatures = new Creatures(defaultState.creatures);
    const index = creatures.getIndex(1);
    expect(index).toBe(1);
  });

  it('returns null if the specified creature does not exist', () => {
    const creatures = new Creatures(defaultState.creatures);
    const index = creatures.getIndex(3);
    expect(index).toBeNull();
  });
});

describe('get', () => {
  it('returns the specified creature', () => {
    const creatures = new Creatures(defaultState.creatures);
    const creature = creatures.get(1);
    expect(creature).toEqual(new Creature(defaultState.creatures[1]));
  });

  it('returns null if the specified creature does not exist', () => {
    const creatures = new Creatures(defaultState.creatures);
    const creature = creatures.get(3);
    expect(creature).toBeNull();
  });
});

describe('getAndSelected', () => {
  it('returns the specified creature as well as all selected creatures', () => {
    const creatures = new Creatures(state.creatures);
    const list = creatures.getAndSelected(0);
    expect(list).toEqual([
      new Creature(state.creatures[0]),
      new Creature(state.creatures[1]),
      new Creature(state.creatures[2]),
    ]);
  });

  it('returns only the specified creature if there are no selected creatures', () => {
    const creatures = new Creatures(defaultState.creatures);
    const list = creatures.getAndSelected(0);
    expect(list).toEqual([
      new Creature(defaultState.creatures[0]),
    ]);
  });

  it('returns only selected creatures if the specified creature does not exist', () => {
    const creatures = new Creatures(state.creatures);
    const list = creatures.getAndSelected(3);
    expect(list).toEqual([
      new Creature(state.creatures[1]),
      new Creature(state.creatures[2]),
    ]);
  });

  it('returns an empty list if the specified creature does not exist and there are no selected creatures', () => {
    const creatures = new Creatures(defaultState.creatures);
    const list = creatures.getAndSelected(3);
    expect(list).toEqual([]);
  });
});

describe('countSelected', () => {
  it('returns the number of selected creatures', () => {
    const creatures = new Creatures(state.creatures);
    expect(creatures.countSelected()).toBe(2);
  });

  it('returns 0 if there are no selected creatures', () => {
    const creatures = new Creatures(defaultState.creatures);
    expect(creatures.countSelected()).toBe(0);
  });
});

describe('serialize', () => {
  it('returns the list of creatures as JSON', () => {
    const creatures = new Creatures(defaultState.creatures);
    expect(creatures.serialize()).toEqual(defaultState.creatures);
  });
});
