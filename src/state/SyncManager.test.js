import { syncBattle } from './SyncManager';

const createBattleMock = jest.fn();
const updateBattleMock = jest.fn();

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
    }
  ],
  creatureIdCount: 3,
  creatureCount: 3,
  activeCreature: 1,
  round: 1,
  ariaAnnouncements: [],
  errors: [],
  createCreatureErrors: {},
  battleId: '123',
  battleCreated: false
};

const date = new Date(1605815493000);

const expectedSyncInput = { variables: { battleinput: {
  battleId: defaultState.battleId,
  creatureCount: defaultState.creatureCount,
  round: defaultState.round,
  creatures: defaultState.creatures,
  activeCreature: defaultState.activeCreature,
  focusedCreature: defaultState.focusedCreature,
  expdate: 1605901893
}}}

beforeEach(() => {
  createBattleMock.mockReset();
  updateBattleMock.mockReset();
});

describe('syncBattle', () => {
  it('creates a new battle with a 24 hour TTL', () => {
    const newState = syncBattle(defaultState, createBattleMock, updateBattleMock, date);

    expect(newState).toEqual({ ...defaultState, battleCreated: true });
    expect(createBattleMock).toHaveBeenCalledTimes(1);
    expect(createBattleMock.mock.calls[0][0]).toEqual(expectedSyncInput);
    expect(updateBattleMock).not.toHaveBeenCalled();
  });

  it('updates an existing battle with a 24 hour TTL', () => {
    const state = { ...defaultState, battleCreated: true };
    const newState = syncBattle(state, createBattleMock, updateBattleMock, date);

    expect(newState).toEqual(state);
    expect(updateBattleMock).toHaveBeenCalledTimes(1);
    expect(updateBattleMock.mock.calls[0][0]).toEqual(expectedSyncInput);
    expect(createBattleMock).not.toHaveBeenCalled();
  });
  
});