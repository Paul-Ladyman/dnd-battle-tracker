import { graphql, HttpResponse } from 'msw';
import DmApp from '../page-object-models/dmApp';
import random from '../../src/util/random';
import PlayerApp from '../page-object-models/playerApp';
import msw from '../mocks/server';
import { cache } from '../../src/graphql/apolloClient';

jest.mock('../../src/util/random');

describe('Initiative display - DM', () => {
  beforeEach(() => {
    random.mockReset();
    random.mockReturnValue(0.999999);
  });

  test('does not show initiative if the creature does not have an initiative', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextNotVisible('goblin', 'Initiative');
  });

  test("shows a creature's initiative", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Initiative 1');
  });

  test("shows a creature's initiative if it is 0", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '0');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Initiative 0');
  });

  test("shows a creature's rolled initiative", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1d20+2');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Initiative 22 ([20] + 2)');
  });

  test("shows a creature's rolled initiative if it is 0", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1d20-20');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Initiative 0 ([20] - 20)');
  });

  test("shows a creature's initiative when added from the initiative tool", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.initiativeTool.setCreatureInitiative('goblin', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Initiative 1');
  });

  test("shows a creature's initiative if it is 0 when added from the initiative tool", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.initiativeTool.setCreatureInitiative('goblin', '0');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Initiative 0');
  });

  test("shows a locked creature's new initiative after the battle has been reset", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1d20+2');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.menuTool.lockCreature('goblin');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickYes();
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.initiativeTool.setCreatureInitiative('goblin', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Initiative 1');
  });

  test('does not show tie breaker if the creature does not have a tie breaker', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextNotVisible('goblin', 'Tie');
  });

  test('does not show tie breaker if the creature does not have initiative', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.initiativeTool.setTieBreaker('goblin', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextNotVisible('goblin', 'Tie');
  });

  test("shows a creature's tie breaker alongside initiative", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.initiativeTool.setTieBreaker('goblin', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Initiative 1 (Tie 1)');
  });

  test("shows a creature's tie breaker alongside rolled initiative", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1d20+2');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.initiativeTool.setTieBreaker('goblin', '1');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextVisible('goblin', 'Initiative 22 ([20] + 2) (Tie 1)');
  });
});

describe('Initiative display - Player', () => {
  beforeEach(async () => {
    await cache.reset();
  });

  test('does not show initiative if the creature does not have an initiative', async () => {
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
              initiative: null,
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
    const playerApp = new PlayerApp();
    await PlayerApp.waitForOnline();
    await playerApp.creature.expand('goblin');
    await playerApp.creature.assertExpandedTextNotVisible('goblin', 'Initiative');
  });

  test("shows a creature's initiative", async () => {
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
    const playerApp = new PlayerApp();
    await PlayerApp.waitForOnline();
    await playerApp.creature.expand('goblin');
    await playerApp.creature.assertExpandedTextVisible('goblin', 'Initiative 1');
  });

  test("shows a creature's initiative if it is 0", async () => {
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
              initiative: 0,
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
    const playerApp = new PlayerApp();
    await PlayerApp.waitForOnline();
    await playerApp.creature.expand('goblin');
    await playerApp.creature.assertExpandedTextVisible('goblin', 'Initiative 0');
  });

  test("shows a creature's tie breaker", async () => {
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
              initiativeTieBreaker: 1,
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
    const playerApp = new PlayerApp();
    await PlayerApp.waitForOnline();
    await playerApp.creature.expand('goblin');
    await playerApp.creature.assertExpandedTextVisible('goblin', 'Initiative 1 (Tie 1)');
  });
});
