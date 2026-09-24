import {
  archiveRecentBattle,
  getRecentBattles,
  recentBattleLimit,
  restoreRecentBattle,
} from './RecentBattlesManager';
import now from '../util/date';
import defaultState from '../../test/fixtures/battle';

jest.mock('../util/date');

const battleWithCreature = (name) => ({
  ...defaultState,
  creatures: [
    {
      ...defaultState.creatures[0],
      id: 0,
      name,
    },
  ],
  creatureIdCount: 1,
});

beforeEach(() => {
  window.localStorage.clear();
  jest.resetAllMocks();
  now.mockReturnValue(1000);
});

describe('recent battles', () => {
  it('archives a battle with content', () => {
    archiveRecentBattle(battleWithCreature('Goblin'));

    const [snapshot] = getRecentBattles();
    expect(snapshot.savedAt).toBe(1000);
    expect(snapshot.state.creatures[0].name).toBe('Goblin');
  });

  it('does not archive an empty battle', () => {
    archiveRecentBattle({
      ...defaultState,
      creatures: [],
      creatureIdCount: 0,
    });

    expect(getRecentBattles()).toEqual([]);
  });

  it('does not keep transient or sharing state in history', () => {
    archiveRecentBattle({
      ...battleWithCreature('Goblin'),
      ariaAnnouncements: ['announcement'],
      errors: ['error'],
      autoSaveError: true,
      loaded: true,
      battleId: 'shared-battle',
      battleCreated: true,
      shareEnabled: true,
      sharedTimestamp: 123,
    });

    const [snapshot] = getRecentBattles();
    expect(snapshot.state).not.toHaveProperty('ariaAnnouncements');
    expect(snapshot.state).not.toHaveProperty('errors');
    expect(snapshot.state).not.toHaveProperty('autoSaveError');
    expect(snapshot.state).not.toHaveProperty('loaded');
    expect(snapshot.state).not.toHaveProperty('battleId');
    expect(snapshot.state).not.toHaveProperty('battleCreated');
    expect(snapshot.state).not.toHaveProperty('shareEnabled');
    expect(snapshot.state).not.toHaveProperty('sharedTimestamp');
  });

  it('does not add the same battle twice in a row', () => {
    const battle = battleWithCreature('Goblin');

    archiveRecentBattle(battle);
    archiveRecentBattle(battle);

    expect(getRecentBattles()).toHaveLength(1);
  });

  it('keeps only the most recent battles', () => {
    for (let i = 0; i < recentBattleLimit + 2; i += 1) {
      now.mockReturnValue(1000 + i);
      archiveRecentBattle(battleWithCreature(`Creature ${i}`));
    }

    const history = getRecentBattles();
    expect(history).toHaveLength(recentBattleLimit);
    expect(history.map(({ state }) => state.creatures[0].name)).toEqual([
      'Creature 4',
      'Creature 3',
      'Creature 2',
    ]);
  });

  it('ignores corrupt history', () => {
    window.localStorage.setItem('battle-history', 'not JSON');
    expect(getRecentBattles()).toEqual([]);
  });

  it('ignores snapshots with an invalid version value', () => {
    const invalid = {
      savedAt: 1000,
      state: {
        ...battleWithCreature('Goblin'),
        battleTrackerVersion: 5,
      },
    };
    window.localStorage.setItem('battle-history', JSON.stringify([invalid]));

    expect(getRecentBattles()).toEqual([]);
  });

  it('ignores battles from a different major version', () => {
    const incompatible = {
      savedAt: 1000,
      state: {
        ...battleWithCreature('Goblin'),
        battleTrackerVersion: '4.0.0',
      },
    };
    window.localStorage.setItem('battle-history', JSON.stringify([incompatible]));

    expect(getRecentBattles()).toEqual([]);
  });

  it('restores battle content while preserving the current runtime and sharing session', () => {
    archiveRecentBattle(battleWithCreature('Goblin'));
    const [snapshot] = getRecentBattles();

    const currentState = {
      ...battleWithCreature('Orc'),
      battleId: 'current-session',
      battleCreated: true,
      shareEnabled: true,
      sharedTimestamp: 999,
      autoSaveError: true,
      loaded: false,
    };

    const restored = restoreRecentBattle(currentState, snapshot);

    expect(restored.creatures[0].name).toBe('Goblin');
    expect(restored.battleId).toBe('current-session');
    expect(restored.battleCreated).toBe(true);
    expect(restored.shareEnabled).toBe(true);
    expect(restored.sharedTimestamp).toBe(999);
    expect(restored.autoSaveError).toBe(true);
    expect(restored.loaded).toBe(false);
    expect(restored.errors).toEqual([]);
    expect(restored.ariaAnnouncements).toEqual(['recent battle restored']);
  });
});
