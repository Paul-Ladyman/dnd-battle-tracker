// eslint-disable-next-line import/no-extraneous-dependencies
import { graphql, http, HttpResponse } from 'msw';

export default [
  http.get('https://wyqoq6xpifbjlm6xq6jnqugjvm.appsync-realtime-api.eu-west-2.amazonaws.com/graphql', null),

  http.get('https://www.dnd5eapi.co/api/monsters', () => HttpResponse.json({
    results: [
      { index: 'goblin', name: 'Goblin', url: '/api/monsters/goblin' },
      { index: 'hobgoblin', name: 'Hobgoblin', url: '/api/monsters/hobgoblin' },
      { index: 'mage', name: 'Mage', url: '/api/monsters/mage' },
    ],
  })),

  http.get('https://www.dnd5eapi.co/api/monsters/goblin', () => HttpResponse.json({
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
  })),

  http.get('https://www.dnd5eapi.co/api/monsters/mage', () => HttpResponse.json(
    {
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
    },
  )),

  graphql.mutation('CREATE_BATTLE', () => HttpResponse.json({
    data: {
      createDndbattletracker: {
        battleId: 'some-battle-id',
      },
    },
  })),

  graphql.query('GET_BATTLE', () => HttpResponse.json({
    data: {
      getDndbattletracker: {
        battleId: 'some-battle-id',
        round: 0,
        creatures: [],
        activeCreature: null,
      },
    },
  })),
];
