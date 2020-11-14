
import { gql } from '@apollo/client';

const Battle = `{
  battleId
  creatureCount
  round
  creatures
  activeCreature
  focusedCreature
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