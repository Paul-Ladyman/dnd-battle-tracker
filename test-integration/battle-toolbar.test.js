import { graphql, HttpResponse } from 'msw';
import DmApp from './page-object-models/dmApp';
import PlayerApp from './page-object-models/playerApp';
import msw from './mocks/server';
import { cache } from '../src/graphql/apolloClient';

describe('Time Elapsed', () => {
  it('begins at time zero', async () => {
    const dmApp = new DmApp();
    await dmApp.battleToolbar.assertTimeElapsed('00:00');
  });

  it('does not increment the timer when the battle starts', async () => {
    const dmApp = new DmApp();
    await dmApp.battleToolbar.startBattle();
    await dmApp.battleToolbar.assertTimeElapsed('00:00');
  });

  it.each([
    ['00', '06', 1],
    ['00', '12', 2],
    ['00', '54', 9],
    ['01', '00', 10],
    ['01', '06', 11],
  ])('increments the timer by %d minutes and %d seconds after %d rounds', async (minutes, seconds, rounds) => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1', null, '2');
    await dmApp.battleToolbar.startBattle();
    await dmApp.battleToolbar.advanceTurns(rounds * 2);
    await dmApp.battleToolbar.assertTimeElapsed(`${minutes}:${seconds}`);
  });
});

describe('Turn - DM', () => {
  test('the current turn button is disabled if there are no creatures', async () => {
    const _ = new DmApp();
    await DmApp.assertCurrentTurn(false, '...');
  });

  test('the current turn button is disabled if the battle has not started', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await DmApp.assertCurrentTurn(false, '...');
  });

  test('the current turn button is enabled when the battle starts', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1');
    await dmApp.battleToolbar.startBattle();
    await DmApp.assertCurrentTurn(true, 'goblin');
  });
});

describe('Turn - Player', () => {
  beforeEach(async () => {
    await cache.reset();
  });

  test('the current turn button is disabled if there are no creatures', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    await PlayerApp.assertCurrentTurn(false, '...');
  });

  test('the current turn button is disabled if the battle has not started', async () => {
    msw.use(
      graphql.query('GET_BATTLE', () => HttpResponse.json({
        data: {
          getDndbattletracker: {
            battleId: 'some-battle-id',
            round: 0,
            creatures: [{
              name: 'goblin',
              id: 1,
              locked: false,
              shared: true,
              hitPointsShared: true,
              alive: true,
              initiative: 1,
              healthPoints: 1,
              maxHealthPoints: 1,
              conditions: [],
              notes: [],
            }],
            activeCreature: null,
          },
        },
      })),
    );
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    await PlayerApp.assertCurrentTurn(false, '...');
  });

  test('the current turn button is enabled when the battle starts', async () => {
    msw.use(
      graphql.query('GET_BATTLE', () => HttpResponse.json({
        data: {
          getDndbattletracker: {
            battleId: 'some-battle-id',
            activeCreature: 0,
            round: 1,
            creatures: [{
              name: 'goblin',
              id: 1,
              locked: false,
              shared: true,
              hitPointsShared: true,
              alive: true,
              initiative: 1,
              healthPoints: 1,
              maxHealthPoints: 1,
              conditions: [],
              notes: [],
            }],
          },
        },
      })),
    );
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    await PlayerApp.assertCurrentTurn(true, 'goblin');
  });
});
