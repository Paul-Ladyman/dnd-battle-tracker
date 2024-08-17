import { gql } from '@apollo/client';

const Condition = `{
  text
  appliedAtRound
  appliedAtSeconds
  url
  id
}`;

const Note = `{
  text
  appliedAtRound
  appliedAtSeconds
}`;

const Battle = `{
  battleId
  round
  creatures {
    id
    name
    initiative
    initiativeTieBreaker
    healthPoints
    maxHealthPoints
    alive
    conditions ${Condition}
    notes ${Note}
    shared
    hitPointsShared
  }
  activeCreature
}`;

export const GET_BATTLE = gql`
query GET_BATTLE($battleId: String!) {
  getDndbattletracker(battleId: $battleId) ${Battle}
}
`;

export const SYNC_BATTLE = gql`
subscription SYNC_BATTLE($battleId: String!) {
  onUpdateDndbattletracker(battleId: $battleId) ${Battle}
}
`;

export const CREATE_BATTLE = gql`
mutation CREATE_BATTLE($battleinput: BattleInput!) {
  createDndbattletracker(input: $battleinput) {
    battleId
  }
}
`;

export const UPDATE_BATTLE = gql`
mutation UPDATE_BATTLE($battleinput: BattleInput!) {
  updateDndbattletracker(input: $battleinput) ${Battle}
}
`;
