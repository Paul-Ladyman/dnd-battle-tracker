// eslint-disable-next-line import/no-extraneous-dependencies
import { graphql, rest } from 'msw';

export default [
  rest.get('https://wyqoq6xpifbjlm6xq6jnqugjvm.appsync-realtime-api.eu-west-2.amazonaws.com/graphql', null),

  graphql.mutation('CREATE_BATTLE', (req, res, ctx) => res(
    ctx.data({
      createDndbattletracker: {
        battleId: 'some-battle-id',
      },
    }),
  )),

  graphql.query('GET_BATTLE', (req, res, ctx) => res(
    ctx.data({
      getDndbattletracker: {
        battleId: 'some-battle-id',
        round: 0,
        creatures: [],
        activeCreature: null,
      },
    }),
  )),
];
