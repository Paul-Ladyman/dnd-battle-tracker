export default {
  creatures: [
    {
      name: 'Wellby',
      initiative: 13,
      id: 0,
      alive: true,
      conditions: [],
      notes: [],
      locked: false,
      shared: true,
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
      shared: true,
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
      shared: true,
    },
  ],
  creatureIdCount: 2,
  activeCreature: null,
  sharedActiveCreature: null,
  focusedCreature: undefined,
  round: 0,
  sharedRound: 0,
  ariaAnnouncements: [],
  errors: [],
  createCreatureErrors: {},
  battleCreated: false,
  shareEnabled: true,
  battleId: '123',
};
