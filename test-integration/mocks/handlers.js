// eslint-disable-next-line import/no-extraneous-dependencies
import { graphql, rest } from 'msw';

export default [
  rest.get('https://wyqoq6xpifbjlm6xq6jnqugjvm.appsync-realtime-api.eu-west-2.amazonaws.com/graphql', null),

  rest.get('https://www.dnd5eapi.co/api/monsters', (req, res, ctx) => res(
    ctx.json({
      results: [
        { index: 'goblin', name: 'Goblin', url: '/api/monsters/goblin' },
        { index: 'hobgoblin', name: 'Hobgoblin', url: '/api/monsters/hobgoblin' },
        { index: 'mage', name: 'Mage', url: '/api/monsters/mage' },
      ],
    }),
  )),

  rest.get('https://www.dnd5eapi.co/api/monsters/goblin', (req, res, ctx) => res(
    ctx.json({
      index: 'goblin',
      name: 'Goblin',
      hit_points: 7,
      hit_points_roll: '2d6',
      dexterity: 14,
      armor_class: [
        {
          type: 'armor',
          value: 15,
          armor: [
            {
              index: 'leather-armor',
              name: 'Leather Armor',
              url: '/api/equipment/leather-armor',
            },
            {
              index: 'shield',
              name: 'Shield',
              url: '/api/equipment/shield',
            },
          ],
        },
      ],
    }),
  )),

  rest.get('https://www.dnd5eapi.co/api/monsters/mage', (req, res, ctx) => res(
    ctx.json({
      index: 'mage',
      name: 'Mage',
      hit_points: 40,
      hit_points_roll: '9d8',
      dexterity: 14,
      armor_class: [
        {
          type: 'dex',
          value: 12,
        },
        {
          type: 'spell',
          value: 15,
          spell: {
            index: 'mage-armor',
            name: 'Mage Armor',
            url: '/api/spells/mage-armor',
          },
        },
      ],
      special_abilities: [{
        spellcasting: {
          slots: {
            1: 4,
            2: 3,
            3: 3,
            4: 3,
            5: 1,
          },
        },
      }],
    }),
  )),

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
