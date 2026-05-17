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

describe('getFirst', () => {
  it('returns the first creature', () => {
    const creatures = new Creatures(defaultState.creatures);
    const creature = creatures.getFirst();
    expect(creature).toEqual(new Creature(defaultState.creatures[0]));
  });

  it('returns null if the list of creatures is empty', () => {
    const creatures = new Creatures([]);
    const creature = creatures.getFirst();
    expect(creature).toBeNull();
  });
});

describe('findFirst', () => {
  it('returns the first creature that matches', () => {
    const creatures = new Creatures(defaultState.creatures);
    const found = creatures.findFirst((creature) => creature.id === 1);
    expect(found).toEqual(new Creature(defaultState.creatures[1]));
  });

  it('returns null if no creature matches', () => {
    const creatures = new Creatures([]);
    const found = creatures.findFirst((creature) => creature.id === 10);
    expect(found).toBeNull();
  });

  it('returns null if the list of creatures is empty', () => {
    const creatures = new Creatures([]);
    const found = creatures.findFirst((creature) => creature.id === 1);
    expect(found).toBeNull();
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

describe('count', () => {
  it('returns the number of creatures', () => {
    const creatures = new Creatures(state.creatures);
    expect(creatures.count()).toBe(3);
  });

  it('returns 0 if there are no creatures', () => {
    const creatures = new Creatures([]);
    expect(creatures.count()).toBe(0);
  });
});

describe('serialize', () => {
  it('returns the list of creatures as JSON', () => {
    const creatures = new Creatures(defaultState.creatures);
    expect(creatures.serialize()).toEqual(defaultState.creatures);
  });
});

describe('getInitiativeOrder', () => {
  it('sorts out of order creatures by their initiative', () => {
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

    const initiativeOrder = new Creatures(creatures).getInitiativeOrder();
    expect(initiativeOrder.serialize()).toEqual(expectedCreatures);
  });

  it('maintains the original order of creatures with the same initiative', () => {
    const creatures = [
      defaultState.creatures[0],
      {
        ...defaultState.creatures[1],
        initiativeTieBreaker: undefined,
      },
      {
        ...defaultState.creatures[2],
        initiativeTieBreaker: undefined,
      },
    ];

    const initiativeOrder = new Creatures(creatures).getInitiativeOrder();
    expect(initiativeOrder.serialize()).toEqual(creatures);
  });

  it('maintains the original order of creatures with the same initiative and tie breaker', () => {
    const creatures = [
      defaultState.creatures[0],
      {
        ...defaultState.creatures[1],
        initiativeTieBreaker: 1,
      },
      {
        ...defaultState.creatures[2],
        initiativeTieBreaker: 1,
      },
    ];

    const initiativeOrder = new Creatures(creatures).getInitiativeOrder();
    expect(initiativeOrder.serialize()).toEqual(creatures);
  });

  it('sorts creatures with the same initiative according to their tie breaker', () => {
    const creatures = [
      defaultState.creatures[0],
      {
        ...defaultState.creatures[1],
        initiativeTieBreaker: 1,
      },
      {
        ...defaultState.creatures[2],
        initiativeTieBreaker: 2,
      },
    ];

    const expectedCreatures = [
      creatures[0],
      creatures[2],
      creatures[1],
    ];

    const initiativeOrder = new Creatures(creatures).getInitiativeOrder();
    expect(initiativeOrder.serialize()).toEqual(expectedCreatures);
  });

  it('treats a null tie breaker as 0', () => {
    const creatures = [
      defaultState.creatures[0],
      {
        ...defaultState.creatures[1],
        initiativeTieBreaker: null,
      },
      {
        ...defaultState.creatures[2],
        initiativeTieBreaker: 1,
      },
    ];

    const expectedCreatures = [
      creatures[0],
      creatures[2],
      creatures[1],
    ];

    const initiativeOrder = new Creatures(creatures).getInitiativeOrder();
    expect(initiativeOrder.serialize()).toEqual(expectedCreatures);
  });

  it('treats an undefined tie breaker as 0', () => {
    const creatures = [
      defaultState.creatures[0],
      {
        ...defaultState.creatures[1],
        initiativeTieBreaker: undefined,
      },
      {
        ...defaultState.creatures[2],
        initiativeTieBreaker: 1,
      },
    ];

    const expectedCreatures = [
      creatures[0],
      creatures[2],
      creatures[1],
    ];

    const initiativeOrder = new Creatures(creatures).getInitiativeOrder();
    expect(initiativeOrder.serialize()).toEqual(expectedCreatures);
  });
});
