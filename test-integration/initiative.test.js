import { graphql } from 'msw';
import DmApp from './page-object-models/dmApp';
import PlayerApp from './page-object-models/playerApp';
import msw from './mocks/server';
import { cache } from '../src/graphql/apolloClient';

describe('Battle Toolbar initiative controls - DM', () => {
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
    await dmApp.startBattle();
    await DmApp.assertCurrentTurn(true, 'goblin');
  });
});

describe('Battle Toolbar initiative controls - Player', () => {
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
      graphql.query('GET_BATTLE', (req, res, ctx) => res(
        ctx.data({
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
        }),
      )),
    );
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    await PlayerApp.assertCurrentTurn(false, '...');
  });

  test('the current turn button is enabled when the battle starts', async () => {
    msw.use(
      graphql.query('GET_BATTLE', (req, res, ctx) => res(
        ctx.data({
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
        }),
      )),
    );
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    await PlayerApp.assertCurrentTurn(true, 'goblin');
  });
});
