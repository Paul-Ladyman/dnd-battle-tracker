// eslint-disable-next-line import/no-extraneous-dependencies
import { graphql, http, HttpResponse } from 'msw';

export default [
  http.get('https://wyqoq6xpifbjlm6xq6jnqugjvm.appsync-realtime-api.eu-west-2.amazonaws.com/graphql', null),

  http.get('https://www.dnd5eapi.co/api/monsters', () => HttpResponse.json({
    results: [
      { index: 'goblin', name: 'Goblin', url: '/api/monsters/goblin' },
      { index: 'hobgoblin', name: 'Hobgoblin', url: '/api/monsters/hobgoblin' },
      { index: 'mage', name: 'Mage', url: '/api/monsters/mage' },
      { index: 'mage', name: 'Couatl', url: '/api/monsters/couatl' },
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

  http.get('https://www.dnd5eapi.co/api/monsters/couatl', () => HttpResponse.json(
    {
      index: 'couatl',
      name: 'Couatl',
      hit_points: 97,
      hit_points_roll: '13d8+39',
      dexterity: 20,
      armor_class: [
        {
          type: 'natural',
          value: 19,
        },
      ],
      special_abilities: [{
        spellcasting: {
          spells: [
            {
              name: 'Detect Evil and Good',
              level: 1,
              url: '/api/spells/detect-evil-and-good',
              usage: {
                type: 'at will',
                rest_types: [],
              },
            },
            {
              name: 'Bless',
              level: 1,
              url: '/api/spells/bless',
              usage: {
                type: 'per day',
                times: 3,
                rest_types: [],
              },
            },
            {
              name: 'Dream',
              level: 5,
              url: '/api/spells/dream',
              usage: {
                type: 'per day',
                times: 1,
                rest_types: [],
              },
            },
          ],
        },
      }],
    },
  )),

  http.get('https://www.dnd5eapi.co/api/spells', () => HttpResponse.json({
    results: [
      {
        index: 'acid-arrow',
        name: 'Acid Arrow',
        level: 2,
        url: '/api/spells/acid-arrow',
      },
      {
        index: 'acid-splash',
        name: 'Acid Splash',
        level: 0,
        url: '/api/spells/acid-splash',
      },
      {
        index: 'aid',
        name: 'Aid',
        level: 2,
        url: '/api/spells/aid',
      },
    ],
  })),

  graphql.mutation('CREATE_BATTLE', () => HttpResponse.json({
    data: {
      createDndbattletracker: {
        battleId: 'some-battle-id',
      },
    },
  })),

  graphql.mutation('UPDATE_BATTLE', () => HttpResponse.json({
    data: {
      updateDndbattletracker: {
        battleId: 'some-battle-id',
        round: 0,
        creatures: [],
        activeCreature: null,
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
